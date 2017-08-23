<template>
  <div id="editor">
    <button @click="editorVisible = !editorVisible">Pripravi svoj izsek</button>
    <div v-if="editorVisible" class="editor-controls-container">
      <div class="slider-container">
        <slider
          v-model="sliderValues"
          :min="0"
          :max="duration"
          :range="true"
          @mousedown.native="startDrag()"
          @mouseup.native="stopDrag()"
        ></slider>
      </div>
    </div>
  </div>
</template>

<script>
import 'element-ui/lib/theme-default/index.css';
import { Slider } from 'element-ui';

export default {
  name: 'editor',
  data() {
    return {
      editorVisible: false,
      startTime: this.$store.state.editor.startTime,
      endTime: this.$store.state.editor.endTime,
      currentTime: this.$store.state.editor.currentTime,
    };
  },
  components: {
    slider: Slider,
  },
  computed: {
    duration() {
      return this.$store.state.video.duration;
    },
    sliderValues() {
      return [this.startTime, this.endTime];
    },
    // currentTime() {
    //   return this.$store.state.video.currentTime;
    // },
  },
  methods: {
    startDrag() {
      this.$store.commit('editor/TOGGLE_DRAG');
    },
    stopDrag() {
      console.log(this.sliderValues);
      this.$store.commit('editor/TOGGLE_DRAG');
    },
  },
  mounted() {
    this.$store.watch(
      state => state.video.currentTime,
      (newCurrentTime) => {
        this.currentTime = newCurrentTime;
      },
    );
  },
};
</script>

<style lang="scss" scoped>
#editor {
  display: flex;
  flex: 0 0 100%;
  flex-wrap: wrap;

  button {
    display: flex;
    flex: 0 0 100%;
  }

  .editor-controls-container  {
    display: flex;
    flex: 0 0 100%;

    .slider-container {
      display: flex;
      flex: 0 0 100%;

      .el-slider {
        width: 100%;
      }
    }
  }
}
</style>
