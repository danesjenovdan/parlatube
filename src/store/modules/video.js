/* eslint-disable */

// namespace!
const namespaced = true;

// initial state
const state = {
    videoId: '',
};

// mutations
const mutations = {
    UPDATE_VIDEOID(state, newVideoId) {
        state.videoId = newVideoId;
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
}
