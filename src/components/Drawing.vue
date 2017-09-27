<template>
  <div id="drawing-container" @click="manipulateTextSize">
    <vue-draggable-resizable
      v-if="drawingText !== ''"
      :x="$store.state.drawing.textX"
      :y="$store.state.drawing.textY"
      :w="$store.state.drawing.textWidth"
      :h="$store.state.drawing.textHeight"
      @dragstop="onTextDragStop"
      @resizestop="onTextResizeStop"
      :parent="false"
      id="text"
      :class="{ editable: textEditable }"
      :draggable="!disableEditing"
      :resizable="!disableEditing"
      :style="{'font-size': `${fontSize}px`, color: color}"
    >
      {{ drawingText }}
    </vue-draggable-resizable>
    <vue-draggable-resizable
      v-if="selectedEmoji !== ''"
      :x="$store.state.drawing.emojiX"
      :y="$store.state.drawing.emojiY"
      :w="$store.state.drawing.emojiWidth"
      :h="$store.state.drawing.emojiHeight"
      @dragstop="onEmojiDragStop"
      @resizestop="onEmojiResizeStop"
      :parent="false"
      id="emoji"
      :draggable="!disableEditing"
      :resizable="!disableEditing"
    >
      <div
        id="emoji-image"
        :style="{'background-image': `url('http://djstatic.knedl.si/emojis/${selectedEmoji}.png')`}"
      >
      </div>
    </vue-draggable-resizable>
  </div>
</template>

<script>
import VueDraggableResizable from 'vue-draggable-resizable';
import { mapState } from 'vuex';
import { Emoji } from 'emoji-mart-vue';

export default {
  name: 'Drawing',

  components: {
    VueDraggableResizable,
    Emoji,
  },

  props: {
    disableEditing: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
    };
  },

  methods: {
    onTextDragStop(left, top) {
      this.$store.commit('drawing/UPDATE_TEXT_X', left);
      this.$store.commit('drawing/UPDATE_TEXT_Y', top);

      const rect = this.$el.getBoundingClientRect();
      this.$store.commit('drawing/UPDATE_VIDEO_SIZE', { width: rect.width, height: rect.height });
    },

    onTextResizeStop(left, top, width, height) {
      this.$store.commit('drawing/UPDATE_TEXT_X', left);
      this.$store.commit('drawing/UPDATE_TEXT_Y', top);
      this.$store.commit('drawing/UPDATE_TEXT_WIDTH', width);
      this.$store.commit('drawing/UPDATE_TEXT_HEIGHT', height);

      const rect = this.$el.getBoundingClientRect();
      this.$store.commit('drawing/UPDATE_VIDEO_SIZE', { width: rect.width, height: rect.height });
    },

    onEmojiDragStop(left, top) {
      this.$store.commit('drawing/UPDATE_EMOJI_X', left);
      this.$store.commit('drawing/UPDATE_EMOJI_Y', top);

      const rect = this.$el.getBoundingClientRect();
      this.$store.commit('drawing/UPDATE_VIDEO_SIZE', { width: rect.width, height: rect.height });
    },

    onEmojiResizeStop(left, top, width, height) {
      this.$store.commit('drawing/UPDATE_EMOJI_X', left);
      this.$store.commit('drawing/UPDATE_EMOJI_Y', top);
      this.$store.commit('drawing/UPDATE_EMOJI_WIDTH', width);
      this.$store.commit('drawing/UPDATE_EMOJI_HEIGHT', height);

      const rect = this.$el.getBoundingClientRect();
      this.$store.commit('drawing/UPDATE_VIDEO_SIZE', { width: rect.width, height: rect.height });
    },

    manipulateTextSize() {
      const rect = this.$el.getBoundingClientRect();
      const text = this.$children
        .filter(child => child.left === this.$store.state.drawing.textX)[0];
      const emoji = this.$children
        .filter(child => child.left === this.$store.state.drawing.emojiX)[0];

      console.log(text);
      console.log(emoji);

      if (text) {
        const localTextX = (this.$store.state.drawing.textX /
          this.$store.state.drawing.videoWidth) * rect.width;
        const localTextY = (this.$store.state.drawing.textY /
        this.$store.state.drawing.videoHeight) * rect.height;
        const localTextWidth = (this.$store.state.drawing.textWidth /
          this.$store.state.drawing.videoWidth) * rect.width;
        const localTextHeight = (this.$store.state.drawing.textHeight /
          this.$store.state.drawing.videoHeight) * rect.height;

        text.left = localTextX;
        text.top = localTextY;
        text.width = localTextWidth;
        text.height = localTextHeight;

        const localFontSize = (this.$store.state.drawing.fontSize /
          this.$store.state.drawing.videoHeight) * rect.height;
        this.$store.commit('drawing/UPDATE_FONT_SIZE', localFontSize);
      }

      if (emoji) {
        const localEmojiX = (this.$store.state.drawing.emojiX /
          this.$store.state.drawing.videoWidth) * rect.width;
        const localEmojiY = (this.$store.state.drawing.emojiY /
          this.$store.state.drawing.videoHeight) * rect.height;
        const localEmojiWidth = (this.$store.state.drawing.emojiWidth /
          this.$store.state.drawing.videoWidth) * rect.width;
        const localEmojiHeight = (this.$store.state.drawing.emojiHeight /
          this.$store.state.drawing.videoHeight) * rect.height;

        emoji.left = localEmojiX;
        emoji.top = localEmojiY;
        emoji.width = localEmojiWidth;
        emoji.height = localEmojiHeight;

        console.log(localEmojiX, localEmojiY, localEmojiWidth, localEmojiHeight);
      }
    },
  },

  computed: {
    ...mapState({
      drawingText: state => state.drawing.text,
      fontSize: state => state.drawing.fontSize,
      color: state => state.drawing.color,
      selectedEmoji: state => state.drawing.emoji,
    }),

    textEditable() {
      console.log(!this.disableEditing && (this.drawingText !== ''));
      return (!this.disableEditing && (this.drawingText !== ''));
    },
  },
};
</script>

<style lang="scss" scoped>
#drawing-container {
  width: 100%;
  height: 100%;
  position: absolute;

  #text {
    background: transparent;
    position: absolute;
    font-size: 40px;
    font-family: Anton, Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
    font-weight: 900;
    text-transform: uppercase;
    top: 45%;
    left: 45%;
    overflow: hidden;

    text-align: center;

    user-select: none;
  }
}

#emoji {
  #emoji-image {
    width: 100%;
    height: 100%;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
}
</style>

<style lang="scss">
#text.editable {
  .handle {
    display: block !important;
  }
}
.handle-tl {
  top: 0 !important;
  left: 0 !important;
}
.handle-tm {
  top: 0 !important;
}
.handle-tr {
  top: 0 !important;
  right: 0 !important;
}
.handle-mr {
  right: 0 !important;
}
.handle-br {
  bottom: 0 !important;
  right: 0 !important;
}
.handle-bm {
  bottom: 0 !important;
}
.handle-bl {
  bottom: 0 !important;
  left: 0 !important;
}
.handle-ml {
  left: 0 !important;
}
</style>