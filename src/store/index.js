/* eslint-disable */

import Vue from 'vue';
import Vuex from 'vuex';
// import * as actions from './actions';
// import * as getters from './getters';
import editor from './modules/editor';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        editor,
    },
});
