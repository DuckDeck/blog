const APIError = require('../rest').APIError;
const Article = require('../model/article')
const Tag = require('../model/tag')
const User = require('../model/user')
const Result = require('../model/result.js')
const Tool = require('../tool/tool')
const fs = require('fs')
const path = require('path')
let articles = [] //需要一个中间变量来保存，用promiss来传递参数很不方便，只有用中间变量来保存了 但是这样也明显不合理，现在要全部修改
//同时也要一个中间函数来桥接才行，这个是promise的坑
function handlePromiseResult(result){
    return new Promise((resolve,reject)=>{
        articles = result[1].data
        let article_ids = result[1].data.map((s)=>{
            return s.article_id
        })
        article_ids == undefined ?  reject(Result.create(0)) : resolve(article_ids)
    })

}
module.exports = {
    
    'GET /api/article/:userId/:token': async (ctx, next) => {
        let tokenResult = await Tool.checkToken(ctx)
        if(tokenResult.code != 0){
            ctx.rest(tokenResult)
            return
        }
        let id = ctx.params.userId
        let token = ctx.params.token
        let articleResult = await Article.articles(id)
        if(articleResult.code != 0){
            ctx.rest(articleResult)
            return
        }
        let articles = articleResult.data
        let article_ids = articles.map((s)=>{
            return s.article_id
        })
        if(article_ids==undefined){
            article_ids = [0]
        }
        let tagsResult = await Tag.articleTags(article_ids)
        tagsResult = tagsResult.filter((s)=>{
               return s.data.length > 0
        })
        let a = articles.map((s)=>{
            let t = tagsResult.find((k)=>{
                return k.data[0].article_id == s.article_id
            })
            s['tag'] =  t==undefined ? [] : t.data
            return s
        })
        
        ctx.rest(Result.create(0,a))
    },

    'GET /api/article/:articleId/:userId/:token': async (ctx, next) => {
        let tokenResult = await Tool.checkToken(ctx)
        if(tokenResult.code != 0){
            ctx.rest(tokenResult)
            return
        }
       let id = ctx.params.articleId
       let resArticle = await Article.articalById(id)
       if(resArticle.code != 0){
            ctx.rest(resArticle)
            return
       }
       let resTags =await Tag.articleTagByArticleId(id)
       if(resTags.code != 0){
            ctx.rest(resTags)
            return
       }
       let resMainCom = await Article.getArticleCommentById(id)
       if(resMainCom.code != 0){
           ctx.rest(resMainCom)
           return
       }
       let article = resArticle.data[0]
       article.tags = resTags.data
       let mainCom = resMainCom.data
       mainCom.sort((a,b)=>{
           if(a.comment_time == b.comment_time){
               return 0
           }
           if(a.comment_time < b.comment_time){
               return 1
           }
           else{
               return -1
           }
       })
       let subIds = mainCom.map(s=>{
           return s.comment_id
       })
       let resSubCom = await Article.getArticleSubCommentById(subIds)
       if(resSubCom.code != 0){
           ctx.rest(resSubCom)
           return
       }
       let subCom = resSubCom.data
       subCom.sort((a,b)=>{
           if(a.comment_time == b.comment_time){
               return 0
           }
           if(a.comment_time < b.comment_time){
               return 1
           }
           else{
               return -1
           }
       })


       //找出所有评论者的id
       let ids = new Set()
       for(let com of mainCom){
           ids.add(com.commenter_user_id)
       }
       for(let com of subCom){
           ids.add(com.commenter_user_id)
           ids.add(com.comment_target_user_id)
       }
       ids.delete(0)
       //获取所有评论者有信息
       let userInfos =await User.userInfoByIds(Array.from(ids))
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
       for(let m of mainCom){
           m.sub_comments = []
           if(m.commenter_user_id == 0){
                m.userInfo = tra
           }
           else{
                m.userInfo = userInfos.data.find(s=>{
                    return s.user_id == m.commenter_user_id
                })
           }
           for(let n of subCom){
               if(n.comment_target_id == m.comment_id){
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
                   
                   m.sub_comments.push(n)
               }
           }
       }
       article.comments = mainCom
       ctx.rest(Result.create(0,article))
    
       
    },

    'GET /api/article/:userId': async (ctx, next) => {

        let id = ctx.params.userId
        let articleResult = await Article.articles(id)
        if(articleResult.code != 0){
            ctx.rest(articleResult)
            return
        }
        let articles = articleResult.data
        let article_ids = articles.map((s)=>{
            return s.article_id
        })
        if(article_ids==undefined){
            article_ids = [0]
        }
        let tagsResult = await Tag.articleTags(article_ids)
        tagsResult = tagsResult.filter((s)=>{
               return s.data.length > 0
        })
        let a = articles.map((s)=>{
            let t = tagsResult.find((k)=>{
                return k.data[0].article_id == s.article_id
            })
            s['tag'] =  t==undefined ? [] : t.data
            return s
        })
        a = a.sort((a,b)=>{
            a.article_up > b.article_up
        })
        let top = a.shift()
        let res = {top:top,artilces:a}
        ctx.rest(Result.create(0,res))
    },


    'POST /api/article/:userId/:token': async (ctx, next) => {
        let result0 = await Tool.checkToken(ctx)
        if(result0.code != 0){
            ctx.rest(result0)
            return
        }
       let id = ctx.params.userId
       let token = ctx.params.token
       let  t = ctx.request.body

        if(!t.articalTitle || !t.articalTitle.trim()) {
            ctx.rest(Result.create(10,{msg:'miss articalTitle'})) 
            return
        }
        if (!t.articalSort || !t.articalSort.trim()) {
            ctx.rest(Result.create(10,{msg:'miss articalSort'})) 
            return
        }
        if (!t.articalTags) {
            ctx.rest(Result.create(10,{msg:'miss articalTags'})) 
            return
        }
        if (!t.articalContent) {
            ctx.rest(Result.create(10,{msg:'miss articalContent'})) 
            return
        }
       // if(t.articalContent.match(/^data:image\/\w+;base64,/))
       //使用正则来取出里面的图片也不是好办法
       //大一点点的图片都无法直接保存在数据库了
        let m =new Article(t.articalTitle,t.articalContent)
        m.category = t.articalSort
        m.userId = id
        m.articleBrief = t.articleBrief || ''
        m.articleMainImage = t.articelImage || 'http://localhost:3000/static/img/default.jpg'
        m.articleMainImage = m.articleMainImage == '' ? 'http://localhost:3000/static/img/default.jpg' : m.articleMainImage
        let result2 = await Article.save(m)
        if(result2.code != 0)
        {
            ctx.rest(result1)
            return 
        }
        let articleId = result2.data.id
        let result3 = await Tag.saveArticalMap(articleId,t.articalTags)
        ctx.rest(Result.create(0,{id:articleId}))
    },

    //对于更新，是有很多优化的空间的，可以专业来记录更新了哪些东西，史把更新的数据更新到数据库里面
    'PUT /api/article/:articleId/:userId/:token': async (ctx, next) => {
        let result0 = await Tool.checkToken(ctx)
        if(result0.code != 0){
            ctx.rest(result0)
            return
        }
       let id = ctx.params.userId
       let token = ctx.params.token
       let articleId = ctx.params.articleId
       let  t = ctx.request.body

        if(!t.articalTitle || !t.articalTitle.trim()) {
            ctx.rest(Result.create(10,{msg:'miss articalTitle'})) 
            return
        }
        if (!t.articalSort || !t.articalSort.trim()) {
            ctx.rest(Result.create(10,{msg:'miss articalSort'})) 
            return
        }
        if (!t.articalTags) {
            ctx.rest(Result.create(10,{msg:'miss articalTags'})) 
            return
        }
        if (!t.articalContent) {
            ctx.rest(Result.create(10,{msg:'miss articalContent'})) 
            return
        }
        let m =new Article(t.articalTitle,t.articalContent)
        m.category = t.articalSort
        m.userId = id
        m.article_id = articleId
        let result2 = await Article.updateAtricle(m)
        if(result2.code != 0)
        {
            ctx.rest(result1)
            return 
        }
        await Tag.deleteTagByArticleId(articleId)
        await Tag.saveArticalMap(articleId,t.articalTags)
        ctx.rest(Result.create(0,{id:articleId}))
    },

    'DELETE /api/article/:articleId/:userId/:token': async (ctx, next) => {
        let tokenResult = await Tool.checkToken(ctx)
        if(tokenResult.code != 0){
            ctx.rest(tokenResult)
            return
        }
       let id = ctx.params.articleId
       await Article.deleteArticle(id).then(res=>{
            ctx.rest(Result.create(0))
       }).catch(err=>{
           ctx.rest(err)
       })
    },

    'POST /api/uploadImg/:userId/:token': async (ctx, next) => {
        let result0 = await Tool.checkToken(ctx)
        if(result0.code != 0){
            ctx.rest(result0)
            return
        }
       let id = ctx.params.userId
       let token = ctx.params.token
       let  t = ctx.request.body.files.image
       let oldPath = t.path
       if (!fs.existsSync(oldPath)){
           ctx.rest(Result.create(9))
       }
       let fileType = t.type
       let extension = fileType.split('/')[1]
       let newFileName = id + '-' + new Date().getTime()+ '.' + extension
       let newPath =    path.join(__dirname,'../static/img/' + newFileName)
       fs.renameSync(oldPath,newPath)
       let urlPath = "http://localhost:3000/static/img/" + newFileName
       console.log(urlPath)
       ctx.rest(Result.create(0,urlPath))
    },

}



































