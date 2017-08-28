/* eslint-disable no-unused-vars, no-param-reassign, no-shadow */

// namespace!
const namespaced = true;

// initial state
const state = {
  videoId: '',
  currentTime: 0,
  duration: 0,
  oldSeekTo: 0,
  seekTo: 0,
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
  UPDATE_SEEK_TO(state, newSeekTo) {
    state.seekTo = newSeekTo;
  },
  UPDATE_OLD_SEEK_TO(state, newOldSeekTo) {
    state.oldSeekTo = newOldSeekTo;
  },
};

// getters
const getters = {
  currentTimeGetter: state => state.currentTime,
  seekToGetter: state => state.seekTo,
  durationGetter: state => state.duration,
};

// actions
// const actions = {};

export default {
  namespaced,
  state,
  mutations,
  getters,
};
