const APIError = require('../rest').APIError;
const Comment = require('../model/comment')
const Result = require('../model/result.js')
const Tool = require('../tool/tool')

module.exports = {
    'POST /api/comment/:userId/:token': async (ctx, next) => {
        let tokenResult = await Tool.checkToken(ctx)
        if(tokenResult.code != 0){
            ctx.rest(tokenResult)
            return
        }
        var  id = ctx.params.userId,
            token = ctx.params.token,
            t = ctx.request.body;
        if(!t.commentContent || !t.commentContent.trim()) {
            ctx.rest(Result.create(10,{msg:'miss commentContent'})) 
            return
        }
        if(!t.commentTargetId || !t.commentTargetId.trim()) {
            ctx.rest(Result.create(10,{msg:'miss commentTargetId'})) 
            return
        }
        if(isNaN(t.commentTargetId)){
            ctx.rest(Result.create(9,{msg:'wrong commentTargetId format'})) 
            return
        }
        let com =new Comment(t.commentTargetId,id,t.commentContent)
        com.comment_time = new Date().getTime()
        let res = await Comment.insertMainComment(com)
        ctx.rest(res)
    },

    'POST /api/comment': async (ctx, next) => {
        var t = ctx.request.body;
        if(!t.commentContent || !t.commentContent.trim()) {
            ctx.rest(Result.create(10,{msg:'miss commentContent'})) 
            return
        }
        if(!t.commentTargetId || !t.commentTargetId.trim()) {
            ctx.rest(Result.create(10,{msg:'miss commentTargetId'})) 
            return
        }
        if(isNaN(t.commentTargetId)){
            ctx.rest(Result.create(9,{msg:'wrong commentTargetId format'})) 
            return
        }
        let com =new Comment(t.commentTargetId,0,t.commentContent)
        com.comment_time = new Date().getTime()
        let res = await Comment.insertMainComment(com)
        ctx.rest(res)
    },
}

