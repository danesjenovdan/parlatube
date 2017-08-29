/* eslint-disable no-unused-vars, no-param-reassign, no-shadow */

// namespace!
const namespaced = true;

// initial state
const state = {
  x: 0,
  y: 0,
  text: '',
  fontSize: 40,
  color: '#ffffff',
};

// mutations
const mutations = {
  UPDATE_X(state, newX) {
    state.x = newX;
  },
  UPDATE_Y(state, newY) {
    state.y = newY;
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
