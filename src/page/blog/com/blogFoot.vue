<template>
    <div class="blogFoot">
        <span @click="aboutVue">关于ZOE Blog & 作者</span> 
    </div>
</template>
<script>
     export default {
        data: function(){
            return {}
        },
        methods:{
            aboutVue(){
                this.$router.push('/aboutVue')
            }
        }
    }
</script>
<style>
 .blogFoot{
     font-size: 18px;
     height: 50px;
     color: deepskyblue;
     margin: 20px 0px;

 }
  .blogFoot span:hover{
      cursor: pointer;
  }
</style>