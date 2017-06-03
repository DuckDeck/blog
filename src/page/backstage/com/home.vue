<template>
    <div class="wrapper">
        <v-head :username="userInfo.m_username" :userImage="userInfo.m_head"></v-head>
        <v-sidebar ></v-sidebar>
        <div class="backStagecontent">
            <transition name="move" mode="out-in"><router-view></router-view></transition>
        </div>
    </div>
</template>

<script>
    import vHead from './header.vue';
    import vSidebar from './sidebar.vue';
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
            if(!getStore('m_token')){
                this.$router.replace('/managelogin')
                return
            }
            let info = getStore('m_token')
            this.userInfo = info
        }
    }
</script>
<style>
    .backStagecontent{
    background: none repeat scroll 0 0 #f4f4f4;
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
