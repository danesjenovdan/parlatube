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
import { mapGetters } from 'vuex';

export default {
  name: 'editor',
  data() {
    return {
      editorVisible: false,
      endTime: this.$store.state.editor.endTime,
      dragging: this.$store.state.editor.dragging,
      duration: this.$store.state.video.duration,
    };
  },
  components: {
    slider: Slider,
  },
  computed: {
    sliderValues() {
      return [this.startTime, this.endTime];
    },
    ...mapGetters('video', [
      'currentTime',
    ]),
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
  watch: {

  },
  mounted() {
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
