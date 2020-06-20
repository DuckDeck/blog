import Vue from 'vue'
import './tool/tool'  //this is important
import VueRouter from 'vue-router'
import routes from './router/router'
import app from './App.vue'
import {routerMode} from './config/env'
import FastClick from 'fastclick'
import Vuex from 'vuex'
import {uploadImgConfig,upImgCb} from './store/service'
import VueHtml5Editor from 'vue-html5-editor'
import {baseUrl} from './config/env'
import  mavonEditor  from 'mavon-editor'
import Vue2Emoji from 'vuejs-emoji'
import VideoPlayer from 'vue-video-player'
import 'font-awesome/css/font-awesome.min.css'
require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')
import 'videojs-flash'
Vue.use(Vue2Emoji)
//import 'mavon-editor/dist/css/index.css'
Vue.use(mavonEditor)
Vue.use(VueHtml5Editor,{
     image: {
         // 后端图片上传的地址，如果为空，默认转图片为base64
         // Url of the server-side,default null and convert image to base64
         //这个问题暂时无解，目前只能用不带token的url上传图片
         server: 'https://lovelive.ink:19996/upload/img' ,
         // 请求时表单参数名
         // the name for file field in multipart request
         fieldName: "upload-key",
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

// use
Vue.use(VideoPlayer)

register()

const ah=require("ajax-hook")
ah.hookAjax({ 
  onreadystatechange:function(xhr){
    
  },
  open:function(arg){

    //这个地方是原来在文章里上传图片用了控件的一个功能，本身控件是可以直接上传的但是这里让控件调用指定接口，然后这里hook这个接口来实现
    //自定义上传功能，在控件里改成了uploadArticleImg相关接口
    if(arg[1].indexOf('uploadArticleImg') >= 0 ){
      arg[1] += "/" + userId() + "/" + createToken()
    }
  },
  onload:function(xhr){ 

  }
  
})

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
import  'element-ui/lib/theme-chalk/index.css'

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