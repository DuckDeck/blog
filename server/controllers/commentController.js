const APIError = require('../rest').APIError;
const Comment = require('../model/comment')
const Result = require('../model/result.js')
const Tool = require('../tool/tool')
const User = require('../model/user')
const Check = require('../tool/check')
const DB = require('../sqlhelp/mysql')
const Dynamic = require('../model/dynamic')
module.exports = {
    'GET /api/articleComment/:articleId/:index/:size': async (ctx, next) => {
        let paraCheckResult = Check.checkNum(ctx.params,'articleId')
        if(paraCheckResult){
            ctx.rest(paraCheckResult)
            return
        }
        let pageResult = Check.checkPage(ctx)
        if(pageResult){
            ctx.rest(paraCheckResult)
            return
        }
        let index = parseInt(ctx.params.index)
        let size = parseInt(ctx.params.size)
        let articleId = ctx.params.articleId
        
        //先查数量

        let sqlCount = "select count(comment_id) as count from user_comment where comment_type_id = 0 and delete_flag = 0 and comment_target_id = " + articleId
        let resCount = await DB.exec(sqlCount)
        if(resCount.code != 0){
            ctx.rest(resCount)
            return
        }
        if(resCount.data[0].count == 0){
            ctx.rest(Result.createCount(0,0,[]))
            return
        }
        let count = resCount.data[0].count
        let sqlMainComment = `select comment_id from user_comment where comment_target_id = ? and comment_type_id = 0  and delete_flag = 0 order by comment_time desc  limit ?,?`
        let resMainComment = await DB.exec(sqlMainComment,[articleId,index * size,size])
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
            ctx.rest(Result.createCount(0,count,resCom))
        }
        else{
             ctx.rest(resMainComment)
            return
        }
        

     },

    'GET /api/manage/articleslastcomment/:mId/:token/:index/:size': async (ctx, next) => {
        let tokenResult = await Check.checkManageToken(ctx)
        if(tokenResult.code != 0){
            ctx.rest(tokenResult)
            return
        }
        let pageResult = Check.checkPage(ctx)
        if(pageResult){
            ctx.rest(pageResult)
            return
        }
        let index = parseInt(ctx.params.index)
        let size = parseInt(ctx.params.size)
        let sql = `select article_id,article_name,article_create_time,article_release_time,article_ip,article_click,article_sort_id,
                    user_id,article_type_id,article_type,article_brief,article_main_img,article_up,article_recommend,article_status,
                    (select sort_article_name from article_sort where  article_sort.sort_article_id = article.article_sort_id) 
                    as article_sort_name ,(select user_name from user where user.user_id = article.user_id) as user_name, 
                    (select count(comment_id) from user_comment where user_comment.comment_target_id =
                    article.article_id) as comment_count from article limit ` + size * index + `,` + size
        let articleResult = await DB.exec(sql)
        if(articleResult.code != 0){
            ctx.rest(articleResult)
            return
        }
        let articles = articleResult.data
        if(articles.length == 0){
            ctx.rest(Result.create(0,[]))
            return
        }
        let article_ids = articles.map((s)=>{
            return s.article_id
        })
        if(article_ids==undefined){
            article_ids = [0]
        }
        let sqlLastComments = ` select comment_id,comment_target_user_id,comment_target_id,
                                comment_content,commenter_user_id,comment_time from user_comment where comment_id in 
                                (select max(comment_id) from user_comment group by comment_target_id) and comment_target_id in ` + `(` + article_ids.join(',') + `)`

        let resLastComments = await DB.exec(sqlLastComments)
        if(resLastComments.code != 0){
            ctx.rest(resLastComments)
            return
        }
        for(let s of articles){
            let mainCom = resLastComments.data.find(k=>{
                return k.comment_target_id == s.article_id
            })
            if(mainCom){
                s.newComment = mainCom
            }
            else{
                s.newComment = {}
            }
        }
        let sqlArticleCount = `select count(article_id) as articleCount from article`
        let actArticleCount = await DB.exec(sqlArticleCount)
        let result = Result.create(0,articles)
        result.count = actArticleCount.data[0].articleCount
        ctx.rest(result)

     },


    'POST /api/comment/:userId/:token': async (ctx, next) => {
        let tokenResult = await Check.checkToken(ctx)
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
            let dynamic = new Dynamic(id,res.data.id,com.comment_scope,7,0)
            await Dynamic.save(dynamic)
            ctx.rest(res)
        }
        else{
            let res = await Comment.insertMainComment(com)
            let dynamic = new Dynamic(id,res.data.id,com.comment_target_id,4,0)
            await Dynamic.save(dynamic)
            ctx.rest(res)
        }
        
     }, //不能让游客评论


     // 一般来说，评论有main评论和子评论，这里的评论统一获取main评论再加上这个main评论下面的所有子评论
    
    'GET /api/comment/:commentId': async (ctx, next) => {
      await getComment(ctx)
     },

  
    'GET /api/comment/:commentId/:userId/:token': async (ctx, next) => {
        let tokenResult = await Check.checkToken(ctx)
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
        ctx.rest(resMainCom)
        return
    }
    let resSubCom = await Comment.subCommentById(id)
    if(resSubCom.code!=0){
        ctx.rest(resSubCom)
        return
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

