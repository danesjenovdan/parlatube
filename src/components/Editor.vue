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
import store from '../store';

export default {
  name: 'editor',
  data() {
    return {
      editorVisible: false,
    };
  },
  components: {
    slider: Slider,
    store,
  },
  computed: {
    duration() {
      return store.state.editor.duration;
    },
    sliderValues() {
      return [store.state.editor.currentTime, store.state.editor.duration];
    },
  },
  methods: {
    startDrag() {
      store.commit('editor/TOGGLE_DRAG');
    },
    stopDrag() {
      console.log(this.sliderValues);
      store.commit('editor/TOGGLE_DRAG');
    },
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
