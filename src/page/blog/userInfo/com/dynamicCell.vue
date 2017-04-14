<template>
    <div class="articleCellClass">
        <div class="articleCellUserInfo">
            <img :src="dynamicInfo.user_image_url" alt="">
            <span>{{dynamicInfo.user_name}}</span>
            <span>{{createTile}}</span>
        </div>
        
    </div>
</template>
<script>
 export default {
    data() {
        return{
           
        }
    },
    props:{  
         dynamicInfo:{
             type:Object
         }
    },
    methods:{
        
    },
    computed:{
        createTile(){
            return formatTime(new Date(this.dynamicInfo.dynamic_oper_time))
        }
    }
}
</script>
<style>
.articleContent{
    display: flex;
}
.articleContent img{
    width: 200px;
    height: 200px;
}
</style>