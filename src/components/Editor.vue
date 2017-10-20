<template>
  <div id="editor" @click="closeAllControls">
    <div class="editor-controls-container">
      <slider :live="live"></slider>
    </div>
    <div class="editor-controls-container">
      <div class="text-stuff">
        <div class="row">
          <label for="drawing-text">Besedilo čez video</label>
          <textarea id="drawing-text" type="text" v-model="localDrawingText"></textarea>
          <div class="row shrinkable">
            <div class="row">
              <div
                class="colorpicker"
                @click.stop="showColorPicker"
                ref="colorpicker"
              >
                <div class="color" :style="{ 'background-color': colorPickerProps.hex }"></div>
                <color-picker
                  v-model="colorPickerProps"
                  :class="{ visible: colorPickerVisible }"
                  ref="colorPalette"
                />
              </div>
              <div
                class="font-size-picker"
                @click.stop="displayFontOptions = !displayFontOptions"
              >
                <input
                  v-model="localFontSize"
                >
                <div
                  class="font-options"
                  v-if="displayFontOptions"
                >
                  <div
                    class="font-option"
                    v-for="option in fontOptions"
                    @click="localFontSize = option"
                  >{{ option }} px</div>
                </div>
              </div>
            </div>
            <div class="row">
              <div
                :class="['emoji-button', { visible: emojiPickerVisible }]"
                @click.stop="emojiPickerVisible = !emojiPickerVisible"
              >
                Dodaj emoji
                <picker
                  :emoji-size="32"
                  :sheet-size="32"
                  :per-line="9"
                  :skin="1"
                  :native="false"
                  set="emojione"
                  :class="['emojipicker', { visible: emojiPickerVisible }]"
                  :i18n="i18n_si"
                  @click="pickEmoji"
                  @click.native.stop
                ></picker>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <label for="mute" id="label-mute">Izklopi zvok</label>
          <input type="checkbox" id="mute" v-model="isMuted">
        </div>
      </div>
    </div>
    <div class="editor-controls-container">
      <div class="row row-buttons">
        <label for="title-text" :class="{shake: shakeTitle}">Naslov objave</label>
        <input id="title-text" :class="{shake: shakeTitle}" type="text" v-model="localTitleText"/>
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
/* global dataLayer */

import 'element-ui/lib/theme-default/index.css';
import { mapGetters } from 'vuex';
import { Compact } from 'vue-color';
import { Picker } from 'emoji-mart-vue';
import Slider from './Slider';

export default {
  name: 'Editor',

  data() {
    return {
      localDrawingText: '',
      localTitleText: '',
      localFontSize: 40,
      // colorPickerLeft: 0,
      colorPickerProps: {
        hex: '#bc2a2a',
      },
      colorPickerVisible: false,
      fontOptions: [10, 20, 30, 40, 50, 60, 70, 80, 90],
      displayFontOptions: false,
      emojiPickerVisible: false,
      i18n_si: {
        search: 'Išči ...',
        notfound: 'Ne najdem nobenega',
        categories: {
          search: 'Rezultati iskanja',
          recent: 'Pogosto uporabljeni',
          people: 'Smajliji in ljudje',
          nature: 'Živali in narava',
          foods: 'Hrana in pijača',
          activity: 'Aktivnosti',
          places: 'Potovanja in kraji',
          objects: 'Predmeti',
          symbols: 'Simboli',
          flags: 'Zastave',
          custom: 'Posebneži',
        },
      },
      shakeTitle: false,
      isMuted: false,
    };
  },

  props: {
    live: {
      type: Boolean,
      default: true,
    },
    videoId: {
      type: Number,
      default: 4,
    },
  },

  components: {
    Slider,
    'color-picker': Compact,
    Picker,
  },

  computed: {
    ...mapGetters({
      duration: 'video/durationGetter',
      loopStart: 'editor/startMarkerGetter',
      loopEnd: 'editor/endMarkerGetter',
    }),
  },

  methods: {
    closeAllControls() {
      this.emojiPickerVisible = false;
      this.displayFontOptions = false;
      this.colorPickerVisible = false;
    },

    createSnippet() {
      if (this.localTitleText === '') {
        this.shakeTitle = true;
        setTimeout(() => {
          this.shakeTitle = false;
        }, 1000);
      } else {
        const data = {
          video_id: this.videoId,
          start_time: this.loopStart * 1000,
          end_time: this.loopEnd * 1000,
          extras: JSON.stringify(this.$store.state.drawing),
          published: 1,
          looping: 1,
          name: this.localTitleText,
          muted: this.isMuted ? 1 : 0,
        };

        console.log(data);

        this.$http.post('http://snippet.soocenje.24ur.com/setSnippet', data, {
          emulateJSON: true,
        }).then((response) => {
          this.$router.push({ path: `/snippet/${response.data.id}` });
        }, () => {
          // something has gone wrong with saving your snippet
        });
      }
    },

    showColorPicker() {
      this.colorPickerVisible = !this.colorPickerVisible;
      dataLayer.push({
        event: 'GaEvent',
        eventCategory: 'create_snipet',
        eventAction: 'color',
        eventLabel: 'change',
      });
    },

    resetState() {
      this.$store.commit('editor/RESET_STATE');
      this.$store.commit('drawing/RESET_STATE');
      this.$emit('disableEditing');
    },

    getRandomString(length, chars) {
      let result = '';
      for (let i = length; i > 0; i -= 1) result += chars[Math.floor(Math.random() * chars.length)];
      return result;
    },

    pickEmoji(emoji) {
      const newEmoji = {
        emojiX: 300,
        emojiY: 300,
        emojiWidth: 40,
        emojiHeight: 40,
        emoji: emoji.unified,
        id: `emoji${this.getRandomString(10, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')}`,
      };
      this.$store.commit('drawing/ADD_EMOJI', newEmoji);

      dataLayer.push({
        event: 'GaEvent',
        eventCategory: 'create_snipet',
        eventAction: 'emoji',
        eventLabel: 'add',
      });
    },

    updateLocalFontSize(newLocalFontSize) {
      this.localFontSize = newLocalFontSize;
      this.displayFontOptions = false;
    },
  },

  watch: {
    localDrawingText(newLocalDrawingText) {
      this.$store.commit('drawing/UPDATE_TEXT', newLocalDrawingText);
      dataLayer.push({
        event: 'GaEvent',
        eventCategory: 'create_snipet',
        eventAction: 'text',
        eventLabel: 'change',
      });

      if (newLocalDrawingText === '') {
        dataLayer.push({
          event: 'GaEvent',
          eventCategory: 'create_snipet',
          eventAction: 'text',
          eventLabel: 'delete',
        });
      }
    },
    localFontSize(newLocalFontSize) {
      this.$store.commit('drawing/UPDATE_FONT_SIZE', newLocalFontSize);
      dataLayer.push({
        event: 'GaEvent',
        eventCategory: 'create_snipet',
        eventAction: 'fontsize',
        eventLabel: 'change',
      });
    },
    colorPickerProps(newColorPickerProps) {
      this.$store.commit('drawing/UPDATE_COLOR', newColorPickerProps.hex);
    },
    isMuted(newIsMuted) {
      this.$store.commit('video/UPDATE_IS_MUTED', newIsMuted);

      dataLayer.push({
        event: 'GaEvent',
        eventCategory: 'create_snipet',
        eventAction: 'sound',
        eventLabel: 'mute',
      });
    },
  },

  mounted() {
    // this.$store.commit('editor/UPDATE_END_TIME', this.duration);
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/colors';
@import '../styles/scroller';

@keyframes shake {
  10%, 90% {
    transform: translate3d(-1px, 0, 0);
  }
  
  20%, 80% {
    transform: translate3d(2px, 0, 0);
  }

  30%, 50%, 70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%, 60% {
    transform: translate3d(4px, 0, 0);
  }
}

.shake {
  animation: shake 0.82s cubic-bezier(.36,.07,.19,.97) both;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
}

#editor {
  width: 100%;

  padding-top: 16px;
  background-color: $gray;

  .editor-controls-container  {
    display: flex;
    flex: 0 1 949px;
    margin: auto;
    flex-wrap: wrap;
    max-width: 949px;

    padding-left: 16px;
    padding-right: 16px;

    .row {
      display: flex;
      flex: 0 1 100%;
      position: relative;
      
      &.shrinkable {
        flex: 1 0 173px;
        width: 173px;
      }

      .row {
        flex-wrap: wrap;
      }
    }

    label {
      font-family: 'Space Mono', monospace;
      font-size: 16px;
      line-height: 33px;
      display: flex;
      flex: 0 0 212px;
    }
    input, textarea {
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
    textarea {
      height: 81px;
    }
    #label-mute {
      cursor: pointer;
    }
    input[type="checkbox"] {
      display: block;
      flex: 0 0 20px;
      margin: 0;
      cursor: pointer;

      &::before {
        content: '';
        width: 30px;
        height: 30px;
        display: block;
        background-color: $white;
      }

      &:checked::before {
        background-image: url('../assets/icons/kljukica.svg');
      }
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
          top: 5px;
          left: 6px;
          border: 1px solid $gray;
        }

        &::after {
          content: '';
          display: block;
          position: absolute;
          width: 13px;
          height: 8px;
          top: 14px;
          right: 11px;

          background-image: url('../assets/icons/v.svg');
        }
      }

      .vc-compact {
        display: none;
        z-index: 2;
        position: relative;
        top: 33px;
        border-radius: 0;

        width: 56px;
        height: 76px;
        box-shadow: none;

        &.visible {
          display: flex;
        }
      }

      .font-size-picker {
        position: relative;
        height: 33px;

        input {
          max-width: 73px;
          // flex: 0 2;
          padding-left: 10px;
          padding-right: 0;
          margin-left: 14px;
          font-weight: 400;
          font-size: 14px;
        }

        &::before {
          content: ' px';
          display: block;
          position: absolute;
          top: 0;
          right: 30px;
          
          font-family: 'Space Mono', monospace;
          font-size: 14px;
          font-weight: 400;
          line-height: 33px;

        }

        &::after {
          content: '';
          display: block;
          position: absolute;
          width: 13px;
          height: 8px;
          top: 14px;
          right: 11px;

          background-image: url('../assets/icons/v.svg');
        }
      }
      .font-options {
        background-color: $white;
        position: relative;
        margin-left: 14px;
        height: 81px;
        overflow-y: auto;
        @extend %scroller;
        text-align: left;
        font-family: 'Space Mono', monospace;
        font-size: 14px;
        z-index: 2;

        .font-option {
          cursor: pointer;
          padding-left: 10px;

          &:hover {
            background-color: $black;
            color: $white;
          }
        }
      }
    }

    .emoji-button {
      position: relative;
      display: flex;
      flex: 0 1 141px;
      height: 33px;
      background-color: $blue;
      font-family: 'Space Mono', monospace;
      font-size: 16px;
      color: $white;
      font-weight: 700;
      text-align: center;
      line-height: 33px;
      padding-left: 9px;
      padding-right: 9px;
      // letter-spacing: 0.96px;
      cursor: pointer;

      margin-left: 14px;

      &:hover {
        background-color: $light-blue;

        &.visible::before {
          border-color: transparent transparent $light-blue transparent;
        }
      }

      &::after {
        content: '';
        width: 20px;
        background-image: url('../assets/icons/emoji.png');
        background-size: 20px 20px;
        background-repeat: no-repeat;
        background-position: center;
        margin-left: 13px;
      }

      &.visible::before {
        content: '';
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 0 6px 8px 6px;
        border-color: transparent transparent $blue transparent;
        position: absolute;
        top: -8px;
        right: 15px;
        display: block;
        z-index: 3;
      }
    }
    .emojipicker {
      position: absolute;
      display: none;
      right: 0;
      top: -303px;
      border-radius: 0;
      width: 257px;
      height: 291px;
      z-index: 2;
      overflow-y: hidden;
      border: none;
      box-shadow: 0 2px 5px 1px rgba(0, 0, 0, 0.35);

      &.visible {
        display: block;
      }
    }

    .row-buttons {
      padding-top: 33px;
      padding-bottom: 33px;
    }

    .editor-button {
      display: flex;
      flex: 0 2 120px;
      height: 48px;
      background-color: $red;
      border: none;

      color: $white;
      font-family: 'Space Mono', monospace;
      font-size: 20px;
      font-weight: 700;
      justify-content: center;

      margin-left: 14px;
      margin-top: -8px;

      cursor: pointer;

      &:hover {
        background-color: $light-red;
      }
    }
    .reset-button {
      flex: 0 2 120px;
      background-color: $gray;
      color: $black;
      text-decoration: underline;

      font-size: 16px;

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
.emoji-mart-search,
.emoji-mart-category-label {
  display: none;
}
</style>