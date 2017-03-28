<template>
    <div class="commentArticle">
        <el-input type="textarea"
        :rows="2"
        :placeholder=placeHolder
        v-model="comment">
        </el-input>
        
        <el-button class="buttonSubmitArticle" type="primary" @click="submitComment">提交</el-button>
        <el-button class="buttoncancelComment" v-show="needCancel" @click="cancel">取消</el-button>
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
        needCancel:{
            type:Boolean,
            default:false
        },
        placeHolder:{
            type:String,
            default:'写下你的评论...'
        }
    },
    methods:{
        submitComment(){
            this.$emit('submitComment',this.comment)
        },
        cancel(){
            this.$emit('cancelComment')
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
.buttoncancelComment{
   margin-top: 10px;
    float: right;
    margin-right: 10px;
}
</style>
