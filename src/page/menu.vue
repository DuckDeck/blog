<template>
  <div>
        <router-link class="menu" :to="{ name: 'collegeEventInfo', params: { id: 60 }}">活动</router-link>
        <router-link class="menu" :to="{ name: 'dynamicList'}">动态</router-link>
        <router-link class="menu" :to="{ name: 'applyVip'}">申请VIP</router-link>
        <router-link class="menu" :to="{ name: 'applySuccess'}">申请VIP成功</router-link>
        <router-link class="menu" :to="{ name: 'firmVipAuth'}">企业主认证</router-link>
        <router-link class="menu" :to="{ name: 'firmApplied'}">企业主认证申请成功</router-link>

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
.menu{
  display: block;
  margin-top: 0.2rem;
}
</style>