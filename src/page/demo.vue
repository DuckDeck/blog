<template>
  <div>
   <swiper v-model="index" class="productItem" :show-dots="false" >
        <!--<swiper-item :key="0" v-for="s in demoData">
            {{s}}
        </swiper-item>-->
        
         <swiper-item >
           我想这是一个Bug，当swiper在组件 里时，transform: translate3d(0px, 0px, 0px); 就全是9 ，这个确实是个很大的问题
        </swiper-item>
        <swiper-item >
           <div style="border:4px solid blue;">
            <img style="width: 6rem;" src="http://img1.gamersky.com/image2017/02/20170222_djy_248_3/gamersky_001origin_001_20172221414916.jpg" />
            <span class="imgBadge">5</span>
          </div>
          <div style="border:4px solid red;">
            
            我是一个绝对定位的absolute元素
            <img style="position: absolute;width: 5rem; left: 1rem;right: 1rem;top:1rem;bottom: 2rem;" 
            src="http://img1.gamersky.com/image2017/02/20170222_djy_248_3/gamersky_004origin_007_20172221414BD8.jpg" />
          </div>
        </swiper-item>
        <swiper-item >
           3
        </swiper-item>
        <swiper-item >
           4
        </swiper-item>
   </swiper>
  </div>
</template>

<script>
 import { Tab, TabItem,Swiper, SwiperItem} from 'vux'
 import { Scroller } from 'vux'
 import { Checker, CheckerItem } from 'vux'
  export default {
    data() {
      return {
        imgs:[],
        index:0,
        demoData: [2, 3,2, 3,2, 3,2, 3]
      }
    },
    mounted(){
        for(var i = 0;i<6;i++){
          setTimeout((function(n) {
            console.log(n)
          })(i), 2000);
        }
    },
    components: {
        Scroller,Checker, CheckerItem,   Tab, TabItem,Swiper, SwiperItem
    }

  }
</script>
<style >
  .demo5-item{
    width: 100px;
  height: 26px;
  line-height: 26px;
  text-align: center;
  border-radius: 3px;
  border: 1px solid #ccc;
  background-color: #fff;
  margin-right: 6px;
  }
.demo5-item-selected {
  border-color: #ff4a00;
}
.imgBadge{
  background: red;
  width: 1rem;
  height: 1rem;
  border-radius: 0.5rem;
  position: absolute;
  text-align: center;
  color: white;
  margin: -0.5rem 0 0 -0.5rem;
 
}
</style>