const APIError = require('../rest').APIError;
const Comment = require('../model/comment')
const Result = require('../model/result.js')
const Tool = require('../tool/tool')
const User = require('../model/user')
const Check = require('../tool/check')
const DB = require('../sqlhelp/mysql')
module.exports = {

    'GET /api/manage/articleComment/:articleId/:mId/:token': async (ctx, next) => {
        let tokenResult = await Check.checkManageToken(ctx)
        if(tokenResult.code != 0){
            ctx.rest(tokenResult)
            return
        }
        let paraCheckResult = Check.checkNum(ctx.params,'articleId')
        if(paraCheckResult){
            ctx.rest(paraCheckResult)
            return
        }
        let articleId = ctx.params.articleId
        let sqlMainComment = `select comment_id from user_comment where comment_target_id = ?`
        let resMainComment = await DB.exec(sqlMainComment,[articleId])
        if(resMainComment.code != 0){
            ctx.rest(resMainComment)
            return
        }
        if(resMainComment.data.length > 0){
            let actions = resMainComment.data.map(s=>{
                return getCommentById(s.comment_id)
            })
            let resCom = await Promise.all(actions)
            if(resCom.code != 0){
                ctx.rest(resCom)
            }
            let userIds = new Set()
            resCom.forEach(s=>{
                userIds.add(s.commenter_user_id)
                s.sub_comments.forEach(t=>{
                    userIds.add(t.commenter_user_id)
                    userIds.add(t.comment_target_user_id)
                })
            })
            let userInfos = await User.userInfoByIds(Array.from(userIds))
            let tra = {
                user_id:0,
                user_name:'游客',
                user_image_url:'http://localhost:3000/static/system/tra.png'
            }
            resCom.forEach(s=>{
                if(s.commenter_user_id == 0){
                    s.userInfo = tra
                }
                else{
                    s.userInfo = userInfos.data.find(n=>{
                        return n.user_id == s.commenter_user_id
                    })
                }
                s.sub_comments.forEach(t=>{
                    if(t.commenter_user_id == 0){
                        t.userInfo = tra
                    }
                    else{
                        t.userInfo = userInfos.data.find(n=>{
                            return n.user_id == t.commenter_user_id
                        })
                    }
                    
                    if(t.comment_target_user_id == 0){
                        t.targetUserInfo = tra
                    }
                    else{
                         t.targetUserInfo = userInfos.data.find(n=>{
                            return n.user_id == t.comment_target_user_id
                        })
                    }
                })
            })
            ctx.rest(Result.create(0,resCom))
        }
        else{
             ctx.rest(resMainComment)
            return
        }
        

    },


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
        if(t.commentTargetUserId){
            com.comment_target_userId = t.commentTargetUserId
            let type = Check.checkNum(t,'commentType')
            if(type){
                ctx.rest(type)
                return
            }
            com.comment_type = t.commentType
            let scope = Check.checkNum(t,'commentScope')
            if(scope){
                ctx.rest(scope)
                return
            }
            com.comment_scope = t.commentScope
            let res = await Comment.insertSubComment(com)
            ctx.rest(res)
        }
        else{
            let res = await Comment.insertMainComment(com)
            ctx.rest(res)
        }
        
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
        com.commenter_ip = ctx.request.ip
        com.comment_time = new Date().getTime()
        if(t.commentTargetUserId){
            com.comment_target_userId = t.commentTargetUserId
            let type = Check.checkNum(t,'commentType')
            if(type){
                ctx.rest(type)
                return
            }
            com.comment_type = t.commentType
            let scope = Check.checkNum(t,'commentScope')
            if(scope){
                ctx.rest(scope)
                return
            }
            com.comment_scope = t.commentScope
            let res = await Comment.insertSubComment(com)
            ctx.rest(res)
        }
        else{
            let res = await Comment.insertMainComment(com)
            ctx.rest(res)
        }
    },

   'GET /api/comment/:commentId': async (ctx, next) => {
      await getComment(ctx)
    },

  
   'GET /api/comment/:commentId/:userId/:token': async (ctx, next) => {
        let tokenResult = await Tool.checkToken(ctx)
        if(tokenResult.code != 0){
            ctx.rest(tokenResult)
            return
        }
        await getComment(ctx) 
    },
    

}


async function getComment(ctx){
    var  id = ctx.params.commentId
    let resMainCom = await Comment.commentById(id)
    if(resMainCom.code!=0){
        ctx(resMainCom)
    }
    let resSubCom = await Comment.subCommentById(id)
    if(resSubCom.code!=0){
        ctx(resSubCom)
    }
    let mainCom = resMainCom.data[0]
    let subCom = resSubCom.data
    let ids = new Set()
    
    ids.add(mainCom.commenter_user_id)
    
    for(let com of subCom){
        ids.add(com.commenter_user_id)
        ids.add(com.comment_target_user_id)
    }
    ids.delete(0)
    //获取所有评论者有信息
    let userInfos = await User.userInfoByIds(Array.from(ids))
    if(userInfos.code != 0){
        ctx.rest(userInfos)
        return
    }
    //hk暂时不需要加上几楼功能
    //赞功能也不加上
    let tra = {
        user_id:0,
        user_name:'游客',
        user_image_url:'http://localhost:3000/static/system/tra.png'
    }
    
    mainCom.sub_comments = []
    if(mainCom.commenter_user_id == 0){
        mainCom.userInfo = tra
    }
    else{
        mainCom.userInfo = userInfos.data.find(s=>{
            return s.user_id == mainCom.commenter_user_id
        })
    }
    for(let n of subCom){
        if(n.comment_target_id == mainCom.comment_id){
            if(n.commenter_user_id == 0){
                n.userInfo = tra
            }
            else{
                n.userInfo = userInfos.data.find(s=>{
                   return s.user_id == n.commenter_user_id
                })
            }
            if(n.comment_target_user_id == 0){
                n.targetUserInfo = tra
            }
            else{
                n.targetUserInfo = userInfos.data.find(s=>{
                return s.user_id == n.comment_target_user_id
                })
            }
            
            mainCom.sub_comments.push(n)
        }
    }

    ctx.rest(Result.create(0,mainCom))
}


async function getCommentById(id){
    let resMainCom = await Comment.commentById(id)
    if(resMainCom.code!=0){
        return resMainCom
    }
    let resSubCom = await Comment.subCommentById(id)
    if(resSubCom.code!=0){
        return resSubCom
    }
    let mainCom = resMainCom.data[0]
    let subCom = resSubCom.data
    mainCom.sub_comments = []
    for(let n of subCom){
        if(n.comment_scope == mainCom.comment_id){
            mainCom.sub_comments.push(n)
        }
    }
    return mainCom
}

