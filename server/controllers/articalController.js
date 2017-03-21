const APIError = require('../rest').APIError;
const Article = require('../model/article')
const Tag = require('../model/tag')
const Result = require('../model/result.js')
const Tool = require('../tool/tool')
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
       await Promise.all([Article.articalById(id),Tag.articleTagByArticleId(id)]).then(res=>{
            if(res[0].data.length <= 0){
                ctx.rest(Result.create(8))
                return
            }
            let article = res[0].data[0]
            article['tags'] = res[1].data
            let result = Result.create(0,article)
            console.log(result.data.tags)
            ctx.rest(result)
       }).catch(err=>{
           ctx.rest(err)
       })
       
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
        let m =new Article(t.articalTitle,t.articalContent)
        m.category = t.articalSort
        m.userId = id
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

}
