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
const Dynamic = require('../model/dynamic')
const imgPath = require('../../config/imgPathConfig')

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
        let sql = `select article_id,article_name,article_create_time,article_release_time,article_ip,article_click,article_sort_id,
                    user_id,article_type_id,article_type,article_brief,article_main_img,article_up,article_recommend,article_status,
                    (select sort_article_name from article_sort where  article_sort.sort_article_id = article.article_sort_id) 
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

    'DELETE /api/manage/article/:articleId/:mId/:token': async (ctx, next) => {
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
       let res =  await Article.deleteArticle(id)
       
       if(res.length != 2){
           ctx.rest(res)
           return
       }
       let sql = 'select comment_id from user_comment where  comment_target_id = ?'
       res = await DB.exec(sql,[id])
       if(res.data.length > 0){
           let ids = res.data.map(s=>{return s.comment_id}).join(',')
           sql = 'update user_comment set delete_flag = 1 where comment_id in (' + ids + ")"
           await DB.exec(sql)
           sql = 'update user_sub_comment set delete_flag = 1 where comment_scope in (' + ids + ")"
           await DB.exec(sql)
       }
       ctx.rest(Result.create(0))
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
       let user_id = article.user_id
       let resUser = await User.userInfoById(user_id)
       if(resUser.code != 0){
            ctx.rest(resUser)
            return
       }
       article.userInfo = resUser.data[0]
       ctx.rest(Result.create(0,article))
     },


    'GET /api/articlewithuser/:userId/:index/:size': async (ctx, next) => {
       let pageResult = Check.checkPage(ctx)
       if(pageResult){
           ctx.rest(pageResult)
           return
       }
       let id = ctx.params.userId
       let index = parseInt(ctx.params.index)
       let size = parseInt(ctx.params.size)
       let sqlCount = "select count(article_id) as count  from article where user_id = ? and article_status = 1"  
       let resCount = await DB.exec(sqlCount,[id])
       if(resCount.code != 0){
           ctx.rest(resCount)
           return
       }
       if(resCount.data[0].count == 0){
           ctx.rest(Result.createCount(0,0,[]))
           return
       }
       let sqlArticles = `select article_id,article_name,user_id,article_create_time,article_brief,article_main_img,article_click,article_status,
                (select sort_article_name from article_sort where  article_sort.sort_article_id = article.article_sort_id) 
                 as article_sort_name , (select count(comment_id) from user_comment where user_comment.comment_target_id =
                 article.article_id) as comment_count from article where user_id = ? and article_status = 1  order by article_create_time desc limit ?,?`
       let resArticles = await DB.exec(sqlArticles,[id,index * size,size])
       if(resArticles.code != 0)
       {
           ctx.rest(resArticles)
           return
       }
       if(resArticles.data.length == 0){
           ctx.rest(Result.createCount(0,0,[]))
           return
       }
       let user_ids = new Set(resArticles.data.map(s=>{
            return s.user_id
       }))
       let count = resCount.data[0].count
       let result = Result.createCount(0,count,[])
       result.data = resArticles.data
       let sql = `select user_id,user_real_name,user_image_url from user_detail where user_id in (` + Array.from(user_ids).join(',') + ')'
       let res =  await DB.exec(sql)
       if(res.code != 0){
           ctx.rest(res)
           return
       }
       for(let k of result.data){
           let user = res.data.find(s=>{
               return s.user_id == k.user_id
           })
           k.user_info = user
       }
       ctx.rest(result)
     },

    'GET /api/updatearticlecount/:articleId': async (ctx, next) => {
       let id = ctx.params.articleId
       let sql = 'update article set article_click = article_click + 1 where article_id = ?'
       await DB.exec(sql,[id])
       ctx.rest(Result.create(0))
     },


    'POST /api/article/:userId/:token': async (ctx, next) => {
        let result0 = await Check.checkToken(ctx)
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
   
        if (!t.articalContent) {
            ctx.rest(Result.create(10,{msg:'miss articalContent'})) 
            return
        }
       // if(t.articalContent.match(/^data:image\/\w+;base64,/))
       //使用正则来取出里面的图片也不是好办法
       //大一点点的图片都无法直接保存在数据库了
        let m =new Article(t.articalTitle,Tool.handleHtmlImg(t.articalContent))
        m.ip = ctx.request.ip
        m.category = t.articalSort
        m.userId = id
        m.articalStatus = 1
        m.articleBrief = t.articleBrief
        m.articleMainImage = ''
        let imgTag = m.content.match(/<img.*?(?:>|\/>)/gi)
        if(imgTag && imgTag.length  > 0){
                let url = imgTag[0].match(/src=[\'\"]?([^\'\"]*)[\'\"]?/i)
                if(url && url.length > 0){
                    m.articleMainImage = url[0].replace("src=\"","").replace("\"","")
                }
            }
        let resultArticle = {}
        let articleId = 0
        if(t.articleId && ! isNaN(t.articleId) && t.articleId != 0) {
           m.article_id = t.articleId
           resultArticle = await Article.updateAtricle(m)
           articleId = m.article_id
        }
        else{
            resultArticle = await Article.save(m)
            articleId = resultArticle.data.id
        }
        if(resultArticle.code != 0)
        {
            ctx.rest(resultArticle)
            return 
        }
        await Tag.deleteTagByArticleId(m.article_id)
        if (t.articalTags&& Tool.getType(t.articalTags) == "Array") {
             let result3 = await Tag.saveArticalMap(articleId,t.articalTags)
        }
        let dynamic = new Dynamic(id,articleId,0,1,0,1)
        await Dynamic.save(dynamic)
        ctx.rest(Result.create(0,{id:articleId}))
     },


    'POST /api/autosavearticle/:userId/:token': async (ctx, next) => {
        let result0 = await Check.checkToken(ctx)
        if(result0.code != 0){
            ctx.rest(result0)
            return
        }
        let id = ctx.params.userId
        let token = ctx.params.token
        let  t = ctx.request.body
        //如果有id，就是自动更新
        if(t.articleId && ! isNaN(t.articleId) && t.articleId != 0) {
            let m =new Article(t.articalTitle,Tool.handleHtmlImg(t.articalContent))
            m.category = t.articalSort
            m.userId = id
            m.ip = ctx.request.ip
            m.articalStatus = 5
            m.article_id = t.articleId
            m.articleBrief = t.articleBrief
            m.articleMainImage = ''
            let imgTag = m.content.match(/<img.*?(?:>|\/>)/gi)
            if(imgTag && imgTag.length  > 0){
                let url = imgTag[0].match(/src=[\'\"]?([^\'\"]*)[\'\"]?/i)
                if(url && url.length > 0){
                    m.articleMainImage = url[0].replace("src=\"","").replace("\"","")
                }
            }
            let result2 = await Article.updateAtricle(m)
            if(result2.code != 0)
            {
                ctx.rest(result1)
                return 
            }
            
            await Tag.deleteTagByArticleId(m.article_id)
            if(t.articalTags && Tool.getType(t.articalTags) == "Array"){
                let result3 = await Tag.saveArticalMap(m.article_id,t.articalTags)
            }
            ctx.rest(Result.create(0,{id:m.article_id}))
        }
        else{
            let m =new Article(t.articalTitle,Tool.handleHtmlImg(t.articalContent))
            m.ip = ctx.request.ip
            m.category = t.articalSort
            m.userId = id
            m.articalStatus = 5
            m.ip = ctx.request.ip
            m.articleBrief = t.articleBrief
            m.articleMainImage = ''
            let imgTag = m.content.match(/<img.*?(?:>|\/>)/gi)
            if(imgTag && imgTag.length  > 0){
                let url = imgTag[0].match(/src=[\'\"]?([^\'\"]*)[\'\"]?/i)
                if(url && url.length > 0){
                    m.articleMainImage = url[0].replace("src=\"","").replace("\"","")
                }
            }
            let result2 = await Article.save(m)
            if(result2.code != 0)
            {
                ctx.rest(result1)
                return 
            }
            let articleId = result2.data.id
            if(t.articalTags && Tool.getType(t.articalTags) == "Array"){
                let result3 = await Tag.saveArticalMap(articleId,t.articalTags)
            }
            ctx.rest(Result.create(0,{id:articleId}))
        }
       
     },

    //对于更新，是有很多优化的空间的，可以专业来记录更新了哪些东西，史把更新的数据更新到数据库里面
    'PUT /api/article/:articleId/:userId/:token': async (ctx, next) => {
        let result0 = await Check.checkToken(ctx)
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
        m.article_id = articleId
        m.category = t.articalSort
        m.ip = ctx.request.ip
        m.userId = id
        m.articalStatus = 1
        m.articleBrief = t.articleBrief
        m.articleMainImage = t.articelImage
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
        let tokenResult = await Check.checkToken(ctx)
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
     //上传图片目前没，只有用固定的token
    'POST /api/uploadArticleImg/:userId/:token': async (ctx, next) => {
        let result0 = await Check.checkToken(ctx)
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
       let urlPath = imgPath.imgPath + "static/img/" + newFileName
       ctx.rest(Result.create(0,urlPath))
     },


    'GET /api/temparticle/:userId/:token': async (ctx, next) => {
        let tokenResult = await Check.checkToken(ctx)
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

    'GET /api/articleswithsort/:sortId/:index/:size': async (ctx, next) => {
        let pageResult = Check.checkPage(ctx)
        if(pageResult){
            ctx.rest(pageResult)
            return
        }
        let index = parseInt(ctx.params.index)
        let size = parseInt(ctx.params.size)
        let id = ctx.params.sortId

        let sql = `select count(article_id) as count from article where  article_sort_id = ` + id + ` and article_status = 1`
        if(id == 0){
            sql = `select count(article_id) as count from article where  article_status = 1`
        }
        let res = await DB.exec(sql)
        if(res.code != 0){
            ctx.rest(res)
            return
        }
        if(res.data[0].count == 0){
            ctx.rest(Result.createCount(0,0,[]))
            return
        }
        let count = res.data[0].count
         sql = `select article_id,article_name,article_create_time,article_brief,article_main_img,article_click,article_status,(select sort_article_name from article_sort where  article_sort.sort_article_id = article.article_sort_id) 
                 as article_sort_name ,(select user_real_name from user_info where user_info.user_id = article.user_id) as user_real_name, (select count(comment_id) from user_comment where user_comment.comment_target_id =
                 article.article_id) as comment_count from article where article_sort_id = ` + id + ` and article_status = 1 order by article_release_time desc limit ?,?`
        if(id == 0){
            sql = `select article_id,article_name,article_create_time,article_brief,article_main_img,article_click,article_status,(select sort_article_name from article_sort where  article_sort.sort_article_id = article.article_sort_id) 
                 as article_sort_name ,(select user_real_name from user_info where user_info.user_id = article.user_id) as user_real_name, (select count(comment_id) from user_comment where user_comment.comment_target_id =
                 article.article_id) as comment_count from article where article_status = 1  order by article_release_time desc limit ?,?`
        }
        res = await DB.exec(sql,[index * size,size])
        res.count = count
        ctx.rest(res)
     },

    // can not work， it can not add to the controller
    'GET /api/articles/:userId/sort/:sortId/tag/:tagid/:index/:size': async (ctx, next) => {
        let pageResult = Check.checkPage(ctx)
        if(pageResult){
            ctx.rest(pageResult)
            return
        }
        let userIdCheckResult = Check.checkNum(ctx.params,'userId')
        if(userIdCheckResult){
            ctx.rest(userIdCheckResult)
            return
        }
        let sortIdCheckResult = Check.checkNum(ctx.params,'sortId')
        if(sortIdCheckResult){
            ctx.rest(sortIdCheckResult)
            return
        }
        let userId = ctx.params.userId
        let sortId = ctx.params.sortId
        let tagId = ctx.params.tagid
        let index = parseInt(ctx.params.index)
        let size = parseInt(ctx.params.size)
        tagId = tagId.split('_')
        for(let t in tagId){
            if(isNaN(t)){
                ctx.rest(Result.create(11))
                return
            }
        }
         //这里的分布有点问题,要加上分布功能要重新设计这个接口，等待做
        //let sql = `select article_id from article where article_sort_id = ` + sortId + ` and user_id = `+ userId + ``
        let condition0 = ' and user_id = ' + userId
        let condition1 = '  and article_sort_id = ' +  sortId
        if (sortId == -1){ //-1 表示全部
            condition1 = ' ' 
        }
        let condition2 = ' and article_id in  (select article_id from article_tag_map_view where user_id = ' + userId + ' and tag_id in  (' + tagId.join(',') + '))'
        if(tagId.length == 1 && tagId == -1){
            condition2 = ''
        }
        else if(tagId.length == 1 && tagId == 0){
            condition2 = ` and article_id  in  (SELECT article_id FROM article where  not exists (select  
            article_id from article_tag_map_view where  article.article_id = article_tag_map_view.article_id) and user_id =` + userId + `)`
        }
        let sql = 'select count(article_id) as count from article where article_status = 1' + condition0 + condition1 + condition2 
        let res  = await DB.exec(sql)
        if(res.code != 0){
            ctx.rest(res)
            return
        }
         if(res.data[0].count == 0){
            ctx.rest(Result.createCount(0,0,[]))
            return
        }
        let count = res.data[0].count
        sql = `select article_id,article_name,article_create_time,article_brief,article_main_img,article_click,article_status,
                (select sort_article_name from article_sort where  article_sort.sort_article_id = article.article_sort_id) 
                as article_sort_name ,(select count(comment_id) from user_comment where user_comment.comment_target_id =
                article.article_id) as comment_count from article where article_status = 1 ` + condition0 + condition1 + condition2  + ' order by article_release_time desc limit ?,?'
        res = await DB.exec(sql,[index * size,size])
        res.count = count
        ctx.rest(res)
        // if(res.code != 0){
        //     ctx.rest(res)
        //     return
        // }
        // let articles = res.data
        // if (articles.length == 0){
        //     ctx.rest(Result.create(0))
        //     return
        // }
        
        // if(tagId.length == 1 && tagId == 0 ){
        //     ctx.rest(res)
        // }
        // else if(tagId.length == 1 && tagId == -1){
        //     sql = `select article_id from article where article_id not in (select article_id from article_tag_map_view where user_id = `+ userId +`)` + `and user_id = ` + userId
        //     res = await DB.exec(sql)
        //     if(res.code != 0){
        //         ctx.rest(res)
        //         return
        //     }
        //     articles = articles.filter(s=>{
        //         let tag = res.data.find(t=>{
        //             return t == s.article_id
        //         })
        //         if(tag){
        //             return true
        //         }
        //         else{
        //             return false
        //         }
        //     })
        //     ctx.rest(Result.create(0,articles))
        // }
        // else{
        //     sql = `select * from article_tag_map_view where tag_id in (` + tagId.join(',') + ')'
        //     res = await DB.exec(sql)
        //     if(res.code != 0){
        //         ctx.rest(res)
        //         return
        //     }
        //     articles = articles.filter(s=>{
        //         let tag = res.data.find(t=>{
        //             return t.article_id == s.article_id
        //         })
        //         if(tag){
        //             return true
        //         }
        //         else{
        //             return false
        //         }
        //     })
        //     ctx.rest(Result.create(0,articles))
        // }
        
     },

}
