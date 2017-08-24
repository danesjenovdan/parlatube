/* eslint-disable no-unused-vars, no-param-reassign, no-shadow */

// namespace!
const namespaced = true;

// initial state
const state = {
  videoId: '',
  currentTime: 0,
  duration: 0,
};

// mutations
const mutations = {
  UPDATE_VIDEOID(state, newVideoId) {
    state.videoId = newVideoId;
  },
  UPDATE_CURRENT_TIME(state, newCurrentTime) {
    state.currentTime = newCurrentTime;
  },
  UPDATE_DURATION(state, newDuration) {
    state.duration = newDuration;
  },
};

// getters
const getters = {
  currentTime: state => state.currentTime,
};

// actions
// const actions = {};

export default {
  namespaced,
  state,
  mutations,
  getters,
};
