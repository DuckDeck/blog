<template>
      <div style="text-align: center" class="container" >
          <div class="main-page">
            <div class="collectTitle"> 
                <i class="fa fa-bookmark" aria-hidden="true"></i>
                收藏的文章</div>

          </div>

      </div>
</template>

<script>

    export default {
        data(){
            return {
                isValidating:true,
                displayMessage:'',
                dialogVisible:false,
                userId:0,
                validateResultMsg:''
            }
        },
        
        methods:{
            
        }

    }
</script>

<style scoped>
.collectTitle{
    background-color: orangered;
    width: 10rem;
    margin: 0 auto;
    margin-top: 1.5rem;
    color: azure;
    font-size: 0.5rem;
    padding-bottom: 0.3rem;
    padding-top: 0.3rem;
}

</style>
