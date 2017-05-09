<template>
     <div class="container">   
         <blogLogo></blogLogo>
        <div class="aboutBlogContent">
            <div class="aboutBlog">
                <div class="aboutBlogTitle">
                    关于Zoe Blog
                </div>
                <div class="aboutBlogintro">
                    <p>Zoe Blog是一个由Vue和Node.js实现的一个开源Blog网站</p>
                
                </div>
            </div>
            <div class="aboutAuthor">
                
            </div>
            <div class="contactAuthor">
                
            </div>
        </div>   
        
     </div> 
</template>

<script>
import blogLogo from './com/blogLogo.vue'

//todo comment sort feature
  export default {
    data() {
      return {
          article:{},
          articleUserInfo:{}
      }
    },
    async mounted(){
       
    },
    methods:{

    },
    components:{
        blogLogo
    },
    computed:{    
    }
  }
</script>
<style >
.aboutBlogContent{
    background: white;
}
.aboutBlog{
    font-size: 20px;
}
.aboutBlogTitle{
    border-left: 5px solid mediumvioletred;
    height: 50px;
    color: #111;
    font-size: 25px;
    line-height: 50px;
    padding-left: 20px;
}

</style>