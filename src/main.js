import Vue from 'vue'
import './tool/tool'  //this is important
import VueRouter from 'vue-router'
import routes from './router/router'
import app from './App.vue'
import {routerMode} from './config/env'
import './config/rem'
import FastClick from 'fastclick'
import Vuex from 'vuex'

import VueHtml5Editor from 'vue-html5-editor'
Vue.use(VueHtml5Editor);
if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', function() {
    FastClick.attach(document.body);
  }, false);
}

Vue.use(VueRouter)
const router = new VueRouter({
	routes,
	mode: routerMode,
	strict: process.env.NODE_ENV !== 'production'
})


import  { ToastPlugin } from 'vux'
Vue.use(ToastPlugin)
Vue.use(Vuex)

import ElementUI from 'element-ui';
Vue.use(ElementUI);
import 'element-ui/lib/theme-default/index.css'; 
const store = new Vuex.Store({
  state: {
    webViewUrl:'',


  },
  mutations: {
   setWebUrl(state,url){
       console.log(url)
    state.webViewUrl = url
   },

  },
  actions: {
    
  
  },
})


new Vue({
	router,
	store,
	render:h=>h(app)
}).$mount('#app')