const DB = require('../sqlhelp/mysql')
const Result = require('../model/result.js')
const Check = require('../tool/check')
const File = require('../model/file')
const Tool = require('../tool/tool')
module.exports = {
    'GET /api/manage/meter/:mId/:token': async (ctx, next) => {
        let tokenResult = await Check.checkManageToken(ctx)
        if(tokenResult.code != 0){
            ctx.rest(tokenResult)
            return
        }
        let sqlArticleCount = `select count(article_id) as articleCount from article`
        let actArticleCount = DB.exec(sqlArticleCount)

        let sqlCommentCount = 'select count(comment_id) as commentCount from user_comment where delete_flag = 0 '
        let actCommentCount = DB.exec(sqlCommentCount)

        let sqlNewArticle = 'select article_id,article_name from article order by article_create_time desc limit 10'
        let actNewArticle = DB.exec(sqlNewArticle)

        let sqlNewComment = `select comment_id,comment_content,comment_time,(select user_name from user where user_id = user_comment.commenter_user_id) as commenter
         from user_comment where delete_flag = 0 order by comment_time desc limit 10`
        let actNewComment = DB.exec(sqlNewComment)

        let resAll = await Promise.all([actArticleCount,actNewArticle,actCommentCount,actNewComment,File.allFile()])
       
        if(Tool.getType(resAll) == "Array"){
            let articleCount = resAll[0].data[0].articleCount
            let commentCount = resAll[2].data[0].commentCount
            let newArticle = resAll[1].data
            let fileCount = resAll[4].length
            let newComment = resAll[3].data
            newComment = newComment.map(s=>{
                if(!s.commenter){
                    s.commenter = '游客'
                }
                return s
            })
            let data = {
                articleCount:articleCount,
                commentCount:commentCount,
                newArticle:newArticle,
                newComment:newComment,
                fileCount:fileCount
            }
            ctx.rest(Result.create(0,data))
        }
        else{
             ctx.rest(Result.create(-1))
        }

       
    },
}


