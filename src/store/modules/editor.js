/* eslint-disable no-unused-vars, no-param-reassign, no-shadow */

// namespace!
const namespaced = true;

// initial state
const state = {
  startTime: 0,
  endTime: 0,
  looping: false,
  dragging: false,
  sliderValues: [0, 0],
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
  TURN_LOOPING_ON(state) {
    state.looping = true;
  },
  TURN_LOOPING_OFF(state) {
    state.looping = false;
  },
  TOGGLE_DRAG(state) {
    state.dragging = !state.dragging;
  },
  UPDATE_SLIDER_VALUES(state, newValues) {
    state.sliderValues = newValues;
  },
  RESET_STATE(state) {
    state.startTime = 0;
    state.endTime = 0;
    state.looping = false;
    state.dragging = false;
    state.sliderValues = [0, 0];
  },
};

// getters
const getters = {
  startMarkerGetter: state => state.sliderValues[0],
  endMarkerGetter: state => state.sliderValues[1],
};

// actions
const actions = {
  updateSliderValues(context, newValues) {
    console.log(context, newValues);
    context.commit('UPDATE_SLIDER_VALUES', newValues);
    context.commit('UPDATE_START_TIME', newValues[0]);
    context.commit('UPDATE_END_TIME', newValues[1]);
  },
};

export default {
  namespaced,
  state,
  mutations,
  getters,
  actions,
};
