<template>
    <div class="linkCell">
      
         <el-input class="myLinkInput" placeholder="http://个人网站" v-model="linkInfo.link_url" ></el-input>
         <el-input style="width: 30%;margin-left: 10px;"  placeholder="网站名称"  v-model="linkInfo.link_name"></el-input>
         <i class="fa fa-minus-circle deleteNewLink" @click="deleteLink" ></i>
    </div>
</template>
<script>
 export default {
    data() {
        return{
           
        }
    },
    props:{  
         linkInfo:{
             type:Object
         }
    },
    methods:{
        deleteLink(){
             this.$emit('deleteLink',this.linkInfo)
        },
       
    },
    computed:{
        

    }
}
</script>
<style>

.linkCell{
    max-width: 800px;
    display: block;
    margin-top: 10px;
}
.deleteNewLink{
    font-size: 16px;
    color: #20a0ff;
}
</style>