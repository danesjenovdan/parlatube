<template>
  <div id="editor">
    <button @click="editorVisible = !editorVisible">Pripravi svoj izsek</button>
    <div v-if="editorVisible" class="editor-controls-container">
      <slider></slider>
    </div>
  </div>
</template>

<script>
import 'element-ui/lib/theme-default/index.css';
import { mapState } from 'vuex';
import Slider from './Slider';

export default {
  name: 'editor',
  data() {
    return {
      editorVisible: false,
      endTime: this.$store.state.editor.endTime,
      dragging: this.$store.state.editor.dragging,
    };
  },
  components: {
    Slider,
  },
  computed: {
    sliderValues() {
      if (!this.dragging) {
        return [this.currentTime, this.endTime];
      }
      return [0, this.endTime];
    },
    ...mapState({
      currentTime: state => state.video.currentTime,
      duration: state => state.video.duration,
    }),
  },
  methods: {
    startDrag() {
      this.$store.commit('editor/TOGGLE_DRAG');
    },
    stopDrag() {
      this.$store.commit('editor/TOGGLE_DRAG');
    },
  },
  watch: {

  },
  mounted() {
    this.$store.commit('editor/UPDATE_END_TIME', this.duration);
  },
};
</script>

<style lang="scss" scoped>
#editor {
  display: flex;
  flex: 0 0 100%;
  flex-wrap: wrap;
  overflow: hidden;

  button {
    display: flex;
    flex: 0 0 100%;
  }

  .editor-controls-container  {
    display: flex;
    flex: 0 0 100%;

  }
}
</style>
