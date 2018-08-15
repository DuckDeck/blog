
<template>
    <div class="likeBorder" @click="setLike(!isLike)">
       <i class="fa fa-heart-o likeheart"></i>
       <span style="margin-left:-3px;">喜欢</span>
       <span class="sepspan"></span>
       <span>{{likeCount}}</span>
    </div>
</template>

<script>
    export default {
        data() {
            return{
              
            }
        },
        props:{  
          isLike:{
            type:Boolean
          },
          likeCount:{
              type:Number
          }
        },
        methods:{
           setLike(isLike){
               $.emit("setLike",isLike);
           }
        },
        computed:{
           
        }
    }
</script>
<style scoped>
.likeBorder{
    border: 1px orangered solid;
    width: 130px;
    height: 40px;
    border-radius:25px;
    font-size: 16px;;
    display: flex;
    justify-content:space-evenly;
    color: orangered;
    cursor: pointer;
}
.likeheart{
    
    align-self:center;
}
.likeBorder span{
    align-self:center;
}
.sepspan{
    width: 1px;
    background-color: orangered;
    height: 22px;
}
</style>
