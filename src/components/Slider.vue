<template>
  <div class="slider-container">
    <input type="text" class="timeinput" v-bind:value="firstInputText"></input>
    <div class="slider">
      <div class="slider-runway"
        :class="{ 'disabled': disabled }"
        :style="runwayStyle"
        @click="onSliderClick"
        ref="slider">
        <div
          class="slider-bar"
          :style="barStyle">
        </div>
        <slider-button
          v-model="firstValue"
          ref="firstButton"
          :setPositionCallback="setPositionCallback"
          :inputRef="'firstInput'"
          class="green">
        </slider-button>
        <slider-button
          v-model="secondValue"
          ref="secondButton"
          :setPositionCallback="setPositionCallback"
          :inputRef="'secondInput'"
          class="red">
        </slider-button>
      </div>
    </div>
    <input type="text" class="timeinput" v-bind:value="secondInputText"></input>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import SliderButton from './SliderButton';

export default {
  name: 'Slider',

  props: {
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
    value: {
      type: Array,
      default: () => [0, 0],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    setPositionCallback: {
      type: Function,
      default: () => false,
    },
  },

  components: {
    SliderButton,
  },

  data() {
    return {
      firstValue: this.value[0],
      secondValue: this.value[1],
      oldValue: null,
      dragging: false,
      sliderSize: 1,
      temporaryFirstValue: null,
      temporarySecondValue: null,
    };
  },

  watch: {
    value(val, oldVal) {
      if (this.dragging ||
        (Array.isArray(val) &&
          Array.isArray(oldVal) &&
          val.every((item, index) => item === oldVal[index])
        )
      ) {
        return;
      }
      this.setValues();
    },

    dragging(val) {
      this.$store.commit('editor/TOGGLE_DRAG');
      if (!val) {
        this.setValues();
      }
    },

    firstValue() {
      this.$emit('input', [this.minValue, this.maxValue]);
    },

    secondValue() {
      this.$emit('input', [this.minValue, this.maxValue]);
    },

    temporaryFirstValue() {
      this.firstValue = this.temporaryFirstValue;
    },

    temporarySecondValue() {
      this.secondValue = this.temporarySecondValue;
    },

    min() {
      this.setValues();
    },

    max() {
      this.setValues();
    },

    duration(newDuration) {
      this.temporarySecondValue = newDuration;
    },
  },

  methods: {
    valueChanged() {
      return ![this.minValue, this.maxValue]
        .every((item, index) => item === this.oldValue[index]);
    },
    setValues() {
      const val = [this.temporaryFirstValue || 0, this.temporarySecondValue];
      if (val[1] < this.min) {
        this.$emit('value', [this.min, this.min]);
      } else if (val[0] > this.max) {
        this.$emit('value', [this.max, this.max]);
      } else if (val[0] < this.min) {
        this.$emit('value', [this.min, val[1]]);
      } else if (val[1] > this.max) {
        this.$emit('value', [val[0], this.max]);
      } else {
        this.firstValue = val[0];
        this.secondValue = val[1];
        if (this.valueChanged()) {
          this.$emit('change', [this.minValue, this.maxValue]);
          this.oldValue = val.slice();
        }
      }
    },

    setPosition(percent) {
      const targetValue = this.min + ((percent * (this.max - this.min)) / 100);
      let button;
      if (Math.abs(this.minValue - targetValue) < Math.abs(this.maxValue - targetValue)) {
        button = this.firstValue < this.secondValue ? 'firstButton' : 'secondButton';
      } else {
        button = this.firstValue > this.secondValue ? 'firstButton' : 'secondButton';
      }
      this.$refs[button].setPosition(percent);
    },

    onSliderClick(event) {
      if (this.disabled || this.dragging) return;
      this.resetSize();
      const sliderOffsetLeft = this.$refs.slider.getBoundingClientRect().left;
      this.setPosition(((event.clientX - sliderOffsetLeft) / this.sliderSize) * 100);
    },

    resetSize() {
      if (this.$refs.slider) {
        this.sliderSize = this.$refs.slider.clientWidth;
      }
    },

    secondsToString(seconds) {
      // var numyears = Math.floor(seconds / 31536000);
      // var numdays = Math.floor((seconds % 31536000) / 86400);
      const numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
      const numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
      const numseconds = (((seconds % 31536000) % 86400) % 3600) % 60;
      return `${this.pad(numhours, 2)}:${this.pad(numminutes, 2)}:${this.pad(numseconds, 2)}`;
    },

    pad(n, width, z = 0) {
      // z = z || '0';
      const nn = `${n}`;
      return nn.length >= width ? nn : new Array((width - nn.length) + 1).join(z) + nn;
    },
  },

  computed: {
    ...mapGetters({
      duration: 'video/durationGetter',
    }),
    stops() {
      if (this.step === 0) {
        // process.env.NODE_ENV !== 'production' &&
        // console.warn('[Element Warn][Slider]step should not be 0.');
        return [];
      }
      const stopCount = (this.max - this.min) / this.step;
      const stepWidth = 100 * (this.step / (this.max - this.min));
      const result = [];
      for (let i = 1; i < stopCount; i += 1) {
        result.push(i * stepWidth);
      }
      return result.filter(step =>
        step < 100 * ((this.minValue - this.min) / (this.max - this.min)) ||
          step > 100 * ((this.maxValue - this.min) / (this.max - this.min)),
      );
    },

    firstInputText() {
      return this.secondsToString(this.firstValue);
    },

    secondInputText() {
      return this.secondsToString(this.secondValue);
    },

    minValue() {
      return Math.min(this.firstValue, this.secondValue);
    },

    maxValue() {
      return Math.max(this.firstValue, this.secondValue);
    },

    barSize() {
      return `${100 * ((this.maxValue - this.minValue) / (this.max - this.min))}%`;
    },

    barStart() {
      return `${100 * ((this.minValue - this.min) / (this.max - this.min))}%`;
    },

    precision() {
      const precisions = [this.min, this.max, this.step].map((item) => {
        const decimal = (`${item}`).split('.')[1];
        return decimal ? decimal.length : 0;
      });
      return Math.max.apply(null, precisions);
    },

    runwayStyle() {
      return {};
    },

    barStyle() {
      return {
        width: this.barSize,
        left: this.barStart,
      };
    },
  },

  mounted() {
    this.$on('firstInput', (value) => {
      this.temporaryFirstValue = value;
    });
    this.$on('secondInput', (value) => {
      this.temporarySecondValue = value;
    });
    this.$on('input', (value) => {
      this.$store.commit('editor/UPDATE_SLIDER_VALUES', value);
    });
    if (Array.isArray(this.value)) {
      this.temporaryFirstValue = Math.max(this.min, this.value[0]);
      this.temporarySecondValue = Math.min(this.max, this.value[1]);
    } else {
      this.temporaryFirstValue = this.min;
      this.temporarySecondValue = this.max;
    }
    this.oldValue = [this.firstValue, this.secondValue];
    this.resetSize();
    window.addEventListener('resize', this.resetSize);
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.resetSize);
  },
};
</script>

<style lang="scss" scoped>
.slider-container  {
  width: 100%;
  display: flex;

  .timeinput {
    margin-left: 20px;
    margin-right: 20px;
  }

  .slider {
    width: 100%;
    margin: auto;
    height: 30px;
    position: relative;
    padding-left: 7.5px;

    .slider-runway {
      width: 100%;

      .slider-bar {
        height: 10px;
        background: grey;
        position: absolute;
        top: 50%;
        margin-top: -5px;
      }
    }
  }
}
</style>