import Vue from 'vue'
import './tool/tool'  //this is important
import VueRouter from 'vue-router'
import routes from './router/router'
import app from './App.vue'
import {routerMode} from './config/env'
import './config/rem'
import FastClick from 'fastclick'
import Vuex from 'vuex'
import {uploadImgUrl,upImgCb} from './store/service'

import VueHtml5Editor from 'vue-html5-editor'
Vue.use(VueHtml5Editor,{
    image: {
        // 后端图片上传的地址，如果为空，默认转图片为base64
        // Url of the server-side,default null and convert image to base64
        server: uploadImgUrl(),
        // 请求时表单参数名
        // the name for file field in multipart request
        fieldName: "image",
        // 文件最大体积，单位字节  max file size
        sizeLimit: 512 * 1024,
        // 是否压缩，默认true，设置为true时会使用localResizeIMG进行压缩
        // default true,if set to true,the image will resize by localResizeIMG (https://github.com/think2011/localResizeIMG)
        compress: true,
        // 图片压缩选项
        // follows are options of localResizeIMG
        width: 1600,
        height: 1600,
        quality: 80,
        // 响应数据处理
        // handle response data，return image url
        uploadHandler(responseText){
            //default accept json data like  {ok:false,msg:"unexpected"} or {ok:true,data:"image url"}
            var json = JSON.parse(responseText)
            callBack(json)
        }
    },

});
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