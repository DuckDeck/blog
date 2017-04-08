const APIError = require('../rest').APIError;
const Article = require('../model/article')
const Tag = require('../model/tag')
const User = require('../model/user')
const Result = require('../model/result.js')
const Tool = require('../tool/tool')
const Comment = require('../model/comment')
const Check = require('../tool/check')
const DB = require('../sqlhelp/mysql')
module.exports = {
    'GET /api/index': async (ctx, next) => {

        let sql = 'select article_id,article_name,article_main_img,article_brief from article where article_up > 0 order by article_up desc limit 2'
        let res = await DB.exec(sql)
        let result = Result.create(0)
        if(res.code != 0){
            ctx.rest(res)
            return
        }
        result.data.top  = res.data
        sql  = `select article_id,article_name,article_create_time,article_release_time,article_ip,article_click,article_sort__id,
                user_id,article_type_id,article_type,article_brief,article_main_img,article_up,article_recommend,article_status,
                (select sort_article_name from article_sort where  article_sort.sort_article_id = article.article_sort__id) 
                as article_sort_name , (select count(comment_id) from user_comment where user_comment.comment_target_id =
                article.article_id) as comment_count from article where article_up = 0 order by article_release_time desc limit 15`
        res = await DB.exec(sql)
        if(res.code != 0){
            ctx.rest(res)
            return
        }
        result.data.articles = res.data
        let user_ids = res.data.map(s=>{
            return s.user_id
        })
        let articleIds = res.data.map(s=>{
            return s.article_id
        })
        sql = `select user_id,user_real_name,user_image_url from user_detail where user_id in (` + user_ids.join(',') + ')'
        res =  await DB.exec(sql)
        if(res.code != 0){
            ctx.rest(res)
            return
        }
        for(let k of result.data.articles){
            let user = res.data.find(s=>{
                return s.user_id == k.user_id
            })
            k.userInfo = user
        }
        
        sql = `select * from article_tag_map_view where article_id in (`  + articleIds.join(',') + ')'
        res =  await DB.exec(sql)
        if(res.code != 0){
            ctx.rest(res)
            return
        }
         for(let k of result.data.articles){
             k.tags = []
            for(let l of res.data){
                if(k.article_id == l.article_id)
                k.tags.push(l)
            }
            
        }


        ctx.rest(result)
     
    },


}