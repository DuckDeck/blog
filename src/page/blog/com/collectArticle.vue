
<template>
    <div v-bind:class="[isCollect?'likedBorder':'likeBorder']"  @click='setCollect'>
       <i  v-bind:class="[isCollect?'fa-star':'fa-star-o','fa','likeheart']"></i>
       <span v-bind:class="[isCollect?'sepspanLiked':'sepspan']"></span>
       <span style="align-self:center;">{{collectCount}}</span>
    </div>
</template>

<script>
    export default {
        data() {
            return{
              
            }
        },
        props:{  
          isCollect:{
            type:Boolean
          },
          collectCount:{
              type:Number
          }
        },
        methods:{
           setCollect(){
               this.$emit("setCollect",!this.isCollect);
           }
        },
        computed:{
           
        }
    }
</script>
<style scoped>
.likeBorder{
    border: 1px orangered solid;
    width: 100px;
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
    width: 100px;
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
