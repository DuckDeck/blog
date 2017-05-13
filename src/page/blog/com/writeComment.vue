<template>
    <div class="commentArticle">
        <el-input v-show = "canComment"  class="LoginComment" type="textarea" :rows="5" :placeholder=placeHolder  v-model="comment"> </el-input>
        <div class="notLoginComment" v-show = "!canComment">
             <el-button  type="primary" @click="LoginToComment">登录</el-button> <span class="loginToComment">后发表评论</span>
        </div>
        <el-button  v-show = "canComment" class="buttonSubmitArticle" type="primary" @click="submitComment">提交</el-button>
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
    mounted(){
        this.$nextTick(function () {
            this.$on('clear', function () {
                console.log('监听成功')
            })
        })
    },
    methods:{
        clear(){
            this.comment = ''
        },
        submitComment(){
            if(this.comment.length == 0){
                toast(this,'评论内容不能为空')
                return
            }

            if(getStore('userInfo') == null){
                toast(this,'请先登录再评论')
                return
            }
            this.$emit('submitComment',this.comment)
        },
        cancel(){
            this.$emit('cancelComment')
        },
        LoginToComment(){
            this.$router.push('/login')
        }
    },
    computed:{
        canComment(){
           return getStore('userInfo') != null
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
.notLoginComment{
    background: #eee;
    text-align: center;
    padding:20px;
    border-radius: 5px;
}
.loginToComment{
    margin-left: 10px;
    font-size: 16px;
    color: #555;
}
</style>
