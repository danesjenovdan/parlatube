<template>
  <div
    class="slider-button-wrapper"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @mousedown="onButtonDown"
    :class="{ 'hover': hovering, 'dragging': dragging }"
    :style="wrapperStyle"
    ref="button">
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'SliderButton',

  props: {
    value: {
      type: Number,
      default: 0,
    },
    inputRef: {
      type: String,
      default: 'firstInput',
    },
    setPositionCallback: {
      type: Function,
      default: () => false,
    },
  },

  data() {
    return {
      hovering: false,
      dragging: false,
      startX: 0,
      currentX: 0,
      startPosition: 0,
      newPosition: null,
      oldValue: this.value,
    };
  },

  computed: {
    ...mapState({
      seekTo: state => state.video.seekTo,
    }),
    ...mapGetters({
      currentVideoTime: 'video/currentVideoTime',
    }),
    disabled() {
      return this.$parent.disabled;
    },

    max() {
      return this.$parent.max;
    },

    min() {
      return this.$parent.min;
    },

    step() {
      return this.$parent.step;
    },

    precision() {
      return this.$parent.precision;
    },

    currentPosition() {
      return `${((this.value - this.min) / (this.max - this.min)) * 100}%`;
    },

    enableFormat() {
      return this.$parent.formatTooltip instanceof Function;
    },

    formatValue() {
      return (this.enableFormat && this.$parent.formatTooltip(this.value)) || this.value;
    },

    wrapperStyle() {
      return { left: this.currentPosition };
    },
  },

  watch: {
    dragging(val) {
      this.$parent.dragging = val;
    },
    currentVideoTime(newCurrentVideoTime) {
      if (this.inputRef === 'firstInput' && !this.dragging && this.$store.state.editor.sealed) {
        this.setPosition((newCurrentVideoTime / this.$store.state.video.duration) * 100);
      }
    },
  },

  methods: {
    handleMouseEnter() {
      this.hovering = true;
    },

    handleMouseLeave() {
      this.hovering = false;
    },

    onButtonDown(event) {
      if (this.$store.state.editor.sealed) {
        this.$store.commit('editor/BREAK_SEAL');
      }
      if (this.disabled) return;
      event.preventDefault();
      this.onDragStart(event);
      window.addEventListener('mousemove', this.onDragging);
      window.addEventListener('mouseup', this.onDragEnd);
      window.addEventListener('contextmenu', this.onDragEnd);
    },

    onDragStart(event) {
      this.dragging = true;
      this.startX = event.clientX;
      this.startPosition = parseFloat(this.currentPosition);
    },

    onDragging(event) {
      if (this.dragging) {
        this.$parent.resetSize();
        let diff = 0;
        this.currentX = event.clientX;
        diff = ((this.currentX - this.startX) / this.$parent.sliderSize) * 100;
        this.newPosition = this.startPosition + diff;
        this.setPosition(this.newPosition);
      }
    },

    onDragEnd() {
      if (this.dragging) {
        setTimeout(() => {
          this.dragging = false;
          this.setPosition(this.newPosition);
        }, 0);
        window.removeEventListener('mousemove', this.onDragging);
        window.removeEventListener('mouseup', this.onDragEnd);
        window.removeEventListener('contextmenu', this.onDragEnd);
      }
    },

    setPosition(newPosition) {
      let position = newPosition;
      if (newPosition === null) return;
      if (newPosition < 0) {
        position = 0;
      } else if (newPosition > 100) {
        position = 100;
      }
      const lengthPerStep = 100 / ((this.max - this.min) / this.step);
      const steps = Math.round(position / lengthPerStep);
      let value = (steps * lengthPerStep * (this.max - this.min) * 0.01) + this.min;
      value = parseFloat(value.toFixed(this.precision));
      if (this.inputRef === 'firstInput' && this.dragging) {
        this.$store.commit('video/UPDATE_OLD_SEEK_TO', this.seekTo);
        this.$store.commit('video/UPDATE_SEEK_TO', value);
      }
      this.$parent.$emit(this.inputRef, value);
      if (!this.dragging && this.value !== this.oldValue) {
        this.oldValue = this.value;
      }
      this.setPositionCallback();
    },
  },
};
</script>

<style lang="scss" scoped>
.slider-button-wrapper {
  width: 15px;
  height: 30px;
  background: black;
  position: absolute;

  transform: translateX(-50%);

  &.green {
    background: green;
  }
  &.red {
    background: red;
  }
}
</style>