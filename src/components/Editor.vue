<template>
  <div id="editor">
    <button @click="editorVisible = !editorVisible">Pripravi svoj izsek</button>
    <div
      v-if="editorVisible"
      :class="['editor-controls-container', { hidden: !editorVisible }]"
    >
      <slider></slider>
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
import { mapGetters } from 'vuex';
import Slider from './Slider';

export default {
  name: 'editor',
  data() {
    return {
      editorVisible: true,
    };
  },
  components: {
    Slider,
  },
  computed: {
    ...mapGetters({
      duration: 'video/durationGetter',
    }),
  },
  methods: {
    createSnippet() {
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
    margin: auto;
    flex-wrap: wrap;
    overflow: hidden;

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
