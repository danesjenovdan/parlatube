/* eslint-disable no-unused-vars, no-param-reassign, no-shadow */

// namespace!
const namespaced = true;

// initial state
const state = {
  startTime: 0,
  endTime: 0,
  looping: true,
  dragging: false,
  sliderValues: [0, 0],
  sealed: true,
};

// mutations
const mutations = {
  UPDATE_START_TIME(state, newStartTime) {
    state.currentTime = newStartTime;
  },
  UPDATE_END_TIME(state, newEndTime) {
    state.endTime = newEndTime;
  },
  TOGGLE_LOOPING(state) {
    state.looping = !state.looping;
  },
  TOGGLE_DRAG(state) {
    state.dragging = !state.dragging;
  },
  UPDATE_SLIDER_VALUES(state, newValues) {
    state.sliderValues = newValues;
  },
  TOGGLE_SEAL(state) {
    state.sealed = !state.sealed;
  },
  BREAK_SEAL(state) {
    state.sealed = false;
  },
};

// getters
// const getters = {};

// actions
// const actions = {};

export default {
  namespaced,
  state,
  mutations,
};
