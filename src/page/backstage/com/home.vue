<template>
    <div class="wrapper">
        <v-head></v-head>
        <v-sidebar></v-sidebar>
        <div class="content">
            <transition name="move" mode="out-in"><router-view></router-view></transition>
        </div>
    </div>
</template>

<script>
    import vHead from './header.vue';
    import vSidebar from './sidebar.vue';
    import {getUserInfo} from '../../../store/service'
    export default {
        components:{
            vHead, vSidebar
        },
        mounted(){
            if(getStore('userInfo')){

            }
            else{
                 getUserInfo().then(function(data){
                    if(data.code == 0){
                        setStore('userInfo',data.data)
                    }
                },function(err){
                    console.log(err)
                })
            }
          
        }
    }
</script>
<style>
    .content{
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
