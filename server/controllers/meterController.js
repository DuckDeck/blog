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
        if(Tool.getType(resAll) == "Array"){
            let articleCount = resAll[0].data[0].articleCount
            let myComment = resAll[1].data.sort((a,b)=>{
                return a.comment_time < b.comment_time
            })
            let myNewArticle = resAll[2].data
            let fileCount = resAll[3].length
            let commentCount = myComment.length
            let data = {
                articleCount:articleCount,
                commentCount:commentCount,
                myNewArticle:myNewArticle,
                myNewComment:myComment.splice(0,7),
                fileCount:fileCount
            }
            ctx.rest(Result.create(0,data))
        }
        else{
             ctx.rest(Result.create(-1))
        }

       
    },
}


