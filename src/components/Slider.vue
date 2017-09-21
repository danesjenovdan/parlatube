<template>
  <div
    class="slider-container"
    v-resize="updateBaseLocalStepSize"
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
            :style="{'background-size': `${localStepSize}px ${localStepSize}px`, left: `${localStartMarkerPosition}px`, width: `${localEndMarkerPosition - localStartMarkerPosition}px`}">
          </div>
        </div>
      </div>
    </div>
    <div class="slider-buttons-container">
      <div class="slider-zoom-row">
        <div
          class="slider-zoom-plus slider-button"
          @click="zoomIn"
        ></div>
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
        ></div>
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
          disabled
        >
        <input
          class="slider-input"
          type="text"
          v-model:value="processedEndTime"
          @focus="manipulatingInput = true"
          @blur="manipulatingInput = false"
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import resize from 'vue-resize-directive';

export default {
  name: 'Slider',

  directives: {
    resize,
  },

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
      processedCurrentTime: '00:00',
      processedStartTime: '00:00',
      processedEndTime: '00:00',
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
  },

  watch: {
    baseLocalStepSize(newBaseLocalStepSize) {
      this.localStepSize = newBaseLocalStepSize;
      this.rulerOffset = 0;
    },

    currentTime(newCurrentTime) {
      this.localTimeMarkerPosition = newCurrentTime * this.localStepSize;

      const minutes = String(Math.floor(newCurrentTime / 60));
      const seconds = String(newCurrentTime % 60);

      this.processedCurrentTime = `${this.padZeroes(minutes)}:${this.padZeroes(seconds.split('.')[0])}`;
    },

    startMarkerPosition(newStartMarkerPosition) {
      if (newStartMarkerPosition) {
        this.localStartMarkerPosition = newStartMarkerPosition * this.localStepSize;
      } else {
        this.localStartMarkerPosition = 0;
      }

      const minutes = String(Math.floor(newStartMarkerPosition / 60));
      const seconds = String(newStartMarkerPosition % 60);

      this.processedStartTime = `${this.padZeroes(minutes)}:${this.padZeroes(seconds.split('.')[0])}`;
    },

    endMarkerPosition(newEndMarkerPosition) {
      this.localEndMarkerPosition = newEndMarkerPosition * this.localStepSize;
      if (this.localEndMarkerPosition > this.localStartMarkerPosition) {
        // make both editor and video know they can loop
        this.$store.commit('editor/TURN_LOOPING_ON');
        this.$store.commit('video/TURN_LOOPING_ON');
      }

      const minutes = String(Math.floor(newEndMarkerPosition / 60));
      const seconds = String(newEndMarkerPosition % 60);

      this.processedEndTime = `${this.padZeroes(minutes)}:${this.padZeroes(seconds.split('.')[0])}`;
    },

    processedStartTime(newProcessedStartTime) {
      if (this.manipulatingInput) {
        this.localStartMarkerPosition = ((parseInt(newProcessedStartTime.split(':')[0], 10) * 60) + parseInt(newProcessedStartTime.split(':')[1], 10)) * this.localStepSize;
      }
    },

    processedEndTime(newProcessedEndTime) {
      if (this.manipulatingInput) {
        this.localEndMarkerPosition = ((parseInt(newProcessedEndTime.split(':')[0], 10) * 60) + parseInt(newProcessedEndTime.split(':')[1], 10)) * this.localStepSize;
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

        if ((this.$refs.viewport.getBoundingClientRect().width +
          perfectRulerOffset) <= (this.duration * newLocalStepSize)) {
          this.rulerOffset = perfectRulerOffset;
        } else if (this.localTimeMarkerPosition >
          (this.$refs.viewport.getBoundingClientRect().width / 2)) {
          this.rulerOffset = (this.duration * newLocalStepSize) -
            this.$refs.viewport.getBoundingClientRect().width;
        } else {
          this.rulerOffset = 0;
        }
      });
    },

    rulerOffset(newRulerOffset) {
      this.$refs.viewport.scrollLeft = newRulerOffset;
    },
  },

  methods: {
    onStartMarkerDown(event) {
      event.stopPropagation();
      this.currentX = event.clientX;

      window.addEventListener('mousemove', this.onStartMarkerDragging);
      window.addEventListener('mouseup', this.onStartMarkerDragEnd);
    },

    onStartMarkerDragging(event) {
      const diffX = (event.clientX - this.currentX);

      this.currentX = event.clientX;

      if ((this.localStartMarkerPosition + diffX) >= 0) {
        this.localStartMarkerPosition = (this.localStartMarkerPosition + diffX);
      }
    },

    onStartMarkerDragEnd() {
      window.removeEventListener('mousemove', this.onStartMarkerDragging);
      window.removeEventListener('mouseup', this.onStartMarkerDragEnd);
    },

    onEndMarkerDown(event) {
      event.stopPropagation();
      this.currentX = event.clientX;

      window.addEventListener('mousemove', this.onEndMarkerDragging);
      window.addEventListener('mouseup', this.onEndMarkerDragEnd);
    },

    onEndMarkerDragging(event) {
      const diffX = (event.clientX - this.currentX);

      this.currentX = event.clientX;

      if ((this.localEndMarkerPosition + diffX) <= ((this.duration * this.localStepSize))) {
        this.localEndMarkerPosition = this.localEndMarkerPosition + diffX;
      }
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
      const whereToSeek = ((event.clientX + this.rulerOffset) -
        this.$refs.viewport.getBoundingClientRect().left) / this.localStepSize;

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

    updateBaseLocalStepSize() {
      this.baseLocalStepSize = this.$refs.viewport.getBoundingClientRect().width / this.duration;
    },

    padZeroes: text => (text.length < 2 ? `0${text}` : text),
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
@import '../styles/colors';
@import '../styles/scroller';

.slider-container  {
  display: flex;
  flex-wrap: wrap;
  flex: 0 1 100%;
  overflow: hidden;
  position: relative;
  padding-top: 10px;

  .slider-viewport {
    width: 100%;
    height: 56px; // 44 + 11 for scrollbar + 1 for margin

    overflow-x: auto;
    overflow-y: visible;

    @extend %scroller;

    .ruler-container {
      height: 100%;
      position: relative;
      display: block;
      float: left;

      .ruler {
        height: 100%;
        background-color: light-gray;
        cursor: pointer;
        position: relative;

        // transition: all 0.5s linear;

        .seconds {
          width: 100%;
          background-position-y: center;
          height: 35px;
          top: 5px;
          position: relative;
          // transition: all 0.5s linear;

          opacity: 0.4;

          background-image: linear-gradient(left, #ffffff 1px, $blue 1px);
          background-image: -webkit-linear-gradient(left, #ffffff 1px, $blue 1px);
          background-image: -moz-linear-gradient(left, #ffffff 1px, $blue 1px);
          background-image: -o-linear-gradient(left, #ffffff 1px, $blue 1px);
          background-image: -ms-linear-gradient(left, #ffffff 1px, $blue 1px);
        }
      }

      .marked {
        background: $blue;
        height: 35px;
        position: absolute;
        margin-top: 5px;
      }

      .marker {
        height: 35px;
        position: absolute;
        top: 5px;
        width: 2px;
        margin-left: -1px;
        background: $white;
        opacity: 1;

        z-index: 2;

        &:hover {
          // TODO
        }

        &.start-marker,
        &.end-marker {
          top: 0;
          left: 0;
          background: $red;
          width: 11px;
          height: 44px;
        }
        &.end-marker {
          left: 100%;
          margin-left: -11px;
        }
      }
    }

    &::before {
      content: '';
      display: block;
      width: 100%;
      height: 35px;
      background-color: $dark-gray;
      position: absolute;
      margin-top: 5px;
    }

  }

  .slider-buttons-container {
    position: relative;
    margin: auto;
    margin-bottom: 20px;
    display: flex;
    flex: 1 1 100%;
    flex-wrap: wrap;
    margin-top: 23px;

    .slider-zoom-row {
      position: relative;
      display: flex;
      overflow: hidden;
      flex: 0 0 100%;
      justify-content: center;
      margin-bottom: 15px;
      padding-bottom: 5px;
    }

    .slider-input {
      width: 76px;
      height: 33px;
      display: flex;
      text-align: center;
      padding: 0;
      border: 1px solid $white;

      font-family: 'Space Mono', monospace;
      font-size: 16px;

      &:disabled {
        border-color: $black;
        margin-left: 6px;
        margin-right: 6px;
        color: $black;
      }
    }

    .slider-button {
      width: 42px;
      height: 42px;
      background: $white;
      border-radius: 50%;
      box-shadow: 0 2px 3px rgba(88, 88, 88, 0.35);

      margin-left: 5px;
      margin-right: 5px;
      margin-top: 10px;
 
      cursor: pointer;

      background-position: center;
      background-repeat: no-repeat;

      &:hover {
        // TODO
      }
      &:active {
        // TODO
      }

      &.slider-zoom-plus,
      &.slider-zoom-minus {
        background-image: url('../assets/icons/zoom-in.svg');
        background-size: 28px;
      }
      &.slider-zoom-minus {
        background-image: url('../assets/icons/zoom-out.svg');
      }
      &.play,
      &.pause {
        background-color: $blue;
        background-image: url('../assets/icons/triangle.svg');
        background-position-x: 4px;
        width: 58px;
        height: 58px;
        margin-top: 0;

        &:hover {
          background-color: $light-blue;
        }
      }
      &.start-here,
      &.end-here {
        background-color: $red;

        &:hover {
          background-color: $light-red;
        }
      }
      &.start-here::before,
      &.end-here::before {
        content: '';
        display: block;
        width: 100%;
        height: 100%;

        background-image: url('../assets/icons/set-marker.svg');
        background-size: 50%;
        background-repeat: no-repeat;
        background-position: center;
        background-position-x: 10px;
        border-radius: 50%;
      }
      &.end-here::before {
        transform: scale(-1, 1);
      }
    }
  }
}
</style>