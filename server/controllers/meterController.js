const APIError = require('../rest').APIError;
const Article = require('../model/article')
const Tag = require('../model/tag')
const User = require('../model/user')
const Result = require('../model/result.js')
const Tool = require('../tool/tool')
const Comment = require('../model/comment')
const File = require('../model/file')
module.exports = {
    'GET /api/meter/:userId/:token': async (ctx, next) => {
        let tokenResult = await Tool.checkToken(ctx)
        if(tokenResult.code != 0){
            ctx.rest(tokenResult)
            return
        }
        let id = ctx.params.userId
        let token = ctx.params.token
        
        let resAll = await Promise.all([Article.myArticleCount(id),Comment.mynewestComment(id),Article.myNewArticle(id),File.allFile()])
        console.log(resAll)
  

        ctx.rest(Result.create(0,resAll))
    },
}


