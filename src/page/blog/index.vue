<template>
  <div class="mainBgDivClass">
      <div class="main-body">
           <div class="container">
            <div class="row"> 
                <div class="headMenu">
                   <div class="rightMenu">
                       <el-input  class="searchInput" placeholder="搜索" icon="search" :on-icon-click="handleIconClick"> </el-input>
                        <div   class="rightMenuLogin" v-show="!isLogin" >
                            <span @click="login" >登录</span>
                            <span @click="register">注册</span>
                        </div>
                        <div class="userInfoDiv" v-show="isLogin">
                          <el-dropdown trigger="click" @command="handleCommand">
                            <span class="userInfoSpan el-dropdown-link" >
                                <img  :src="userInfo.user_image_url">
                                {{userInfo.user_real_name}}
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="backPage">切换后台</el-dropdown-item>
                                <el-dropdown-item command="loginout">退出</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                        </div>
                   </div>
                </div>              
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
      <login v-show = "showLogin" @loginAction="loginAction"></login>
  </div>
</template>

<script>
import {indexArticle,getUserInfo} from '../../store/service'
import login from './com/login.vue'
  export default {
    data() {
      return {
            top:'',
            articles:[],
            userInfo:{},
            showLogin:false,
            isLogin:false,
      }
    },
    mounted(){
        let self= this
        if(getStore('userInfo')){
            console.log('logined')
            this.isLogin = true
            this.userInfo = getStore('userInfo')
        }

        indexArticle().then(res=>{
            if(res.code == 0){
                this.top = res.data.top
                this.articles = res.data.artilces
            }
            else{
                toast(self,err.ChineseMsg)
            }
        }).catch(err=>{
            toast(self,err.ChineseMsg)
        })
    },
    components:{
        login
    },
    methods:{
        login(){
      
            this.showLogin = true
        },
        handleIconClick(){

        },
        register(){

        },
        loginAction(action){
            this.showLogin = false
            if(action == 'login'){
                this.isLogin = true;
                this.getUserInfo()
            }
            else if(action == 'register'){
                this.register()
            }   
            else if(action == 'forgivePassword'){
                // do this feature later
            }
        },
        handleCommand(command) {
            if(command == 'loginout'){
                removeStore('userInfo')
                removeStore('token')
                this.isLogin = false;
            }
            else if(command == 'backPage'){
                this.$router.replace('/manage')
            }
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
               toast(this,res.ChineseMsg)
           }
        }
 
   }

  }

</script>
<style >
  .mainBgDivClass{
      background: #161E2C;
      width: 100%;
      height: 100%;
  }
  .main-body{

     width: 100%;
      background: url(/static/img/page-bg.jpg) no-repeat top center;
      background-size: 100% auto;
      background-attachment: fixed;
  }
  .container{
     padding-left: 15px;
     padding-right: 15px;
     margin-left: auto;
     margin-right: auto;
  }
  .row{
    margin-left: -15px;
    margin-right: -15px;
  }
  .headMenu{
      color: white;
      width: 100%;
      font-size: 20px;
      margin-top: 40px;
  }
.searchInput{
    width: 200px;
    display: inline-block;
}
  .rightMenu{
      float: right;
      width: 360px;
      display: flex;
      justify-content: space-around
  }
  
  
.rightMenuLogin span{
    margin-left: 10px;
    cursor: pointer;
}
.userInfoDiv span{
   color: white
}
.userInfoSpan img{
    width: 35px;
    height: 35px;
    border-radius: 15px;
    margin-right: 10px;
}
.el-dropdown-menu__item{
        text-align: center;
        font-size: 16px;
    }
.main-page{
    position: relative;
    margin-top: 40px;
}
.main-navigation{
    padding: 0px;
    width: 310px;
    position: absolute;
    top:0;
    left: 0;
}
.main-menu{
    float: left;
    width: 100%;
}
.menu-container{
    overflow: auto;
    margin-bottom: 10px;
    padding-left: 0
}
.home{
    background-color: rgba(16, 165, 105, 0.8);
    background-image: url('/static/img/menu-bg-home.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
}
  .block-keep-ratio {	position: relative; }
	
.block-keep-ratio__content {
    position: absolute;
    top: 0; bottom: 0; right: 0; left: 0;
}
.block-keep-ratio:after {
	display: block;
	content: '';
}
.block-keep-ratio-2-1:after{  padding-top: 50%;}
.block-keep-ratio-1-1:after {	padding-top: 100%; }
.main-menu-link{
    color: #fff;
    display: block;
    font-weight: 300;
    font-size: 15px;
}
.main-menu-link-text{
    margin-bottom: 0;
	position: absolute;
	left: 20px;
	bottom: 15px;
}
.about-main { padding-left: 0; }
.about { background-color: rgba(193,61,18,0.8);	}
.contact { background-color: rgba(107,181,34,0.8);	}
.block-width-full {	width: 100%; }
.block-width-half { width: 150px; }
.block-width-third { width: 100px;  }
.flexbox-center{
    display: -webkit-box;
	display: -webkit-flex;
	display: -ms-flexbox;
	display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    -webkit-flex-direction: column;
        -ms-flex-direction: column;
            flex-direction: column;
    -webkit-box-pack: center;
    -webkit-justify-content: center;
        -ms-flex-pack: center;
            justify-content: center;
    text-align: center;
}
.main-menu-link:hover {	color: #66FFFF; text-decoration: none }
.main-menu-link:focus {	color: #fff; }
.about i, .contact i {
	float: left;
	width: 100%;
	text-align: center;
	margin-bottom: 10px;
}


.gallery {
	background-image: url(/static/img/menu-bg-gallery.png);
	background-repeat: no-repeat;
	background-size: 100% 100%;
}


.content-main {
	padding-left: 340px;
	width: 100%;
	box-sizing: border-box;
	float: none;
}
.banner-main-home {
	background-color: white;
	background-image: url(/static/img/banner-bg-home.jpg);
	background-repeat: no-repeat;
	background-size: cover;
	background-position: bottom right;
	border-top: 7px solid #10a5cd;
	min-height: 320px;	
	overflow-y: auto;
}
.banner-main-home,
.banner-main-about {
	padding: 70px 30px 60px 50px;
}
.banner-main-home img {
	float: right;
	margin: 45px 0px;
	height: auto;
}
.margin-b-30 { margin-bottom: 30px; }
.img-responsive{
    width: 293px;
    height: 200px;
}
.banner-main-home-text,
.banner-main-about-text {
	position: relative;
	float: left;
	width: 55%;
	color: #000;
	text-align: left;
	right: 0;
	top: 0px; 
	left: 0;
	text-shadow: none;
}
.heading, .heading2 {
	float: left;
	width: 100%;
	margin: 10px 0px;
}
.heading { border-left: 4px solid #10a5cd; }
.heading2 {	border-left: 4px solid #a92446; }
.heading h1, .heading2 h1 {
	margin: 0 10px;
	font-weight: 600;
	font-size: 72px;
}
.heading p, .heading2 p {
	margin: 0 10px;
	font-size: 24px;
	font-weight: 600;
}
.heading p { color: #10a5cd; }
.heading2 p { color: #a92446; }
.desc, .desc2 {
	float: left;
	width: 100%;
	padding-left: 15px;
}
.desc p {
	line-height: 1.8;
	margin-top: 25px;
	margin-bottom: 30px;
    font-size: 14px;
}
.desc button, .desc2 button {
	background-color: #363636;
	color: #fff;
	font-weight: bold;
	border: none;
	padding: 10px 30px;
    font-size: 14px;
}
.desc button {
	background-color: #363636;
	-webkit-transition: all 0.3s ease;
	transition: all 0.3s ease;
}
.desc button:hover, .desc button:focus { background-color: #777; }
.desc2 button {
	background-color: #a92446;
	-webkit-transition: all 0.3s ease;
	transition: all 0.3s ease;
}
.desc2 button:hover, .desc2 button:focus { background-color: #DD426A; }
.desc2 ul {
	padding: 10px 15px 30px;
	line-height: 2;
	text-transform: uppercase;
}
.box {
	float: left;
	box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
	display: block;
	background-color: #fff;
    font-size: 14px;
    border-top: 7px solid #19beb6;
}
.box img { width: 100%;	}

.box-icon {
	width: 100%;
	position: relative;
}
.box-separate{
    margin-bottom: 20px;
    margin-top: 20px;
}
.float-container { overflow: auto; }

.info {
	width: 100%;
	padding: 15px 30px 20px;
}
.info p{
    margin-bottom: 0px;
}
.article-title{
    padding: 0 0 0 5px;
	border-left: 2px solid #19beb6;
	margin: 25px 0px;
}
.article-title h5{ 
    font-size: 20px;
}
@media (min-width: 1230px) {
	.container { width: 1200px;	}
}

@media (max-width:991px) {

	.main-body { background-size: auto; }

	.box {	margin-bottom: 30px; }

	.block-keep-ratio-md-2-1:after { padding-top: 50%; }

	.contact-page .main-navigation,
	.gallery-page .main-navigation,
	.main-navigation {
		float: none;
		position: static;
		overflow: auto;
    	margin: 0 auto 80px;   
    	padding-right: 0;
    	width: 310px;
    	max-width: 100%;
	}

	.content-main { padding-left: 0; }
	.content-main.gallery_main { padding: 30px; }

	.banner-main-home img {
		display: block;		
		float: none;
		margin: 50px auto;
		padding-top: 50px;
	}
	.banner-main-home-text { overflow-y: auto; }

	.banner-main-about img {
		float: none;
		margin: 0 auto;
		padding-top: 30px;
	}

	.bottom-img {
		width: 100%;
		margin-bottom: 10px;
	}
	
	.bottom-img p {
		width: 100%;
		position: relative;
	}

	.heading h1, .heading2 h1 {	font-size: 40px; }
	.heading p, .heading2 p { font-size: 14px; }
	
	.banner-main-home-text,
	.banner-main-about-text {
		width: auto;		
	}

	.box.paris { margin-bottom: 0; }
	.bottom-main { margin-bottom: 0; }
	
	.aenean { top: 7px;	}

	.about_proin { padding: 0;	}
	.about-last-container {
		-webkit-box-orient: vertical;
		-webkit-box-direction: normal;
		-webkit-flex-direction: column;
		    -ms-flex-direction: column;
		        flex-direction: column;
	}
	
	.info-nav-container,
	.info-description-container {
		float: none;
		width: 100%;
	}
	.info-nav-container {
		margin-right: 0;
		margin-bottom: 30px;
	}	
}

</style>