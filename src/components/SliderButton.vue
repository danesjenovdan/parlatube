<template>
  <div class="slider-button"
    @mousedown="mouseDown"
    :style="{left: currentPosition}"
  ></div>
</template>

<script>
export default {
  name: 'sliderButton',
  props: {
    value: {
      type: Number,
      default: 0,
    },
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 100,
    },
    step: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      dragging: false,
      startX: 0,
      currentX: 0,
      startPosition: 0,
      newPosition: 0,
      oldValue: this.value,
    };
  },
  computed: {
    currentPosition() {
      return `${((this.value - this.min) / (this.max - this.min)) * 100}%`;
    },
  },
  methods: {
    mouseDown(event) {
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
        this.currentX = event.clientX;
        const diff = ((this.currentX - this.startX) / this.$parent.sliderSize) * 100;
        console.log(this.startPosition + diff);
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
      let value = steps * lengthPerStep * (this.max - this.min) * (0.01 + this.min);
      value = parseFloat(value.toFixed(2));
      // this.$emit('input', value);
      this.value = value;
      if (!this.dragging && this.value !== this.oldValue) {
        this.oldValue = this.value;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.slider-button {
  width: 20px;
  height: 40px;
  position: absolute;
  background: black;
  
  top: 0;
}
</style>