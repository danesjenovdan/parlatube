/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */

import Vue from 'vue';
import Router from 'vue-router';
import Home from 'pages/Home';
import Snippet from 'pages/Snippet';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/snippet/:snippetId',
      name: 'Snippet',
      component: Snippet,
    },
  ],
});
