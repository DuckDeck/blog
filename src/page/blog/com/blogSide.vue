
<template>

       
        <aside class="main-navigation">
            <div class="main-menu">
                <div class="menu-container">
                    <div class="block-keep-ratio block-keep-ratio-2-1 block-width-full home">                                    
                        <a href="#/" class="block-keep-ratio__content  main-menu-link">
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

</template>

<script>
    export default {
        data() {
            return{
              
            }
        },
        props:{  
          userInfo:{
              type:Object
          }
        },
        methods:{
           
        
      },
      computed:{
          
      }
    }
</script>
<style scoped>
 
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
@media (max-width:991px) {

	



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



	

	
}


</style>
