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
      <div class="text-stuff">
        <h1>TU SO KONTROLE ZA TEXT OVERLAY</h1>
        <p>Ko enkrat vpišeš tekst, ga lahko z miško premikaš.</p>
        <input type="text" v-model="localDrawingText" placeholder="sem vpiši tekst"/>
        <input type="number" v-model="localFontSize" />
        <color-picker v-model="colorPickerProps" />
      </div>
    </div>
  </div>
</template>

<script>
import 'element-ui/lib/theme-default/index.css';
import { mapState, mapGetters } from 'vuex';
import { Compact } from 'vue-color';
import Slider from './Slider';

export default {
  name: 'Editor',

  data() {
    return {
      editorVisible: true,
      localDrawingText: '',
      localFontSize: 40,
      colorPickerProps: {
        hex: '#ffffff',
        hsl: {
          h: 150,
          s: 0.5,
          l: 0.2,
          a: 1,
        },
        hsv: {
          h: 150,
          s: 0.66,
          v: 0.30,
          a: 1,
        },
        rgba: {
          r: 25,
          g: 77,
          b: 51,
          a: 1,
        },
        a: 1,
      },
    };
  },

  components: {
    Slider,
    'color-picker': Compact,
  },

  computed: {
    ...mapGetters({
      duration: 'video/durationGetter',
      loopStart: 'editor/startMarkerGetter',
      loopEnd: 'editor/endMarkerGetter',
    }),

    ...mapState({
      drawing: state => state.drawing,
    }),
  },

  methods: {
    createSnippet() {
      const data = {
        video_id: 1,
        start_time: this.loopStart * 1000,
        end_time: this.loopEnd * 1000,
        extras: JSON.stringify(this.drawing),
        published: 1,
        looping: 1,
      };

      this.$http.post('http://snippet.knedl.si/setSnippet', data, {
        emulateJSON: true,
      }).then((response) => {
        this.$router.push({ path: `/snippet/${response.data.id}` });
      }, () => {
        // something has gone wrong with saving your snippet
      });
    },
  },

  watch: {
    localDrawingText(newLocalDrawingText) {
      this.$store.commit('drawing/UPDATE_TEXT', newLocalDrawingText);
    },
    localFontSize(newLocalFontSize) {
      this.$store.commit('drawing/UPDATE_FONT_SIZE', newLocalFontSize);
    },
    colorPickerProps(newColorPickerProps) {
      this.$store.commit('drawing/UPDATE_COLOR', newColorPickerProps.hex);
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
