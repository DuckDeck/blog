<template>
    <div class="commentArticle">
        <el-input type="textarea"
        :rows="2"
        placeholder="写下你的评论..."
        v-model="comment">
        </el-input>
        <el-button class="buttonSubmitArticle" type="primary" @click="submitComment">提交</el-button>
        <div style="clear: both"></div>
    </div>
</template>
<script>
    export default {
    data() {
        return{
            comment:''
        }
    },
    props:{
        // comment:{
        //     type:String,
        //     default:''
        // }
    },
    methods:{
        submitComment(){
            this.$emit('submitComment',this.comment)
        }
    }

}
</script>
<style >
 .commentArticle{
    font-size: 20px;
    padding: 0px 20px;
    padding-bottom: 20px;
}
.buttonSubmitArticle{
    margin-top: 10px;
    float: right;
}
</style>
