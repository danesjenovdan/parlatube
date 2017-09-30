<template>
  <div id="drawing-container">
    <vue-draggable-resizable
      v-if="(drawingText !== '') && videoPlaying"
      :x="10"
      :y="300"
      :w="620"
      :h="50"
      @dragstop="onTextDragStop"
      @resizestop="onTextResizeStop"
      :parent="true"
      id="text"
      :class="{ editable: textEditable }"
      :draggable="!disableEditing"
      :resizable="!disableEditing"
      :style="{'font-size': `${fontSize}px`, color: color}"
      ref="text"
    >
      {{ drawingText }}
    </vue-draggable-resizable>
    <vue-draggable-resizable
      v-for="emoji in emojis"
      :x="300"
      :y="300"
      :w="40"
      :h="40"
      @dragstop="onEmojiDragStop(emoji.id, $event)"
      @resizestop="onEmojiResizeStop(emoji.id, $event)"
      :parent="true"
      :id="emoji.id"
      :draggable="!disableEditing"
      :resizable="!disableEditing"
      :class="['emoji', { editable: emojiEditable }]"
    >
      <div
        class="emoji-image"
        :style="{'background-image': `url('http://djstatic.knedl.si/emojis/${emoji.emoji}.png')`}"
      >
      </div>
    </vue-draggable-resizable>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { Emoji } from 'emoji-mart-vue';
import VueDraggableResizable from './VueDraggableResizable';
// import VueDraggableResizable from 'vue-draggable-resizable';

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
    onTextDragStop(event) {
      this.$store.commit('drawing/UPDATE_TEXT_X', event.left);
      this.$store.commit('drawing/UPDATE_TEXT_Y', event.top);
      this.$store.commit('drawing/UPDATE_TEXT_WIDTH', this.$refs.text.width);
      this.$store.commit('drawing/UPDATE_TEXT_HEIGHT', this.$refs.text.height);

      const rect = this.$el.getBoundingClientRect();
      this.$store.commit('drawing/UPDATE_VIDEO_SIZE', { width: rect.width, height: rect.height });
    },

    onTextResizeStop(event) {
      this.$store.commit('drawing/UPDATE_TEXT_X', event.left);
      this.$store.commit('drawing/UPDATE_TEXT_Y', event.top);
      this.$store.commit('drawing/UPDATE_TEXT_WIDTH', event.width);
      this.$store.commit('drawing/UPDATE_TEXT_HEIGHT', event.height);

      const rect = this.$el.getBoundingClientRect();
      this.$store.commit('drawing/UPDATE_VIDEO_SIZE', { width: rect.width, height: rect.height });
    },

    onEmojiDragStop(id, event) {
      const newEmojis = this.emojis.filter(emoji => emoji.id === id).map((emoji) => {
        const generatedEmoji = {
          emojiX: event.left,
          emojiY: event.top,
          emojiWidth: emoji.emojiWidth,
          emojiHeight: emoji.emojiHeight,
          emoji: emoji.emoji,
          id,
        };
        return generatedEmoji;
      });

      this.$store.commit('drawing/UPDATE_EMOJI', newEmojis[0]);

      const rect = this.$el.getBoundingClientRect();
      this.$store.commit('drawing/UPDATE_VIDEO_SIZE', { width: rect.width, height: rect.height });
    },

    onEmojiResizeStop(id, event) {
      const newEmoji = this.emojis.filter(emoji => emoji.id === id).map((emoji) => {
        const generatedEmoji = {
          emojiX: event.left,
          emojiY: event.top,
          emojiWidth: event.width,
          emojiHeight: event.height,
          emoji: emoji.emoji,
          id,
        };
        return generatedEmoji;
      })[0];

      this.$store.commit('drawing/UPDATE_EMOJI', newEmoji);

      const rect = this.$el.getBoundingClientRect();
      this.$store.commit('drawing/UPDATE_VIDEO_SIZE', { width: rect.width, height: rect.height });
    },

    manipulateSizes() {
      const rect = this.$el.getBoundingClientRect();
      const text = this.$children
        .filter(child => child.$el.innerText !== '')[0];
      const emojiElements = this.$children
        .filter(child => child.$el.classList[1] === 'emoji');

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
        // text.x = localTextX;
        text.top = localTextY;
        // text.y = localTextY;
        text.width = localTextWidth;
        // text.w = localTextWidth;
        text.height = localTextHeight;
        // text.h = localTextHeight;

        const localFontSize = (this.$store.state.drawing.fontSize /
          this.$store.state.drawing.videoHeight) * rect.height;
        this.$store.commit('drawing/UPDATE_FONT_SIZE', localFontSize);
      }

      emojiElements.forEach((emojiElement) => {
        /* eslint-disable no-param-reassign */
        const myEmoji = this.emojis.filter(emoji => emoji.id === emojiElement.$el.id)[0];
        const localEmojiX = (myEmoji.emojiX /
          this.$store.state.drawing.videoWidth) * rect.width;
        const localEmojiY = (myEmoji.emojiY /
          this.$store.state.drawing.videoHeight) * rect.height;
        const localEmojiWidth = (myEmoji.emojiWidth /
          this.$store.state.drawing.videoWidth) * rect.width;
        const localEmojiHeight = (myEmoji.emojiHeight /
          this.$store.state.drawing.videoHeight) * rect.height;

        emojiElement.left = localEmojiX;
        emojiElement.x = localEmojiX;
        emojiElement.top = localEmojiY;
        emojiElement.y = localEmojiY;
        emojiElement.width = localEmojiWidth;
        emojiElement.w = localEmojiWidth;
        emojiElement.height = localEmojiHeight;
        emojiElement.h = localEmojiHeight;
      });

      this.$store.commit('drawing/UPDATE_VIDEO_SIZE', { width: rect.width, height: rect.height });
    },
  },

  computed: {
    ...mapState({
      drawingText: state => state.drawing.text,
      fontSize: state => state.drawing.fontSize,
      color: state => state.drawing.color,
      emojis: state => state.drawing.emojis,
      videoPlaying: state => state.video.playing,
    }),

    textEditable() {
      return (!this.disableEditing && (this.drawingText !== ''));
    },
    emojiEditable() {
      return (!this.disableEditing && (this.emojis.length > 0));
    },
  },

  watch: {
    videoPlaying(newVideoPlaying) {
      if (newVideoPlaying) {
        this.$nextTick(() => {
          this.manipulateSizes();
        });
      }
    },
  },

  mounted() {
    if (this.disableEditing) {
      // const rect = this.$el.getBoundingClientRect();
      // this.$store.commit
      // ('drawing/UPDATE_VIDEO_SIZE', { width: rect.width, height: rect.height });
    }
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/colors';

#drawing-container {
  display: block;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;

  #text {
    min-width: 40px;
    min-height: 40px;
    background: transparent;
    position: absolute;
    font-size: 40px;
    font-family: Anton, Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
    font-weight: 900;
    top: 45%;
    left: 45%;
    overflow: hidden;

    text-align: center;

    user-select: none;

    text-shadow: 1px 1px 0 $black, -1px -1px 0 $black, 1px -1px 0 $black, -1px 1px 0 $black, 1px 1px 0 $black;
    letter-spacing: 3px;
  }
}

.emoji {
  .emoji-image {
    width: 100%;
    height: 100%;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }
}
</style>

<style lang="scss">
#text.editable, .emoji.editable {
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