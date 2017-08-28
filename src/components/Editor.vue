<template>
  <div id="editor">
    <button @click="editorVisible = !editorVisible">Pripravi svoj izsek</button>
    <div :class="['editor-controls-container', { hidden: !editorVisible }]">
      <slider
        :max="duration"
      ></slider>
      <div class="row">
        <input type="checkbox" id="checkbox" v-model="looping">
        <label for="checkbox">Looping: {{ looping }}</label>
      </div>
      <div class="row">
        <button
          @click="createSnippet"
        >Izreži!</button>
      </div>
    </div>
  </div>
</template>

<script>
import 'element-ui/lib/theme-default/index.css';
import { mapState, mapGetters } from 'vuex';
import Slider from './Slider';

export default {
  name: 'editor',
  data() {
    return {
      editorVisible: true,
      endTime: this.$store.state.editor.endTime,
      dragging: this.$store.state.editor.dragging,
      looping: this.$store.state.editor.looping,
      value: [0, this.duration || 0],
    };
  },
  components: {
    Slider,
  },
  computed: {
    ...mapState({
      currentTime: state => state.video.currentTime,
    }),
    ...mapGetters({
      duration: 'video/durationGetter',
    }),
  },
  methods: {
    startDrag() {
      this.$store.commit('editor/TOGGLE_DRAG');
    },
    stopDrag() {
      this.$store.commit('editor/TOGGLE_DRAG');
    },
    createSnippet() {
      console.log('creating snippet');
      console.log(this);
      this.$http.post('http://snippet.knedl.si/setSnippet', {
        video_id: 1,
        start_time: this.$store.state.editor.sliderValues[0] * 1000,
        end_time: this.$store.state.editor.sliderValues[1] * 1000,
        extras: '',
        published: 1,
        looping: 1,
      }, {
        emulateJSON: true,
      }).then((response) => {
        console.log('bla');
        console.log(response);
      }, (response) => {
        console.log('error');
        console.log(response);
      });
    },
  },
  watch: {
    looping() {
      this.$store.commit('editor/TOGGLE_LOOPING');
    },
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
    flex: 0 0 calc(100% - 30px);
    margin: auto;
    flex-wrap: wrap;

    &.hidden {
      display: none;
    }

    .row {
      display: flex;
      flex: 0 0 100%;
    }
  }
}
</style>
