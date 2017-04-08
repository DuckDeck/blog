<template>
  <div class="container">      
       <blogHeader  :userInfo = "userInfo"  @headAction="headAction"></blogHeader>
       <blogLogo ></blogLogo>
       <blogMenu></blogMenu>
  </div>
</template>

<script>
import {getUserInfo} from '../../store/service'
import {index} from '../../store/index'
import blogHeader from './com/blogHead.vue'
import blogLogo from './com/blogLogo.vue'
import blogMenu from './com/blogMenu.vue'
  export default {
    data() {
      return {
            top:[],
            articles:[],
            userInfo:{},
            swiperOption: {
                pagination: '.swiper-pagination',
                slidesPerView: 1,
                paginationClickable: true,
                spaceBetween: 30,
                mousewheelControl: true
            },
      }
    },
    mounted(){
        let self= this
        if(getStore('userInfo')){
            console.log('logined')
            this.isLogin = true
            this.userInfo = getStore('userInfo')
        }
        else{
            if(getStore('token')){ //this mean login is-success
                this.getUserInfo()
            }
        }
        index().then(res=>{
            if(res.code == 0){
                self.top = res.data.top
                self.articles = res.data.articles
            }
            else{
                toast(self,res.cMsg)
            }
        }).catch(err=>{
            toast(self,err.cMsg)
        })
        
    },
    components:{
        blogHeader,blogLogo,blogMenu
    },
    methods:{
        headAction(action){
            if(action == 'login'){
                this.$router.push('/login')
            }
            else if(action == 'logout'){
                this.userInfo =  {}
            }
        },
        
        checkMore(){
            this.$router.push('/articleList')
        },
        async getUserInfo(){
           let res = await getUserInfo()
           if(res.code == 0){
               this.isLogin = true
               setStore('userInfo',res.data)
               this.userInfo = res.data
               console.log(res.data)
           }
           else{
               toast(this,res.cMsg)
           }
        },
        checkArticle(article){
            this.$router.push('/article/'+article.article_id)
        }
 
   }

  }

</script>
<style >

</style>