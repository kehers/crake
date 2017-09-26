import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter);

import App from '../components/App.vue';
import Init from '../components/Init.vue';
import Keys from '../components/Keys.vue';
import Words from '../components/Words.vue';
import Dashboard from '../components/Dashboard.vue';
// Children of dashboard
import Settings from '../components/Settings.vue';
import Edit from '../components/Edit.vue';
import Tweets from '../components/Tweets.vue';

import Tagify from './tagify.js';
Object.defineProperty(Vue.prototype, '$Tagify', { value: Tagify });

const routes = [
  { path: '/', name: 'init', component: Init }
  , { path: '/keys', component: Keys }
  , { path: '/words', component: Words }
  , { path: '/dashboard', component: Dashboard,
    children: [{
        path: '',
        component: Tweets
      }, {
        path: 'edit',
        component: Edit
      }, {
        path: 'settings',
        component: Settings
      }
    ]
  }
  , { path: '*', redirect: '/' }
];

const router = new VueRouter({
  routes
});

// App
new Vue({
  el: '#app',
  router,
  template: '<router-view></router-view>'
});