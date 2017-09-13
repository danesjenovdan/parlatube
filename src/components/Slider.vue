<template>
  <div class="slider-container">
    <div
      class="slider-viewport"
      @mouseover="manipulating = true"
      @mouseout="manipulating = false"
      ref="viewport"
    >
      <div
        class="ruler-container"
        :style="{left: `${rulerOffset}px`}">
        <div
          class="ruler"
          v-bind:style="{width: `${duration * localStepSize}px`}"
        >
          <div class="marker start-marker"
            v-bind:style="{left: `${localStartMarkerPosition}px`}"
            @mousedown.prevent="onStartMarkerDown"
          ></div>
          <div class="marker end-marker"
            v-bind:style="{left: `${localEndMarkerPosition}px`}"
            @mousedown="onEndMarkerDown"
          ></div>
          <div class="seconds" :style="{'background-size': `${localStepSize}px ${localStepSize}px`}"></div>
        </div>
      </div>
    </div>
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
      oldRulerOffset: 0,
      rulerOffset: 0,
      manipulating: false,
      currentX: 0,
      currentY: 0,
      localStartMarkerPosition: 0,
      localEndMarkerPosition: 200,
      numberOfSeconds: 0,
      localStepSize: 0,
      ySensitivity: 5,
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
      this.localStartMarkerPosition = newStartMarkerPosition * this.localStepSize;
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
        // this.localStepSize = this.$refs.viewport.getBoundingClientRect().width / newDuration;
        this.localStepSize = 20;
      }
    },

    // manipulating(newManipulating) {
    //   console.log('manipulating', newManipulating);
    //   if (newManipulating) {
    //     this.localStepSize = 20;
    //   } else {
    //     this.localStepSize = this.$refs.viewport.getBoundingClientRect().width / this.duration;
    //   }
    // },

    localStepSize(newLocalStepSize, oldLocalStepsize) {
      if (newLocalStepSize !== oldLocalStepsize) {
        this.localStartMarkerPosition = this.startMarkerPosition * newLocalStepSize;
        this.localEndMarkerPosition = this.endMarkerPosition * newLocalStepSize;
      }
    },
  },

  methods: {
    onStartMarkerDown(event) {
      event.stopPropagation();
      this.currentX = event.screenX;
      this.currentY = event.screenY;

      window.addEventListener('mousemove', this.onStartMarkerDragging);
      window.addEventListener('mouseup', this.onStartMarkerDragEnd);
    },

    onStartMarkerDragging(event) {
      let diffX = 0;
      let diffY = 0;

      diffX = (event.screenX - this.currentX);
      diffY = (event.screenY - this.currentY);

      this.currentX = event.screenX;
      this.currentY = event.screenY;

      if ((this.localStepSize + (diffY / this.ySensitivity)) >=
        this.$refs.viewport.getBoundingClientRect().width / this.duration) {
        this.localStepSize = this.localStepSize + (diffY / this.ySensitivity);
      }

      if (diffY !== 0) {
        this.rulerOffset = this.currentX - (this.startMarkerPosition * this.localStepSize) - 10;
      }

      this.localStartMarkerPosition = this.localStartMarkerPosition + diffX;
    },

    onStartMarkerDragEnd() {
      this.$store.commit('editor/UPDATE_SLIDER_VALUES', [this.localStartMarkerPosition / this.localStepSize, this.localEndMarkerPosition / this.localStepSize]);
      this.$store.commit('video/UPDATE_LOOP_START', this.localStartMarkerPosition / this.localStepSize);
      window.removeEventListener('mousemove', this.onStartMarkerDragging);
      window.removeEventListener('mouseup', this.onStartMarkerDragEnd);

      this.localStepSize = this.$refs.viewport.getBoundingClientRect().width / this.duration;
      this.rulerOffset = 0;
    },

    onEndMarkerDown(event) {
      event.stopPropagation();
      this.currentX = event.screenX;
      this.currentY = event.screenY;

      window.addEventListener('mousemove', this.onEndMarkerDragging);
      window.addEventListener('mouseup', this.onEndMarkerDragEnd);
    },

    onEndMarkerDragging(event) {
      let diffX = 0;
      let diffY = 0;

      diffX = (event.screenX - this.currentX);
      diffY = (event.screenY - this.currentY);

      this.currentX = event.screenX;
      this.currentY = event.screenY;

      if ((this.localStepSize + (diffY / this.ySensitivity)) >=
        this.$refs.viewport.getBoundingClientRect().width / this.duration) {
        this.localStepSize = this.localStepSize + (diffY / this.ySensitivity);
      }

      if (diffY !== 0) {
        this.rulerOffset = this.currentX - (this.endMarkerPosition * this.localStepSize) - 10;
      }

      this.localEndMarkerPosition = this.localEndMarkerPosition + diffX;

      // event.stopPropagation();
      // let diff = 0;
      // diff = (event.screenX - this.currentX);
      // this.currentX = event.screenX;
      // this.localEndMarkerPosition = this.localEndMarkerPosition + diff;
    },

    onEndMarkerDragEnd() {
      event.stopPropagation();
      this.$store.commit('editor/UPDATE_SLIDER_VALUES', [this.localStartMarkerPosition / this.localStepSize, this.localEndMarkerPosition / this.localStepSize]);
      this.$store.commit('video/UPDATE_LOOP_END', this.localEndMarkerPosition / this.localStepSize);
      window.removeEventListener('mousemove', this.onEndMarkerDragging);
      window.removeEventListener('mouseup', this.onEndMarkerDragEnd);

      this.localStepSize = this.$refs.viewport.getBoundingClientRect().width / this.duration;
      this.rulerOffset = 0;
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
    height: 100px;
    background: gray;
    padding-top: 1%;

    .ruler-container {
      height: 100%;
      position: relative;
      display: block;
      float: left;

      .ruler {
        height: 100%;
        background-color: yellow;
        background: linear-gradient(left, #00ff00, #00aabb);
        cursor: pointer;
        position: relative;

        // transition: all 0.5s linear;

        .seconds {
          width: 100%;
          background-image: url('../assets/marker.png');
          background-position: bottom;
          height: 20px;
          top: 65px;
          position: relative;
          // transition: all 0.5s linear;
        }
      }

      .marker {
        height: 100%;
        position: absolute;
        top: 0;
        width: 5px;
        background: black;

        z-index: 2;

        &:hover {
          background: red;
        }

        &.start-marker {
          left: 0;
        }
        &.end-marker {
          left: 20%;
        }
      }
    }

  }
}
</style>