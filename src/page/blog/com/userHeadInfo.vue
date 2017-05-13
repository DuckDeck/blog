<template>
       <div class="userHeadInfo">
            <img :src="userInfo.user_image_url" @click="userheadClick" class="userHeader" alt="">
            <div class="userHeadDetail">
                <div >
                    <span style="font-weight: bold">{{userInfo.user_real_name}}</span> 
                    <i class="fa fa-venus userGender" v-show="userInfo.user_gender == '男'" aria-hidden="true"></i>
                    <i  class="fa fa-mars userGender" v-show="userInfo.user_gender != '男'" aria-hidden="true"></i>
                </div>
            <div>
                <span>文章:{{userInfo.article_count}}</span>
                <span>评论:{{userInfo.comment_count}}</span>
            </div>
            </div>
        
        </div>
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
            userheadClick(){

                this.$emit("userHeadClick",this.userInfo)
            }
        }
    }
</script>
<style scoped>
.userHeadInfo{
 display: flex;
 font-size: 16px;
}
.userHeader{
 width: 50px;
 height: 50px;
 margin-right: 15px;
 border-radius: 25px;
}
</style>