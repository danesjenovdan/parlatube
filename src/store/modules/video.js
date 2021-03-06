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
  looping: false,
  loopStart: 0,
  loopEnd: 0,
  playing: false,
  shouldIPause: false,
  loadedAndPlaying: false,
  isMuted: false,
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
  UPDATE_LOOP_START(state, newLoopStart) {
    state.loopStart = newLoopStart;
  },
  UPDATE_LOOP_END(state, newLoopEnd) {
    state.loopEnd = newLoopEnd;
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
  RESET_STATE(state) {
    state.videoId = '';
    state.currentTime = 0;
    state.duration = 0;
    state.oldSeekTo = 0;
    state.seekTo = 0;
    state.looping = false;
    state.loopStart = 0;
    state.loopEnd = 0;
  },
  UPDATE_PLAYING(state, newPlaying) {
    state.playing = newPlaying;
  },
  PLAY_VIDEO(state) {
    state.shouldIPause = false;
  },
  PAUSE_VIDEO(state) {
    state.shouldIPause = true;
  },
  TOGGLE_SHOULD_I_PAUSE(state) {
    state.shouldIPause = !state.shouldIPause;
  },
  UPDATE_LOADED_AND_PLAYING(state, newLoadedAndPlaying) {
    state.loadedAndPlaying = newLoadedAndPlaying;
  },
  UPDATE_IS_MUTED(state, newIsMuted) {
    state.isMuted = newIsMuted;
  },
};

// getters
const getters = {
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
