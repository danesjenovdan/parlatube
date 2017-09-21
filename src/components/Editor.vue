<template>
  <div id="editor">
    <div class="editor-controls-container">
      <slider></slider>
    </div>
    <div class="editor-controls-container">
      <div class="text-stuff">
        <div class="row">
          <label for="drawing-text">Besedilo čez video</label>
          <input id="drawing-text" type="text" v-model="localDrawingText"/>
          <div
            class="colorpicker"
            @click="showColorPicker"
            ref="colorpicker"
          >
            <div class="color" :style="{ 'background-color': colorPickerProps.hex }"></div>
          </div>
          <color-picker
            v-model="colorPickerProps"
            :class="{ visible: colorPickerVisible }"
            :style="{ left: `${colorPickerLeft}px` }"
            ref="colorPalette"
          />
        </div>
        <div class="row">
          <label for="title-text">Naslov objave</label>
          <input id="title-text" type="text" v-model="localTitleText"/>
        </div>
      </div>
    </div>
    <div class="editor-controls-container">
      <div class="row row-buttons">
        <button
          @click="createSnippet"
          class="editor-button"
        >objavi</button>
        <button
          @click="resetState"
          class="editor-button reset-button"
        >zavrzi</button>
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
      localDrawingText: '',
      localTitleText: '',
      localFontSize: 40,
      colorPickerLeft: 0,
      colorPickerProps: {
        hex: '#000000',
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
      colorPickerVisible: false,
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

    showColorPicker() {
      console.log(this.$refs.colorpicker.getBoundingClientRect());
      this.colorPickerLeft = this.$refs.colorpicker.getBoundingClientRect().left - 62 - 6;
      this.colorPickerVisible = !this.colorPickerVisible;
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
@import '../styles/colors';
@import '../styles/scroller';

#editor {
  display: flex;
  flex: 0 0 100%;
  flex-wrap: wrap;
  overflow: hidden;

  padding-top: 16px;
  background-color: $gray;

  .editor-controls-container  {
    display: flex;
    flex: 1 1 100%;
    margin: auto;
    flex-wrap: wrap;
    overflow: hidden;

    padding-left: 16px;
    padding-right: 16px;

    .row {
      display: flex;
      flex: 0 0 100%;
      position: relative;
    }

    .text-stuff {
      display: flex;
      flex: 1 1 100%;
      flex-wrap: wrap;

      border-top: 1px solid $light-black;
      border-bottom: 1px solid $light-black;

      padding-top: 33px;
      padding-bottom: 33px;
      
      .row {
        margin-bottom: 15px;
        justify-content: flex-start;

        &:last-child {
          margin-bottom: 0;
        }
      }

      label {
        font-family: 'Space Mono', monospace;
        font-size: 16px;
        line-height: 33px;
        display: flex;
        flex: 0 0 212px;
      }
      input {
        border: none;
        background: $white;
        font-family: 'Space Mono', monospace;
        font-size: 16px;
        font-weight: 700;
        height: 33px;
        line-height: 33px;

        padding: 0 14px 0 14px;

        display: flex;
        flex: 0 1 429px;
      }

      .colorpicker {
        display: flex;
        flex: 0 0 62px;
        height: 33px;

        background: $white;

        margin-left: 14px;

        cursor: pointer;

        position: relative;

        .color {
          display: block;
          width: 21px;
          height: 21px;

          position: absolute;
          top: 6px;
          left: 6px;
        }

        &::after {
          content: '';
          display: block;
          position: absolute;
          width: 13px;
          height: 8px;
          top: 14px;
          right: 11px;

          background-image: url('../assets/v.png');
        }
      }

      .vc-compact {
        display: none;
        z-index: 2;
        position: absolute;
        top: 33px;
        border-radius: 0;

        width: 56px;
        height: 56px;

        &.visible {
          display: flex;

          box-shadow: none;
        }
      }
    }

    .row-buttons {
      justify-content: flex-end;
    }

    .editor-button {
      display: flex;
      flex: 0 0 255px;
      height: 48px;
      background-color: $red;
      border: none;

      color: $white;
      font-family: 'Space Mono', monospace;
      font-size: 20px;
      font-weight: 700;
      justify-content: center;

      margin-top: 33px;
      margin-bottom: 34px;

      cursor: pointer;

      &:hover {
        background-color: $light-red;
      }
    }
    .reset-button {
      flex: 0 0 134px;
      background-color: $gray;
      color: $black;
      text-decoration: underline;

      font-size: 16px;

      margin-left: 10px;

      &:hover {
        background-color: $dark-gray;
      }
    }
  }
}
</style>
<style lang="scss">
@import '../styles/colors';
@import '../styles/scroller';

.vc-compact-color-item {
  margin-right: 3px !important;
  margin-bottom: 3px !important;
  width: 12px !important;
  height: 12px !important;
}
.vc-compact-colors {
  // height: 56px;
  @extend %scroller;
  overflow-y: scroll !important;
}
</style>