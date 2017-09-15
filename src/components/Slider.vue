<template>
  <div
    class="slider-container"
  >
    <div
      class="slider-viewport"
      @mouseover="manipulating = true"
      @mouseout="manipulating = false"
      ref="viewport"
      :style="{height: `${sliderHeight}px`}"
    >
      <div class="ruler-container">
        <div
          class="ruler"
          :style="{width: `${duration * localStepSize}px`}"
        >
          <div
            class="marker start-marker"
            :style="{left: `${localStartMarkerPosition}px`}"
            @mousedown.prevent="onStartMarkerDown"
          ></div>

          <div
            class="marked"
            :style="{left: `${localStartMarkerPosition}px`, width: `${localEndMarkerPosition - localStartMarkerPosition}px`}"
          >
          </div>
          
          <div
            class="marker end-marker"
            :style="{left: `${localEndMarkerPosition}px`}"
            @mousedown="onEndMarkerDown"
          ></div>

          <div
            class="marker time-marker"
            :style="{left: `${localTimeMarkerPosition}px`}"
          ></div>

          <div
            class="seconds"
            :style="{'background-size': `${localStepSize}px ${localStepSize}px`}">
          </div>
        </div>
      </div>
    </div>
    <div
      class="slider-zoom"
      @mousedown="zoomDown"
    >V</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Slider',

  props: {
    stepSize: {
      type: Number,
      default: 20,
      validator: value => value > 0,
    },
  },

  data() {
    return {
      rulerOffset: 0,
      manipulating: false,
      currentX: 0,
      currentY: 0,
      localStartMarkerPosition: 0,
      localEndMarkerPosition: 0,
      localTimeMarkerPosition: 0,
      numberOfSeconds: 0,
      localStepSize: 0,
      baseLocalStepSize: 0,
      ySensitivity: 5,
      sliderHeight: 30,
    };
  },

  computed: {
    ...mapGetters({
      duration: 'video/durationGetter',
      currentTime: 'video/currentTimeGetter',
      startMarkerPosition: 'editor/startMarkerGetter',
      endMarkerPosition: 'editor/endMarkerGetter',
    }),
  },

  watch: {
    startMarkerPosition(newStartMarkerPosition) {
      if (newStartMarkerPosition) {
        this.localStartMarkerPosition = newStartMarkerPosition * this.localStepSize;
      } else {
        this.localStartMarkerPosition = 0;
      }
    },

    endMarkerPosition(newEndMarkerPosition) {
      this.localEndMarkerPosition = newEndMarkerPosition * this.localStepSize;
      if (this.localEndMarkerPosition > this.localStartMarkerPosition) {
        // make both editor and video know they can loop
        this.$store.commit('editor/TURN_LOOPING_ON');
        this.$store.commit('video/TURN_LOOPING_ON');
      }
    },

    duration(newDuration) {
      this.numberOfSeconds = Math.floor(newDuration);
      if (newDuration && (newDuration > 0)) {
        this.localStepSize = this.$refs.viewport.getBoundingClientRect().width / newDuration;
        this.baseLocalStepSize = this.localStepSize;
      }

      this.localEndMarkerPosition = newDuration * this.localStepSize;
      this.$store.commit('editor/UPDATE_SLIDER_VALUES', [this.localStartMarkerPosition / this.localStepSize, this.localEndMarkerPosition / this.localStepSize]);
      this.$store.commit('video/UPDATE_LOOP_END', this.localEndMarkerPosition / this.localStepSize);
    },

    localStepSize(newLocalStepSize) {
      this.localStartMarkerPosition = this.startMarkerPosition * newLocalStepSize;
      this.localEndMarkerPosition = this.endMarkerPosition * newLocalStepSize;
      this.localTimeMarkerPosition = this.currentTime * newLocalStepSize;

      // if ((this.zooming)) {
      this.$nextTick(() => {
        const perfectRulerOffset = (this.localTimeMarkerPosition) -
          ((this.$refs.viewport.getBoundingClientRect().width / 2));

        if ((this.$refs.viewport.getBoundingClientRect().width +
          perfectRulerOffset) <= (this.duration * this.localStepSize)) {
          this.rulerOffset = perfectRulerOffset;
        } else if (this.localTimeMarkerPosition >
          (this.$refs.viewport.getBoundingClientRect().width / 2)) {
          this.rulerOffset = (this.duration * this.localStepSize) -
            this.$refs.viewport.getBoundingClientRect().width;
        } else {
          this.rulerOffset = 0;
        }
      });
    },

    currentTime(newCurrentTime) {
      this.localTimeMarkerPosition = newCurrentTime * this.localStepSize;
    },

    rulerOffset(newRulerOffset) {
      this.$refs.viewport.scrollLeft = newRulerOffset;
    },
  },

  methods: {
    onStartMarkerDown(event) {
      event.stopPropagation();
      this.currentX = event.clientX;
      this.currentY = event.clientY;

      window.addEventListener('mousemove', this.onStartMarkerDragging);
      window.addEventListener('mouseup', this.onStartMarkerDragEnd);
    },

    onStartMarkerDragging(event) {
      const diffX = (event.clientX - this.currentX);

      this.currentX = event.clientX;
      this.currentY = event.clientY;

      this.localStartMarkerPosition = (this.localStartMarkerPosition + diffX);

      this.$store.commit('editor/UPDATE_SLIDER_VALUES', [this.localStartMarkerPosition / this.localStepSize, this.localEndMarkerPosition / this.localStepSize]);
      this.$store.commit('video/UPDATE_LOOP_END', this.localEndMarkerPosition / this.localStepSize);
    },

    onStartMarkerDragEnd() {
      this.$store.commit('editor/UPDATE_SLIDER_VALUES', [this.localStartMarkerPosition / this.localStepSize, this.localEndMarkerPosition / this.localStepSize]);
      this.$store.commit('video/UPDATE_LOOP_START', this.localStartMarkerPosition / this.localStepSize);
      window.removeEventListener('mousemove', this.onStartMarkerDragging);
      window.removeEventListener('mouseup', this.onStartMarkerDragEnd);
    },

    onEndMarkerDown(event) {
      event.stopPropagation();
      this.currentX = event.clientX;
      this.currentY = event.clientY;

      window.addEventListener('mousemove', this.onEndMarkerDragging);
      window.addEventListener('mouseup', this.onEndMarkerDragEnd);
    },

    onEndMarkerDragging(event) {
      const diffX = (event.clientX - this.currentX);

      this.currentX = event.clientX;
      this.currentY = event.clientY;

      this.localEndMarkerPosition = (this.localEndMarkerPosition + diffX);

      this.$store.commit('editor/UPDATE_SLIDER_VALUES', [this.localStartMarkerPosition / this.localStepSize, this.localEndMarkerPosition / this.localStepSize]);
      this.$store.commit('video/UPDATE_LOOP_END', this.localEndMarkerPosition / this.localStepSize);
    },

    onEndMarkerDragEnd() {
      event.stopPropagation();

      window.removeEventListener('mousemove', this.onEndMarkerDragging);
      window.removeEventListener('mouseup', this.onEndMarkerDragEnd);
    },

    zoomDown(event) {
      this.zooming = true;
      this.currentY = event.clientY;

      window.addEventListener('mousemove', this.zoomDrag);
      window.addEventListener('mouseup', this.zoomUp);
    },

    zoomDrag(event) {
      if (this.zooming) {
        const diffY = (event.clientY - this.currentY);

        if ((this.localStepSize + (diffY / this.ySensitivity)) > this.baseLocalStepSize) {
          this.localStepSize = this.localStepSize + (diffY / this.ySensitivity);
          this.sliderHeight = this.sliderHeight + diffY;
        } else {
          this.localStepSize = this.baseLocalStepSize;
        }

        this.currentY = event.clientY;
      }
    },

    zoomUp() {
      this.zooming = false;

      window.removeEventListener('mousemove', this.zoomDrag);
      window.removeEventListener('mouseup', this.zoomUp);
    },
  },

  created() {
  },

  mounted() {
    this.$nextTick(() => {
      this.localStepSize = this.$refs.viewport.getBoundingClientRect().width / this.duration;
    });
  },
};
</script>

<style lang="scss" scoped>
.slider-container  {
  display: flex;
  flex-wrap: wrap;
  flex: 0 0 100%;
  overflow: hidden;
  position: relative;

  .slider-viewport {
    width: 100%;
    height: 40px;

    overflow-x: scroll;
    overflow-y: hidden;

    .ruler-container {
      height: 100%;
      position: relative;
      display: block;
      float: left;

      .ruler {
        height: 100%;
        background-color: gray;
        background: linear-gradient(left, #00ff00, #00aabb);
        cursor: pointer;
        position: relative;

        // transition: all 0.5s linear;

        .seconds {
          width: 100%;
          background-image: url('../assets/marker.png');
          background-position: bottom;
          height: 20px;
          top: calc(100% - 20px);
          position: relative;
          // transition: all 0.5s linear;
        }
      }

      .marked {
        background: yellow;
        height: 100%;
        position: absolute;
      }

      .marker {
        height: 100%;
        position: absolute;
        top: 0;
        width: 5px;
        background: black;
        opacity: 0.6;

        z-index: 2;

        &:hover {
          opacity: 1;
        }

        &.start-marker {
          left: 0;
          background: blue;
        }
        &.end-marker {
          left: 100%;
          background: red;
          margin-left: -5px;
        }
      }
    }

  }

  .slider-zoom {
    position: relative;
    left: 50%;
    margin-left: -20px;
    margin-bottom: 10px;
    width: 40px;
    height: 30px;
    background: red;
    border-bottom-left-radius: 50%;
    border-bottom-right-radius: 50%;

    cursor: pointer;
    
    text-align: center;
    color: #ffffff;
    line-height: 30px;
    font-family: Arial, Helvetica, sans-serif;
  }
}
</style>