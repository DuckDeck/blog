<template>
  <div class="mainBgDivClass">
      <div class="main-body">
           <div class="container">
            <div class="row">               
                <div class="main-page">
                    <aside class="main-navigation">
                        <div class="main-menu">
                            <div class="menu-container">
                                <div class="block-keep-ratio block-keep-ratio-2-1 block-width-full home">                                    
                                    <a href="index.html" class="block-keep-ratio__content  main-menu-link">
                                        <span class="main-menu-link-text">
                                            HOME    
                                        </span>                                        
                                    </a> 
                                </div>                    
                            </div>

                            <div class="menu-container">                                
                                <div class="block-keep-ratio  block-keep-ratio-1-1  block-width-half  pull-left  about-main">                                    
                                    <a href="about.html" class="main-menu-link about block-keep-ratio__content flexbox-center">
                                        <i class="fa fa-user fa-4x main-menu-link-icon"></i>
                                        ABOUT
                                    </a>                                    
                                </div>

                                <div class="block-keep-ratio  block-keep-ratio-1-1  block-width-half  pull-right  contact-main">
                                    <a href="contact.html" class="main-menu-link contact block-keep-ratio__content flexbox-center">
                                        <i class="fa fa-envelope-o fa-4x main-menu-link-icon"></i>
                                        CONTACT
                                    </a>                                
                                </div>    
                            </div>  

                            <div class="menu-container">
                               <div class="block-keep-ratio  block-keep-ratio-1-1  block-width-third  pull-left  about-main" style="margin-right: 5.5px;">                                    
                                    <a href="about.html" class="main-menu-link about block-keep-ratio__content flexbox-center">
                                        <i class="fa fa-user fa-4x main-menu-link-icon"></i>
                                        ABOUT
                                    </a>                                    
                                </div>
                                <div class="block-keep-ratio  block-keep-ratio-1-1  block-width-third  pull-left  about-main" >                                    
                                    <a href="about.html" class="main-menu-link about block-keep-ratio__content flexbox-center">
                                        <i class="fa fa-user fa-4x main-menu-link-icon"></i>
                                        ABOUT
                                    </a>                                    
                                </div>
                                <div class="block-keep-ratio  block-keep-ratio-1-1  block-width-third  pull-right  contact-main">
                                    <a href="contact.html" class="main-menu-link contact block-keep-ratio__content flexbox-center">
                                        <i class="fa fa-envelope-o fa-4x main-menu-link-icon"></i>
                                        CONTACT
                                    </a>                                
                                </div>                             
                            </div>

                            <div class="menu-container">
                                <div class="block-keep-ratio block-keep-ratio-1-1  block-width-full gallery">                                    
                                    <a href="gallery.html" class="main-menu-link  block-keep-ratio__content">
                                        <span class="main-menu-link-text">
                                            GALLERY    
                                        </span>                                            
                                    </a>                                    
                                </div>                                
                            </div>

                        </div>
                    </aside>



                    <div class="content-main">
                        <div class="row margin-b-30">
                            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <div class="banner-main-home">                                
                                    <div class="banner-main-home-text">
                                        <div class="heading">
                                            <h1>{{top.article_name}}</h1>
                                        </div>
                                        <div class="desc">
                                            <p>{{top.article_brief}}</p>
                                            <button type="button" style="cursor: pointer">查看详情</button>
                                        </div>
                                    </div>
                                    <img :src="top.article_main_img" alt="Image" class="img-responsive">
                                </div>                        
                            </div>    
                        </div>



                        <div class="row margin-b-30">
                            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6" v-for='art in articles'>
                                <div class="box">
                                    <div class="box-icon">
                                        <img :src="art.article_main_img" alt="Image" class="img-responsive">
                                    </div>
                                    <div class="info float-container">
                                        <div class="col-sm-12 article-title">
                                            <h5 class="text-uppercase">{{art.article_name}}</h5>
                                        </div>
                                        <p> {{art.article_brief}}</p>
                                        <hr class="box-separate" />
                                        <div class="col-sm-12 location-main"> 
                                            <div class="pull-right user-icons">
                                                <a href="#"><i class="fa fa-star fa-2x"></i></a>
                                                <a href="#"><i class="fa fa-user fa-2x"></i></a>
                                                <a href="#"><i class="fa fa-twitter fa-2x"></i></a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                
                        </div>  

                       
                    </div>
                </div> 
            </div>          
      
        </div> 
      </div>
  </div>
</template>

<script>
import {articleById} from '../../store/service'
  export default {
    data() {
      return {
            article:{},
      }
    },
    async mounted(){
        let id = this.$route.params.id
        let res = articleById(id)
        if(res.code == 0){
            this.article = res.data
        }
        else{
            toas(this,res.ChineseMsg)
        }
    },


  }
</script>
<style >


</style>