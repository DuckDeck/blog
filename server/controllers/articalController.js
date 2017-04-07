const APIError = require('../rest').APIError;
const Article = require('../model/article')
const Tag = require('../model/tag')
const User = require('../model/user')
const Result = require('../model/result.js')
const Tool = require('../tool/tool')
const Comment = require('../model/comment')
const fs = require('fs')
const path = require('path')
const Check = require('../tool/check')
const DB = require('../sqlhelp/mysql')
module.exports = {
    //管理员获取所有文章
    'GET /api/manage/article/:mId/:token/:index/:size': async (ctx, next) => {
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
        let sql = `select article_id,article_name,article_create_time,article_release_time,article_ip,article_click,article_sort__id,
                    user_id,article_type_id,article_type,article_brief,article_main_img,article_up,article_recommend,article_status,
                    (select sort_article_name from article_sort where  article_sort.sort_article_id = article.article_sort__id) 
                    as article_sort_name ,(select user_name from user where user.user_id = article.user_id) as user_name, 
                    (select count(comment_id) from user_comment where user_comment.comment_target_id =
                    article.article_id) as comment_count from article limit ? , ?`
        let articleResult = await DB.exec(sql,[index * size,size])
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
        articles = articles.map(s=>{
            let t = tagsResult.find((k)=>{
                return k.data[0].article_id == s.article_id
            })
            s['tags'] =  t==undefined ? [] : t.data
            return s
        })
        let sqlArticleCount = `select count(article_id) as articleCount from article`
        let actArticleCount = await DB.exec(sqlArticleCount)
        let result = Result.create(0,articles)
        result.count = actArticleCount.data[0].articleCount
        ctx.rest(result)
    },


    'POST /api/manage/releaseArticle/:mId/:token': async (ctx, next) => {
        let tokenResult = await Check.checkManageToken(ctx)
        if(tokenResult.code != 0){
            ctx.rest(tokenResult)
            return
        }
        let  t = ctx.request.body
        if(!t.releaseIds && Tool.getType(t.releaseIds) != "Array"){
            ctx.rest(Result.create(10,{msg:'miss releaseIds'})) 
             return
        }
        if(!t.setType && !isNaN(t.setType) ){
            ctx.rest(Result.create(10,{msg:'miss setType'})) 
             return
        }
        let ids = t.releaseIds
        let status = t.setType
        let res = await Article.setReleaseArticle(status,ids)
        ctx.rest(res)
    },


    'GET /api/manage/articleinfo/:articleId/:mId/:token': async (ctx, next) => {
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
        let id = ctx.params.articleId
        let resArticle = await Article.articalById(id)
        if(resArticle.code != 0){
            ctx.rest(resArticle)
            return
        }
        if(resArticle.data.length == 0){
             ctx.rest(Result.create(8))
            return
        }
        let resTags =await Tag.articleTagByArticleId(id)
        if(resTags.code != 0){
            ctx.rest(resTags)
            return
        }
        let article = resArticle.data[0]
        article.tags = resTags.data
        ctx.rest(Result.create(0,article))
    },

    'GET /api/article/:articleId': async (ctx, next) => {
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
       if(mainCom.length > 0){
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
        m.ip = ctx.request.ip
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


    'POST /api/autosavearticle/:userId/:token': async (ctx, next) => {
        let result0 = await Tool.checkToken(ctx)
        if(result0.code != 0){
            ctx.rest(result0)
            return
        }
        let id = ctx.params.userId
        let token = ctx.params.token
        let  t = ctx.request.body
        console.log(t)
        //如果有id，就是自动更新
        if(t.articleId && ! isNaN(t.articleId)) {
            let m =new Article(t.articalTitle,t.articalContent)
            m.category = t.articalSort
            m.userId = id
            m.articalStatus = t.articleStatus
            m.article_id = t.articleId
            let result2 = await Article.updateAtricle(m)
            if(result2.code != 0)
            {
                ctx.rest(result1)
                return 
            }
            
            await Tag.deleteTagByArticleId(m.article_id)
            if(t.articalTags && Tool.getType(t.articalTags) == "Array"){
                console.log(t.articalTags)
                let result3 = await Tag.saveArticalMap(m.article_id,t.articalTags)
            }
           
            ctx.rest(Result.create(0,{id:m.article_id}))
        }
        else{
            // let m =new Article(t.articalTitle,t.articalContent)
            // m.ip = ctx.request.ip
            // m.category = t.articalSort
            // m.userId = id
            // m.articalStatus = t.articleStatus
            // m.articleBrief = t.articleBrief || ''
            // m.articleMainImage = t.articelImage || 'http://localhost:3000/static/img/default.jpg'
            // let result2 = await Article.save(m)
            // if(result2.code != 0)
            // {
            //     ctx.rest(result1)
            //     return 
            // }
            // console.log(t.articalTags)
            // let articleId = result2.data.id
            // if(t.articalTags && Tool.getType(t.articalTags) == "Array"){
            //     let result3 = await Tag.saveArticalMap(articleId,t.articalTags)
            // }
            // ctx.rest(Result.create(0,{id:articleId}))
            ctx.rest(Result.create(0))
        }
       
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


    'GET /api/temparticle/:userId/:token': async (ctx, next) => {
        let tokenResult = await Tool.checkToken(ctx)
        if(tokenResult.code != 0){
            ctx.rest(tokenResult)
            return
        }
       let id = ctx.params.userId
       let resArticle = await Article.getTempAarticle(id)
       if(resArticle.code != 0){
            ctx.rest(resArticle)
            return
       }
       if(resArticle.data.length <= 0){
           ctx.rest(Result.create(8))
            return
       }
       resArticle.data = resArticle.data[0]
       let resTags =await Tag.articleTagByArticleId(resArticle.data.article_id)
       if(resTags.code != 0){
            ctx.rest(resTags)
            return
       }
       resArticle.data.tags = resTags.data
       ctx.rest(resArticle)
    },

  


}
