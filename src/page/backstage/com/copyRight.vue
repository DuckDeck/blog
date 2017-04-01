<template>
    <div class="copyRight">
        {{year}} © <a>Zoe</a>
    </div>
</template>
<script>
     export default {
        data() {
            return{}
        },
        props:{
            
        },
        computed:{
          year(){
              return formatTime(new Date(),'yyyy')
          }
        }
      
    }
</script>
<style>
.copyRight{
    font-size: 18px;
    padding-left: 20px;
    /*background: #eee;*/
    color: white;
}
</style>