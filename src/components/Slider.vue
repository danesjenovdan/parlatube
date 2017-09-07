<template>
  <div class="slider-container">
    <div
      class="slider-viewport"
      @scroll="onScroll"
      @mouseover="manipulating = true"
      @mouseout="manipulating = false"
      @mousedown="onMouseDown"
    >
      <div class="ruler-container">
        <div
          class="ruler"
          v-bind:style="{width: `${duration * stepSize}px`}"
        >
          <div class="marker start-marker"
            v-bind:style="{left: `${localStartMarkerPosition}px`}"
            @mousedown="onStartMarkerDown"
          ></div>
          <div class="marker end-marker"
            v-bind:style="{left: `${localEndMarkerPosition}px`}"
            @mousedown="onEndMarkerDown"
          ></div>
          <div class="seconds"></div>
        </div>
      </div>
    </div>
    <div class="timemarker"></div>
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
      timeMarkerPosition: 0,
      oldRulerOffset: null,
      manipulating: false,
      currentX: 0,
      localStartMarkerPosition: 0,
      localEndMarkerPosition: 0,
      numberOfSeconds: 0,
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
    currentTime(newCurrentTime) {
      if (!this.manipulating) {
        this.timeMarkerPosition = newCurrentTime * this.stepSize;
        this.$el.querySelector('.slider-viewport').scrollLeft = this.timeMarkerPosition;
        this.oldRulerOffset = this.timeMarkerPosition;
      }
    },

    startMarkerPosition(newStartMarkerPosition) {
      this.localStartMarkerPosition = newStartMarkerPosition * this.stepSize;
    },

    endMarkerPosition(newEndMarkerPosition) {
      this.localEndMarkerPosition = newEndMarkerPosition * this.stepSize;
      if (this.localEndMarkerPosition > this.localStartMarkerPosition) {
        // make both editor and video know they can loop
        this.$store.commit('editor/TURN_LOOPING_ON');
        this.$store.commit('video/TURN_LOOPING_ON');
      }
    },

    duration(newDuration) {
      this.numberOfSeconds = Math.floor(newDuration);
    },
  },

  methods: {
    onScroll() {
      if (this.manipulating) {
        this.$store.commit('editor/TOGGLE_DRAG');
        const newRulerOffset = this.$el.querySelector('.slider-viewport').scrollLeft;
        this.timeMarkerPosition = this.timeMarkerPosition +
          (newRulerOffset - this.oldRulerOffset);
        this.oldRulerOffset = newRulerOffset;

        this.$store.commit('video/UPDATE_SEEK_TO', Math.abs(this.timeMarkerPosition / this.stepSize));
      }
    },

    onMouseDown(event) {
      event.preventDefault();
      this.currentX = event.clientX;
      window.addEventListener('mousemove', this.onDragging);
      window.addEventListener('mouseup', this.onDragEnd);
    },

    onDragging(event) {
      let diff = 0;
      diff = (event.clientX - this.currentX);
      this.currentX = event.clientX;
      this.timeMarkerPosition = this.timeMarkerPosition - diff;
      this.$el.querySelector('.slider-viewport').scrollLeft = this.timeMarkerPosition;
      this.oldRulerOffset = this.timeMarkerPosition;
    },

    onDragEnd() {
      window.removeEventListener('mousemove', this.onDragging);
      window.removeEventListener('mouseup', this.onDragEnd);
    },

    onStartMarkerDown(event) {
      event.stopPropagation();
      this.currentX = event.clientX;
      window.addEventListener('mousemove', this.onStartMarkerDragging);
      window.addEventListener('mouseup', this.onStartMarkerDragEnd);
    },

    onStartMarkerDragging(event) {
      let diff = 0;
      diff = (event.clientX - this.currentX);
      this.currentX = event.clientX;
      if (this.isMarkerInBounds(this.localStartMarkerPosition + diff)) {
        this.localStartMarkerPosition = this.localStartMarkerPosition + diff;
      }
    },

    onStartMarkerDragEnd() {
      this.$store.commit('editor/UPDATE_SLIDER_VALUES', [this.localStartMarkerPosition / this.stepSize, this.localEndMarkerPosition / this.stepSize]);
      this.$store.commit('video/UPDATE_LOOP_START', this.localStartMarkerPosition / this.stepSize);
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
      let diff = 0;
      diff = (event.clientX - this.currentX);
      this.currentX = event.clientX;
      if (this.isMarkerInBounds(this.localEndMarkerPosition + diff)) {
        this.localEndMarkerPosition = this.localEndMarkerPosition + diff;
      }
    },

    onEndMarkerDragEnd() {
      this.$store.commit('editor/UPDATE_SLIDER_VALUES', [this.localStartMarkerPosition / this.stepSize, this.localEndMarkerPosition / this.stepSize]);
      this.$store.commit('video/UPDATE_LOOP_END', this.localEndMarkerPosition / this.stepSize);
      window.removeEventListener('mousemove', this.onEndMarkerDragging);
      window.removeEventListener('mouseup', this.onEndMarkerDragEnd);
    },

    isMarkerInBounds(position) {
      return (position >= 0) && (position <= this.duration * this.stepSize); // &&
        // (this.localStartMarkerPosition <= this.localEndMarkerPosition - 7);
    },
  },

  created() {
  },

  mounted() {
    this.oldRulerOffset = this.$el.querySelector('.slider-viewport').scrollLeft;
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
    overflow-x: scroll;
    padding-top: 1%;

    .ruler-container {
      height: 100%;
      position: relative;
      padding-left: 50%;
      padding-right: 50%;
      display: block;
      float: left;

      .ruler {
        height: 100%;
        background-color: blue;
        background: linear-gradient(left, #00ff00, #00aabb);
        cursor: pointer;
        position: relative;

        .seconds {
          width: 100%;
          background-image: url('../assets/marker.png');
          height: 20px;
          top: 65px;
          position: relative;
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

  .timemarker {
    position: absolute;
    left: 50%;
    top: -10px;
    width: 2px;
    height: 120px;
    background: red;
  }
}
</style>