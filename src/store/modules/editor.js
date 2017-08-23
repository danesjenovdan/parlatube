/* eslint-disable */

// namespace!
const namespaced = true;

// initial state
const state = {
    duration: 0,
    currentTime: 0,
    endTime: 0,
    looping: false,
    dragging: false,
};

// mutations
const mutations = {
    UPDATE_DURATION(state, newDuration) {
        state.duration = newDuration;
    },
    UPDATE_CURRENT_TIME(state, newCurrentTime) {
        state.currentTime = newCurrentTime;
    },
    UPDATE_END_TIME(state, newEndTime) {
        state.endTime = newEndTime;
    },
    TOGGLE_LOOPING(state) {
        state.looping = !state.looping;
    },
    TOGGLE_DRAG(state) {
        state.dragging = !state.dragging;
    }
};

// getters
// const getters = {};

// actions
// const actions = {};

export default {
    namespaced,
    state,
    mutations,
}
