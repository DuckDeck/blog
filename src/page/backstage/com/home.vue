<template>
    <div class="wrapper">
        <v-head :username="userInfo.user_name" :userImage="userInfo.user_image_url"></v-head>
        <v-sidebar ></v-sidebar>
        <div class="backStagecontent">
            <transition name="move" mode="out-in"><router-view></router-view></transition>
        </div>
    </div>
</template>

<script>
    import vHead from './header.vue';
    import vSidebar from './sidebar.vue';
    import {getUserInfo} from '../../../store/service'
    export default {
        data(){
            return{
                userInfo:{}
            }
        },
        components:{
            vHead, vSidebar
        },
        mounted(){
            if(getStore('userInfo')){
                this.userInfo = getStore('userInfo')
            }
            else{
                let self = this
                 getUserInfo().then(function(data){
                    if(data.code == 0){
                        self.userInfo = data.data
                        setStore('userInfo',data.data)
                    }
                    else{
                        toast(self,data.ChineseMsg)
                    }
                },function(err){
                   toast(self,err.ChineseMsg)
                })
            }
          
        }
    }
</script>
<style>
    .backStagecontent{
    background: none repeat scroll 0 0 #fff;
    position: absolute;
    left: 250px;
    right: 0;
    top: 70px;
    bottom:0;
    width: auto;
    padding:40px;
    box-sizing: border-box;
    overflow-y: scroll;
}

.move-enter-active,.move-leave-active{
    transition: opacity .5s;
}
.move-enter,.move-leave{
    opacity: 0;
}
</style>
