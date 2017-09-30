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

  emojis: [],

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

  ADD_EMOJI(state, newEmoji) {
    state.emojis.push(newEmoji);
  },
  UPDATE_EMOJI_X(state, payload) {
    state.emojis.filter(emoji => emoji.id === payload.id)[0].emojiX = payload.newEmojiX;
  },
  UPDATE_EMOJI_Y(state, payload) {
    state.emojis.filter(emoji => emoji.id === payload.id)[0].emojiY = payload.newEmojiY;
  },
  UPDATE_EMOJI_WIDTH(state, payload) {
    state.emojis.filter(emoji => emoji.id === payload.id)[0].emojiWidth = payload.newEmojiWidth;
  },
  UPDATE_EMOJI_HEIGHT(state, payload) {
    state.emojis.filter(emoji => emoji.id === payload.id)[0].emojiHeight = payload.newEmojiHeight;
  },
  UPDATE_EMOJI(state, payload) {
    const newEmojis = JSON.parse(JSON.stringify(state.emojis));
    const lookingFor = newEmojis.filter(emoji => emoji.id === payload.id)[0];
    newEmojis[newEmojis.indexOf(lookingFor)] = payload;
    state.emojis = newEmojis;
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

    state.emojis = newState.emojis;

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

    state.emojis = [];

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
