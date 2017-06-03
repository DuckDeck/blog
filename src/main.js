import Vue from 'vue'
import './tool/tool'  //this is important
import VueRouter from 'vue-router'
import routes from './router/router'
import app from './App.vue'
import {routerMode} from './config/env'
import './config/rem'
import FastClick from 'fastclick'
import Vuex from 'vuex'

register()



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


Vue.use(Vuex)

import ElementUI from 'element-ui';
Vue.use(ElementUI);
import 'element-ui/lib/theme-default/index.css'; 



import VueAwesomeSwiper from 'vue-awesome-swiper'
Vue.use(VueAwesomeSwiper)

const store = new Vuex.Store({
  state: {
    webViewUrl:'',
  },
  mutations: {
   setWebUrl(state,url){
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