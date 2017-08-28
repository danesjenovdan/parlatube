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
          v-bind:style="{width: `${duration}px`}"
        >
          <div class="marker start-marker"
            v-bind:style="{left: `${startMarkerPosition}px`}"
            @mousedown="onStartMarkerDown"
          ></div>
          <div class="marker end-marker"
            v-bind:style="{left: `${endMarkerPosition}px`}"
            @mousedown="onEndMarkerDown"
          ></div>
        </div>
      </div>
    </div>
    <div class="timemarker"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import SliderButton from './SliderButton';

export default {
  name: 'Slider',

  props: {
  },

  components: {
    SliderButton,
  },

  data() {
    return {
      timeMarkerPosition: 0,
      oldRulerOffset: null,
      manipulating: false,
      currentX: 0,
      startMarkerPosition: 0,
      endMarkerPosition: 100,
    };
  },

  computed: {
    ...mapGetters({
      duration: 'video/durationGetter',
      currentTime: 'video/currentTimeGetter',
    }),
  },

  watch: {
    currentTime(newCurrentTime) {
      if (!this.manipulating) {
        this.timeMarkerPosition = newCurrentTime;
        this.$el.querySelector('.slider-viewport').scrollLeft = this.timeMarkerPosition;
        this.oldRulerOffset = this.timeMarkerPosition;
      }
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

        this.$store.commit('video/UPDATE_SEEK_TO', Math.abs(this.timeMarkerPosition));
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
      window.removeEventListener('contextmenu', this.onDragEnd);
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
      if (this.isMarkerInBounds(this.startMarkerPosition + diff)) {
        this.startMarkerPosition = this.startMarkerPosition + diff;
      }
    },

    onStartMarkerDragEnd() {
      window.removeEventListener('mousemove', this.onStartMarkerDragging);
      window.removeEventListener('mousemove', this.onStartMarkerDragEnd);
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
      if (this.isMarkerInBounds(this.endMarkerPosition + diff)) {
        this.endMarkerPosition = this.endMarkerPosition + diff;
      }
    },

    onEndMarkerDragEnd() {
      window.removeEventListener('mousemove', this.onEndMarkerDragging);
      window.removeEventListener('mousemove', this.onEndMarkerDragEnd);
    },

    isMarkerInBounds(position) {
      return (position >= 0) && (position <= this.duration); // &&
        // (this.startMarkerPosition <= this.endMarkerPosition - 7);
    },
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
        background: linear-gradient(left, #00ff00, #00aabb);
        cursor: pointer;
        position: relative;
      }

      .marker {
        height: 100%;
        position: absolute;
        top: 0;
        width: 5px;
        background: black;

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