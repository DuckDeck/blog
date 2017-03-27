<template>


           <div class="container">
            <div class="row"> 
                <blogHeader  :userInfo = "userInfo"  @headAction="headAction"></blogHeader>
                <div class="main-page">
                   

                    <blogSide ></blogSide>

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
                                            <button type="button" style="cursor: pointer" @click="checkArticle(top)" >查看详情</button>
                                        </div>
                                    </div>
                                    <img :src="top.article_main_img" alt="Image" class="img-responsive">
                                </div>                        
                            </div>    
                        </div>



                        <div class="row margin-b-30" >
                            <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6" v-for='art in articles' @click="checkArticle(art)">
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
                                               
                                                <a href="#"><i class="fa fa-eye fa-1.2x"></i>{{art.article_click}}</a>
                                                <a href="#"><i class="fa fa-comment fa-1.2x"></i>{{art.comment_count}}</a>
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
import {indexArticle,getUserInfo} from '../../store/service'
import blogHeader from './com/blogHead.vue'
import blogSide from './com/blogSide.vue'
  export default {
    data() {
      return {
            top:'',
            articles:[],
            userInfo:{},

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
        blogHeader,blogSide
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
        },
        checkArticle(article){
            this.$router.push('/article/'+article.article_id)
        }
 
   }

  }

</script>
<style >


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


.main-page{
    position: relative;
    margin-top: 40px;
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
	.box {	margin-bottom: 30px; }

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