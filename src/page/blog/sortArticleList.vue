<template>
  <div class="container">      
       <div class="blogSortsList">
           
       </div>
       <div class="blogSortArticleList">

           
       </div>
       <upToTop></upToTop>
       <blogFoot></blogFoot>
  </div>
</template>

<script>
import {getUserInfo} from '../../store/service'
import blogLogo from './com/blogLogo.vue'
import upToTop from './com/upToTop.vue'
import blogFoot from './com/blogFoot.vue'
  export default {
    data() {
      return {
            sorts:[],
            articles:[],
            userId:0,
            sortId:0           
      }
    },
    mounted(){
        if(this.$route.params.userId){
            this.userId = this.$route.params.userId
        }
        this.sortId = this.$route.params.sortId
    },
    components:{
        blogLogo,upToTop,blogFoot
    },
    methods:{
       
        checkMore(){
            this.$router.push('/articleList')
        },
        
        
    },
    computed:{
        loadMoreWord(){
           return  this.isCanLoadMore?'加载更多...':'已经全部加载完'
        }
    }
  }

</script>
<style >

</style>