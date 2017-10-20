/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */

import Vue from 'vue';
import Router from 'vue-router';
import Home from 'pages/Home';
import Snippet from 'pages/Snippet';
import Playlist from 'pages/Playlist';
import Collections from 'pages/Collections';
import Soocenje from 'pages/Soocenje';
import Embed from 'pages/Embed';

Vue.use(Router);

export default new Router({
  linkExactActiveClass: 'active',
  mode: 'history',

  scrollBehavior(to) {
    // check if any matched route config has meta that requires scrolling to top
    if (to.matched.some(m => m.meta.scrollTop)) {
      return {
        x: to.matched.some(m => m.meta.scrollTop),
        y: 0,
      };
    }

    return {
      x: 0,
      y: 0,
    };
  },

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
    {
      path: '/playlist/:playlistId',
      name: 'Playlist',
      component: Playlist,
    },
    {
      path: '/izseki',
      name: 'Collections',
      component: Collections,
    },
    {
      path: '/soocenje/:videoId',
      name: 'Soocenje',
      component: Soocenje,
    },
    {
      path: '/embed/:snippetId',
      name: 'Embed',
      component: Embed,
    },
  ],
});
