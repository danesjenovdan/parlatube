/* eslint-disable */

// namespace!
const namespaced = true;

// initial state
const state = {
    startTime: 0,
    endTime: 0,
    looping: false,
    dragging: false,
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
