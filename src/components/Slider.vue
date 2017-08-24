<template>
  <div class="slider-container" ref="container">
    <slider-button
      :value="firstValue"
    ></slider-button>
    <slider-button
      :value="secondValue"
    ></slider-button>
  </div> 
</template>

<script>
import sliderButton from './SliderButton';

export default {
  name: 'slider',
  props: {
    firstValue: {
      type: Number,
      default: 0,
    },
    secondValue: {
      type: Number,
      default: 100,
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
  components: {
    'slider-button': sliderButton,
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
    sliderSize() {
      return this.$refs.container.clientWidth;
    },
  },
  methods: {
  },
};
</script>

<style lang="scss" scoped>
.slider-container {
  display: flex;
  flex: 0 0 100%;
  height: 40px;
  position: relative;
}
</style>