<template>
  <div
    class="slider-container"
  >
    <div
      class="slider-viewport"
      ref="viewport"
      @scroll="rulerScroll"
    >
      <div class="ruler-container">
        <div
          class="ruler"
          v-bind:style="{width: `${duration * localStepSize}px`}"
          @mousedown="rulerDown"
        >
          <div
            class="marker start-marker"
            :style="{left: `${localStartMarkerPosition}px`}"
            @mousedown.prevent="onStartMarkerDown"
            @click.prevent="seekHere"
          ></div>

          <div
            class="marked"
            :style="{left: `${localStartMarkerPosition}px`, width: `${localEndMarkerPosition - localStartMarkerPosition}px`}"
          >
          </div>
          
          <div
            class="marker end-marker"
            :style="{left: `${localEndMarkerPosition}px`}"
            @mousedown.prevent="onEndMarkerDown"
            @click.prevent="seekHere"
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
    <div class="slider-buttons-container">
      <div class="slider-zoom-row">
        <div
          class="slider-zoom-plus slider-button"
          @click="zoomIn"
        >+</div>
        <div
          class="start-here slider-button"
          @click.prevent="startHere"
        ></div>
        <div
          :class="['slider-button', {play: !videoPlaying, pause: videoPlaying}]"
          @click.prevent="togglePause"
        >
        </div>
        <div
          class="end-here slider-button"
          @click.prevent="endHere"
        ></div>
        <div
          class="slider-zoom-minus slider-button"
          @click="zoomOut"
        >-</div>
      </div>
      <div class="slider-zoom-row">
        <input
          class="slider-input"
          type="text"
          v-model:value="processedStartTime"
          @focus="manipulatingInput = true"
          @blur="manipulatingInput = false"
        >
        <input
          class="slider-input"
          type="text"
          v-model:value="processedCurrentTime"
        >
        <input
          class="slider-input"
          type="text"
          v-model:value="processedEndTime"
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

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
      manipulatingInput: false,
    };
  },

  computed: {
    ...mapGetters({
      duration: 'video/durationGetter',
      currentTime: 'video/currentTimeGetter',
      startMarkerPosition: 'editor/startMarkerGetter',
      endMarkerPosition: 'editor/endMarkerGetter',
    }),

    ...mapState({
      videoPlaying: state => state.video.playing,
      shouldIPause: state => state.video.shouldIPause,
    }),

    processedCurrentTime: {
      get() {
        const minutes = Math.floor(this.currentTime / 60);
        const seconds = this.currentTime % 60;

        return `${minutes}:${String(seconds).split('.')[0]}`;
      },

      set: newValue => newValue,
    },

    processedStartTime: {
      get() {
        const minutes = Math.floor(this.startMarkerPosition / 60);
        const seconds = this.startMarkerPosition % 60;

        return `${minutes}:${String(seconds).split('.')[0]}`;
      },

      set(newValue) {
        if (!this.manipulatingInput) {
          const seconds = (parseInt(newValue.split(':')[0], 10) * 60) + parseInt(newValue.split(':')[1], 10);
          this.localStartMarkerPosition = seconds * this.localStepSize;
        }
      },
    },

    processedEndTime() {
      const minutes = Math.floor(this.endMarkerPosition / 60);
      const seconds = this.endMarkerPosition % 60;

      return `${minutes}:${String(seconds).split('.')[0]}`;
    },
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

    localStartMarkerPosition(newLocalStartMarkerPosition) {
      this.$store.commit('editor/UPDATE_SLIDER_VALUES', [newLocalStartMarkerPosition / this.localStepSize, this.localEndMarkerPosition / this.localStepSize]);
      this.$store.commit('video/UPDATE_LOOP_START', newLocalStartMarkerPosition / this.localStepSize);
    },

    localEndMarkerPosition(newLocalEndMarkerPosition) {
      this.$store.commit('editor/UPDATE_SLIDER_VALUES', [this.localStartMarkerPosition / this.localStepSize, newLocalEndMarkerPosition / this.localStepSize]);
      this.$store.commit('video/UPDATE_LOOP_END', newLocalEndMarkerPosition / this.localStepSize);
    },

    duration(newDuration) {
      this.numberOfSeconds = Math.floor(newDuration);
      if (newDuration && (newDuration > 0)) {
        this.localStepSize = this.$refs.viewport.getBoundingClientRect().width / newDuration;
        this.baseLocalStepSize = this.localStepSize;
      }

      this.localEndMarkerPosition = newDuration * this.localStepSize;
    },

    localStepSize(newLocalStepSize) {
      this.localStartMarkerPosition = this.startMarkerPosition * newLocalStepSize;
      this.localEndMarkerPosition = this.endMarkerPosition * newLocalStepSize;
      this.localTimeMarkerPosition = this.currentTime * newLocalStepSize;

      this.$nextTick(() => {
        const perfectRulerOffset = (this.localTimeMarkerPosition) -
          ((this.$refs.viewport.getBoundingClientRect().width / 2));

        // console.log(perfectRulerOffset);

        if ((this.$refs.viewport.getBoundingClientRect().width +
          perfectRulerOffset) <= (this.duration * newLocalStepSize)) {
          this.rulerOffset = perfectRulerOffset;
          // console.log(this.duration * newLocalStepSize);
        } else if (this.localTimeMarkerPosition >
          (this.$refs.viewport.getBoundingClientRect().width / 2)) {
          this.rulerOffset = (this.duration * newLocalStepSize) -
            this.$refs.viewport.getBoundingClientRect().width;
          // console.log(this.duration * newLocalStepSize);
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
      console.log(event);
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
    },

    onStartMarkerDragEnd() {
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
    },

    onEndMarkerDragEnd() {
      event.stopPropagation();

      window.removeEventListener('mousemove', this.onEndMarkerDragging);
      window.removeEventListener('mouseup', this.onEndMarkerDragEnd);
    },

    zoomIn() {
      this.localStepSize = this.localStepSize + 10;
    },

    zoomOut() {
      if ((this.localStepSize - 10) > this.baseLocalStepSize) {
        this.localStepSize = this.localStepSize - 10;
      } else {
        this.localStepSize = this.baseLocalStepSize;
      }
    },

    seekHere(event) {
      // console.log(event.clientX,
      //   this.rulerOffset,
      //   this.$refs.viewport.getBoundingClientRect().x,
      //   this.localStepsize);
      const whereToSeek = ((event.clientX + this.rulerOffset) -
        this.$refs.viewport.getBoundingClientRect().left) / this.localStepSize;

      console.log(whereToSeek);
      console.log(this.rulerOffset);
      console.log(this.$refs.viewport.getBoundingClientRect());

      this.$store.commit('video/UPDATE_SEEK_TO', whereToSeek);
    },

    startHere() {
      this.localStartMarkerPosition = (this.currentTime * this.localStepSize);
    },

    endHere() {
      this.localEndMarkerPosition = (this.currentTime * this.localStepSize);
    },

    rulerDown(event) {
      this.seekHere(event);
      console.log(event);

      window.addEventListener('mousemove', this.rulerMove);
      window.addEventListener('mouseup', this.rulerUp);
    },

    rulerMove(event) {
      this.seekHere(event);
    },

    rulerUp() {
      window.removeEventListener('mousemove', this.rulerMove);
      window.removeEventListener('mouseup', this.rulerUp);
    },

    rulerScroll() {
      this.rulerOffset = this.$refs.viewport.scrollLeft;
    },

    togglePause() {
      this.$store.commit('video/TOGGLE_SHOULD_I_PAUSE');
    },
  },

  created() {
  },

  mounted() {
    this.localStepSize = this.$refs.viewport.getBoundingClientRect().width / this.duration;
    this.baseLocalStepSize = this.localStepSize;
    this.rulerOffset = 0;
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
        width: 1px;
        background: black;
        opacity: 0.6;

        z-index: 2;

        &:hover {
          opacity: 1;
        }

        &.start-marker {
          left: 0;
          background: blue;
          width: 5px;
        }
        &.end-marker {
          left: 100%;
          background: red;
          margin-left: -5px;
          width: 5px;
        }
      }
    }

  }

  .slider-buttons-container {
    position: relative;
    margin: auto;
    margin-bottom: 20px;
    display: flex;
    flex: 0 0 100%;
    flex-wrap: wrap;

    .slider-zoom-row {
      position: relative;
      display: flex;
      overflow: hidden;
      flex: 0 0 100%;
      justify-content: center;
    }

    .slider-input {
      width: 38px;
      height: 38px;
      display: flex;
      text-align: center;
      padding: 0;
      border: 1px solid #000000;
      margin: 1px;
    }

    .slider-button {
      border: 1px solid #ffffff;
      width: 40px;
      height: 30px;
      background: blue;
      color: #ffffff;
      line-height: 30px;
      font-family: Arial, Helvetica, sans-serif;
      text-align: center;
      font-size: 20px;
      font-weight: bold;

      cursor: pointer;

      &:hover {
        background-color: rgba(0, 0, 255, 0.5);
      }
      &:active {
        background-color: rgba(0, 0, 255, 0.8);
      }

      &.play:before {
        content: '▶';
        display: block;
        position: relative;
        margin: auto;
        color: white;
      }
      &.pause:before {
        content: '⏸';
        display: block;
        position: relative;
        margin: auto;
        color: white;
      }
      &.start-here:before {
        content: '┣';
        display: block;
        position: relative;
        margin: auto;
        color: white;
      }
      &.end-here:before {
        content: '┫';
        display: block;
        position: relative;
        margin: auto;
        color: white;
      }
    }
  }
}
</style>