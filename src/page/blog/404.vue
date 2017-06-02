<template>
     <div class="container">   
        <div class="notFoundDiv">
            <img @click="clickToMainPage" src="../../../static/img/404.jpg" alt="">
        </div>
     </div> 
</template>

<script>


//todo comment sort feature
  export default {
    data() {
      return {
      }
    },
    async mounted(){
       
    },
    methods:{
        clickToMainPage(){
            this.$router.replace("/")
        }
    },
    
  }
</script>
<style >

.notFoundDiv{
    margin-top: 200px;
    text-align: center;
}

.notFoundDiv img:hover{
    cursor: pointer;
}
</style>