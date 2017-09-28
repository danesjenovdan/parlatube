/* eslint-disable no-unused-vars, no-param-reassign, no-shadow */

// namespace!
const namespaced = true;

// initial state
const state = {
  textX: 10,
  textY: 300,
  textWidth: 620,
  textHeight: 50,
  text: '',
  fontSize: 40,
  color: '#bc2a2a',

  emojiX: 300,
  emojiY: 300,
  emojiWidth: 40,
  emojiHeight: 40,
  emoji: '',

  videoWidth: 0,
  videoHeight: 0,
};

// mutations
const mutations = {
  UPDATE_TEXT_X(state, newTextX) {
    state.textX = newTextX;
  },
  UPDATE_TEXT_Y(state, newTextY) {
    state.textY = newTextY;
  },
  UPDATE_TEXT_WIDTH(state, newTextWidth) {
    state.textWidth = newTextWidth;
  },
  UPDATE_TEXT_HEIGHT(state, newTextHeight) {
    state.textHeight = newTextHeight;
  },
  UPDATE_TEXT(state, newText) {
    state.text = newText;
  },
  UPDATE_FONT_SIZE(state, newFontSize) {
    state.fontSize = newFontSize;
  },
  UPDATE_COLOR(state, newColor) {
    state.color = newColor;
  },

  UPDATE_EMOJI_X(state, newEmojiX) {
    state.emojiX = newEmojiX;
  },
  UPDATE_EMOJI_Y(state, newEmojiY) {
    state.emojiY = newEmojiY;
  },
  UPDATE_EMOJI_WIDTH(state, newEmojiWidth) {
    state.emojiWidth = newEmojiWidth;
  },
  UPDATE_EMOJI_HEIGHT(state, newEmojiHeight) {
    state.emojiHeight = newEmojiHeight;
  },
  UPDATE_EMOJI(state, newEmoji) {
    state.emoji = newEmoji;
  },

  UPDATE_VIDEO_SIZE(state, newVideoSizes) {
    state.videoWidth = newVideoSizes.width;
    state.videoHeight = newVideoSizes.height;
  },

  UPDATE_STATE(state, newState) {
    state.textX = newState.textX;
    state.textY = newState.textY;
    state.textWidth = newState.textWidth;
    state.textHeight = newState.textHeight;
    state.text = newState.text;
    state.fontSize = newState.fontSize;
    state.color = newState.color;

    state.emojiX = newState.emojiX;
    state.emojiY = newState.emojiY;
    state.emojiWidth = newState.emojiWidth;
    state.emojiHeight = newState.emojiHeight;
    state.emoji = newState.emoji;

    state.videoWidth = newState.videoWidth;
    state.videoHeight = newState.videoHeight;
  },
  RESET_STATE(state) {
    state.textX = 10;
    state.textY = 300;
    state.textWidth = 620;
    state.textHeight = 50;
    state.text = '';
    state.fontSize = 40;
    state.color = '#bc2a2a';

    state.emojiX = 300;
    state.emojiY = 300;
    state.emojiWidth = 40;
    state.emojiHeight = 40;
    state.emoji = '';

    state.videoWidth = 0;
    state.videoHeight = 0;
  },
};

// getters
const getters = {
  xGetter: state => state.x,
  yGetter: state => state.y,
  textGetter: state => state.text,
  fontSizeGetter: state => state.fontSize,
  colorGetter: state => state.color,
};

// actions
// const actions = {};

export default {
  namespaced,
  state,
  mutations,
  getters,
};
