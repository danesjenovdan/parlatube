/* eslint-disable */

import Vue from 'vue';
import Vuex from 'vuex';
// import * as actions from './actions';
// import * as getters from './getters';
import video from './modules/video';
import editor from './modules/editor';
import drawing from './modules/drawing';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        editor,
        video,
        drawing,
    },
});
