
<template>
    <div v-bind:class="[isLike?'likedBorder':'likeBorder']"  @click='setLike'>
       <i  v-bind:class="[isLike?'fa-heart':'fa-heart-o','fa','likeheart']"></i>
       <span style="margin-left:-3px;align-self:center;">喜欢</span>
       <span v-bind:class="[isLike?'sepspanLiked':'sepspan']"></span>
       <span style="align-self:center;">{{likeCount}}</span>
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
           setLike(){
               this.$emit("setLike",this.isLike);
           }
        },
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
.likedBorder{
    border: 1px orangered solid;
    width: 130px;
    height: 40px;
    border-radius:25px;
    font-size: 16px;;
    display: flex;
    justify-content:space-evenly;
    color: white;
    cursor: pointer;
    background-color: orangered;
}
.likeBorder:hover{
    background-color: #EE999999;
}
.likeheart{
    
    align-self:center;
}

.sepspan{
    width: 1px;
    background-color: orangered;
    height: 22px;
    align-self:center;
}
.sepspanLiked{
    width: 1px;
    background-color: white;
    height: 22px;
    align-self:center;
}
</style>
