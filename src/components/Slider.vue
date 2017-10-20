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
          v-bind:style="{width: `${(duration * localStepSize)}px`}"
          @mousedown="rulerDown"
          @mousemove="mouseMarker"
          @mouseleave="mouseMarkerPosition = 0"
          ref="ruler"
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
            class="marker time-marker mouse-marker"
            :style="{left: `${mouseMarkerPosition}px`}"
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
/* global dataLayer */

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
    live: {
      type: Boolean,
      default: true,
    },
    duration: {
      type: Number,
      default: 100,
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
      mouseMarkerPosition: 0,
    };
  },

  computed: {
    ...mapGetters({
      videoDuration: 'video/durationGetter',
      startMarkerPosition: 'editor/startMarkerGetter',
    }),

    ...mapState({
      videoPlaying: state => state.video.playing,
      shouldIPause: state => state.video.shouldIPause,
      endMarkerPosition: state => state.editor.endTime,
      currentTime: state => state.video.currentTime,
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
      // make both editor and video know they can loop
      this.$store.commit('editor/TURN_LOOPING_ON');
      this.$store.commit('video/TURN_LOOPING_ON');

      // update processedEndTime
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
      this.$store.dispatch('editor/updateSliderValues', [newLocalStartMarkerPosition / this.localStepSize, this.localEndMarkerPosition / this.localStepSize]);
      this.$store.commit('video/UPDATE_LOOP_START', newLocalStartMarkerPosition / this.localStepSize);
    },

    localEndMarkerPosition(newLocalEndMarkerPosition) {
      this.$store.dispatch('editor/updateSliderValues', [this.localStartMarkerPosition / this.localStepSize, newLocalEndMarkerPosition / this.localStepSize]);
      this.$store.commit('video/UPDATE_LOOP_END', newLocalEndMarkerPosition / this.localStepSize);
    },

    videoDuration(newVideoDuration) {
      if (!this.live) {
        this.duration = newVideoDuration;
      }
    },

    duration(newDuration) {
      this.numberOfSeconds = Math.floor(newDuration);
      if (newDuration && (newDuration > 0)) {
        this.localStepSize = (this.$refs.viewport.getBoundingClientRect().width - 10) / newDuration;
        this.baseLocalStepSize = this.localStepSize;
      }

      // if (newDuration * this.localStepSize > this.localEndMarkerPosition) {
      //   this.localEndMarkerPosition = newDuration * this.localStepSize;
      // }

      this.localEndMarkerPosition = newDuration * this.localStepSize;
    },

    localStepSize(newLocalStepSize) {
      this.localStartMarkerPosition = this.startMarkerPosition * newLocalStepSize;
      this.localEndMarkerPosition = this.endMarkerPosition * newLocalStepSize;
      this.localTimeMarkerPosition = this.currentTime * newLocalStepSize;

      this.$nextTick(() => {
        const perfectRulerOffset = (this.localTimeMarkerPosition) -
          ((this.$refs.viewport.getBoundingClientRect().width / 2));

        if (newLocalStepSize === this.baseLocalStepSize) {
          this.rulerOffset = 0;
        } else if ((this.$refs.viewport.getBoundingClientRect().width +
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

      if (((this.localStartMarkerPosition + diffX) >= 0) &&
        ((this.localStartMarkerPosition + diffX) < (this.localEndMarkerPosition - 10))) {
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

      if ((this.localEndMarkerPosition + diffX) <= ((this.duration * this.localStepSize)) &&
        ((this.localEndMarkerPosition + diffX) > (this.localStartMarkerPosition + 10))) {
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
      dataLayer.push({
        event: 'GaEvent',
        eventCategory: 'create_snipet',
        eventAction: 'zoom',
        eventLabel: 'in',
      });
    },

    zoomOut() {
      if ((this.localStepSize - 10) > this.baseLocalStepSize) {
        this.localStepSize = this.localStepSize - 10;
      } else {
        this.localStepSize = this.baseLocalStepSize;
      }
      dataLayer.push({
        event: 'GaEvent',
        eventCategory: 'create_snipet',
        eventAction: 'zoom',
        eventLabel: 'out',
      });
    },

    seekHere(event) {
      const whereToSeek = ((event.clientX + this.rulerOffset) - 5 -
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
      this.baseLocalStepSize = (this.$refs.viewport.getBoundingClientRect().width - 10) / this.duration; // eslint-disable-line max-len
    },

    padZeroes: text => (text.length < 2 ? `0${text}` : text),

    mouseMarker(event) {
      const whereToGo = ((event.clientX + this.rulerOffset) - 5 -
        this.$refs.viewport.getBoundingClientRect().left); // / this.localStepSize;
      this.mouseMarkerPosition = whereToGo;
    },
  },

  created() {
    if (!this.live) {
      this.duration = this.videoDuration;
      console.log('duration', this.duration);
    } else {
      console.log('pin');
    }
  },

  mounted() {
    console.log('duration', this.duration);
    this.localStepSize = (this.$refs.viewport.getBoundingClientRect().width - 10) / this.duration;
    this.baseLocalStepSize = this.localStepSize;
    this.rulerOffset = 0;

    if (this.live) {
      console.log(this.currentTime);
      this.$store.dispatch('editor/updateSliderValues', [0, this.currentTime + 30]);
      this.$store.commit('video/UPDATE_LOOP_START', 0);
      this.$store.commit('video/UPDATE_LOOP_END', this.currentTime + 30);
      this.duration = this.currentTime + 30;
    } else {
      this.$store.dispatch('editor/updateSliderValues', [0, this.duration]);
      this.$store.commit('video/UPDATE_LOOP_START', 0);
      this.$store.commit('video/UPDATE_LOOP_END', this.duration);
    }
    // this.$nextTick(() => {
    //   this.localEndMarkerPosition = this.endMarkerPosition * this.localStepSize;
    // });
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/colors';
@import '../styles/scroller';

.slider-container  {
  display: flex;
  flex-wrap: wrap;
  flex: 0 1 949px;
  overflow: hidden;
  position: relative;
  padding-top: 10px;
  overflow: hidden;

  .slider-viewport {
    width: 100%;
    height: 56px; // 44 + 11 for scrollbar + 1 for margin

    overflow-x: auto;
    overflow-y: visible;

    @extend %scroller;

    .ruler-container {
      display: block;
      // width: calc(100% - 10px);
      height: 100%;
      position: relative;
      // float: left;
      padding-left: 5px;
      padding-right: 5px;

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
          position: absolute;
          // transition: all 0.5s linear;

          opacity: 0.4;

          background-image: linear-gradient(to left, #ffffff 1px, rgba(255, 255, 255, 0) 1px);
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

        // box-shadow: 0 2px 5px rgba(0, 0, 0, 0.35);

        &:hover {
          // TODO
        }

        &.start-marker,
        &.end-marker {
          top: 0;
          left: 0;
          background: transparent;
          width: 5px;
          height: 34px;
          border-top: 5px solid $red;
          border-bottom: 5px solid $red;
          border-left: 6px solid $red;

          margin-left: -6px;
          z-index: 3;
        }
        &.end-marker {
          left: 100%;
          border-left: none;
          border-right: 6px solid $red;
        }

        &.mouse-marker {
          opacity: 0.7;
          width: 1px;
        }
      }
    }

    &::before {
      content: '';
      display: flex;
      flex: 1 1 100%;
      width: calc(100% - 10px);
      height: 35px;
      background-color: $dark-gray;
      position: absolute;
      margin-top: 5px;
      left: 5px;
    }

  }

  .slider-buttons-container {
    position: relative;
    margin: auto;
    margin-bottom: 20px;
    display: flex;
    flex: 1 1 100%;
    flex-wrap: wrap;
    margin-top: 20px;

    .slider-zoom-row {
      position: relative;
      display: flex;
      overflow: hidden;
      flex: 0 1 100%;
      justify-content: center;
      // margin-bottom: 15px;
      padding-bottom: 5px;

      &:first-child {
        margin-bottom: 8px;
      }
    }

    .slider-input {
      width: 56px;
      height: 25px;
      display: flex;
      text-align: center;
      padding: 0;
      border: 1px solid $white;

      font-family: 'Space Mono', monospace;
      font-size: 12px;

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
        background-size: 20px;
        background-position: center 10px;
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
      &.pause {
        background-image: url('../assets/icons/pause.svg');
        background-position-x: center;
        background-size: 85%;
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

        background-image: url('../assets/icons/zacetek.svg');
        background-size: 50%;
        background-repeat: no-repeat;
        background-position: center;
        background-position-x: 10px;
        border-radius: 50%;
      }
      &.end-here::before {
        background-image: url('../assets/icons/konec.svg');
      }
    }
  }
}
</style>