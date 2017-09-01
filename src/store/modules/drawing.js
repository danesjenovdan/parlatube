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
  UPDATE_STATE(state, newState) {
    state.x = newState.x;
    state.y = newState.y;
    state.text = newState.text;
    state.fontSize = newState.fontSize;
    state.color = newState.color;
  },
  RESET_STATE(state) {
    state.x = 0;
    state.y = 0;
    state.text = '';
    state.fontSize = 40;
    state.color = '#ffffff';
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
