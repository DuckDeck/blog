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
        let sql = 'select article_id,article_name,article_main_img,article_brief from article where article_status = 1 and length(article_main_img) > 0 order by article_click desc limit 5'
        let res = await DB.exec(sql)
        let result = Result.create(0)
        if(res.code != 0){
            ctx.rest(res)
            return
        }
        result.data.top  = res.data
        sql = 'select count(article_id) as count from article where article_up = 0 and article_status = 1'
        res = await DB.exec(sql)
        if(res.code != 0){
            ctx.rest(res)
            return
        }
        if(res.data[0].count == 0){
            ctx.rest(Result.createCount(0,0,[]))
            return
        }
        let count = res.data[0].count
        sql  = `select article_id,article_name,article_create_time,article_release_time,article_ip,article_click,article_sort_id,
                user_id,article_type_id,article_type,article_brief,article_main_img,article_up,article_recommend,article_status,
                (select sort_article_name from article_sort where  article_sort.sort_article_id = article.article_sort_id) 
                as article_sort_name , (select count(comment_id) from user_comment where user_comment.comment_target_id =
                article.article_id) as comment_count from article where article_up = 0 and article_status = 1 order by article_release_time desc limit 10`
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
        let sortArr = []
         for(let k of result.data.articles){
            k.tags = []
            let index = sortArr.findIndex(m=>{
                return m.sort_id == k.article_sort_id
            })
            if(index < 0){
                sortArr.push({user_id:k.user_id,sort_id:k.article_sort_id,sort_name:k.article_sort_name})
            }
            for(let l of res.data){
                if(k.article_id == l.article_id)
                k.tags.push(l)
            }
            
        }
        
        result.data.sorts = sortArr
        sql = `select a.comment_id,a.comment_content,a.comment_time,b.user_id, b.user_real_name,b.user_image_url 
               from user_comment a left join user_info b on a.commenter_user_id = b.user_id order by comment_time desc limit 10`
        res = await DB.exec(sql)
        if(res.code != 0){
            ctx.rest(res)
            return
        }

        result.data.newComment = res.data.map(s=>{
            if(!s.user_id){
                s.user_id = 0
                s.user_real_name = '游客'
            }
            if(!s.user_real_name){
                s.user_real_name = ''
            }
            if(!s.user_image_url || s.user_image_url.length == 0){
                s.user_image_url = 'http://localhost:3000/static/imgDefault/head.png'
            }
            return s
        })
        //ISSUE   in the group by sql, when the condition is not in the group by it will return 'null' (not true null) it can not usr ifnull to replace to 0, so i must use 
        //js to do this
        sql = `select user_id,user_real_name,user_image_url,(select count(article_id) as article_count  from article where article.user_id = user_detail.user_Id
               group by user_id) as article_count from user_detail  ` 
        res = await DB.exec(sql)
        if(res.code != 0){
            ctx.rest(res)
            return
        }
    
        result.data.authors = res.data.map(s=>{
            if(!s.article_count){
                s.article_count = 0
            }
            return s
        })
        result.count = count
        ctx.rest(result)
     
     },
    'GET /api/index/:index/:size': async (ctx, next) => {
        let pageResult = Check.checkPage(ctx)
        if(pageResult){
            ctx.rest(pageResult)
            return
        }
        let index = parseInt(ctx.params.index)
        let size = parseInt(ctx.params.size)
        let sql  = `select article_id,article_name,article_create_time,article_release_time,article_ip,article_click,article_sort_id,
                user_id,article_type_id,article_type,article_brief,article_main_img,article_up,article_recommend,article_status,
                (select sort_article_name from article_sort where  article_sort.sort_article_id = article.article_sort_id) 
                as article_sort_name , (select count(comment_id) from user_comment where user_comment.comment_target_id =
                article.article_id) as comment_count from article where article_up = 0 and article_status = 1 order by article_release_time desc limit ?,?`
        let res = await DB.exec(sql,[index * size, size])
        if(res.code != 0){
            ctx.rest(res)
            return
        }
        if(res.data.length == 0){
             ctx.rest(res)
            return
        }
        let result = Result.create(0)
        result.data = res.data
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
        for(let k of result.data){
            let user = res.data.find(s=>{
                return s.user_id == k.user_id
            })
            k.userInfo = user
        }
        
        ctx.rest(result)
     
     },

    'GET /api/searchinfo/:keyword': async (ctx, next) => {
        let keyword = ctx.params.keyword
        let sql = `select user_real_name,user_id,user_image_url,(select count(article_id) from article where article.user_id = user_info.user_id) as article_count 
        from user_info where user_real_name like '%` +keyword + `%' limit 0,3`
        let res = await DB.exec(sql)
        let result = Result.create(0)
        result.data.users = res.data
        sql = `select * from article_sort where sort_article_name like '%` + keyword + `%' limit 0,3`
        res = await DB.exec(sql)
        result.data.sorts = res.data
        ctx.rest(result)
     },
     

    'GET /api/search/:keyword/:type/:index/:size': async (ctx, next) => {
        let pageResult = Check.checkPage(ctx)
        if(pageResult){
            ctx.rest(pageResult)
            return
        }
        let index = parseInt(ctx.params.index)
        let size = parseInt(ctx.params.size)
        let keyword = ctx.params.keyword
        let type = ctx.params.type
        switch(type){
            case 'article':
                let result = await searchArticle(keyword,index,size)
                ctx.rest(result)
                break
            case 'user':
                 result = await searchUser(keyword,index,size)
                ctx.rest(result)
                break
            case 'sort':
                 result = await searchSort(keyword,index,size)
                ctx.rest(result)
                break
            default:
                 result = await searchArticle(keyword,index,size)
                ctx.rest(result)
                break
        }  
    },


}

async function searchArticle(keyword,index,size){
    let sql = `select count(article_id) as count from article  where article_up = 0 and (article_name like '%`+ keyword +`%' or article_brief like '%`+ keyword +`%')`
    let res = await DB.exec(sql)
    if(res.code != 0){
        return res
    }
    if(res.data[0].count <= 0){
        return Result.createCount(0,0,[])
    }
    let count = res.data[0].count
    sql  = `select article_id,article_name,article_create_time,article_release_time,article_ip,article_click,article_sort_id,
                user_id,article_type_id,article_type,article_brief,article_main_img,article_up,article_recommend,article_status,
                (select sort_article_name from article_sort where  article_sort.sort_article_id = article.article_sort_id) 
                as article_sort_name , (select count(comment_id) from user_comment where user_comment.comment_target_id = 
                article.article_id) as comment_count from article where article_up = 0 and (article_name like '%`+ keyword +`%' or article_brief like '%`+ keyword +`%') and article_status = 1
                  order by article_release_time desc limit ?,?`
    res = await DB.exec(sql,[index * size,size])
    if(res.code != 0){
        return res
    }
    let user_ids = res.data.map(s=>{
        return s.user_id
    })
    let result = Result.createCount(0,count,[])
    result.data = res.data
    sql = `select user_id,user_real_name,user_image_url from user_detail where user_id in (` + user_ids.join(',') + ')'
    res =  await DB.exec(sql)
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
    return result
}

async function searchUser(keyword,index,size){
    let sql = `select count(user_id) as count from user_info where user_real_name like  '%`+ keyword +`%'`
    let res = await DB.exec(sql)
    if(res.code != 0){
        return res
    }
    if(res.data[0].count <= 0){
        return Result.createCount(0,0,[])
    }
    let count = res.data[0].count
    sql = `select user_real_name,user_id,user_image_url,(select count(article_id) from article where article.user_id = user_info.user_id) as article_count 
    from user_info where user_real_name like  '%`+ keyword +`%' limit ?,?`
    res = await DB.exec(sql,[index*size,size])
    res.count = count
    return res
}

async function searchSort(keyword,index,size){
    let sql = `select count(sort_article_id) as count from article_sort where sort_article_name like  '%`+ keyword +`%'`
    let res = await DB.exec(sql)
    if(res.code != 0){
        return res
    }
    if(res.data[0].count <= 0){
        return Result.createCount(0,0,[])
    }
    let count = res.data[0].count
    sql = `select *,(select count(article_id) from article where article.article_id = article_sort.sort_article_id)  as 
    article_count from article_sort where sort_article_name like  '%`+ keyword +`%' limit ?,?`
    res = await DB.exec(sql,[index*size,size])
    if(res.code != 0){
        return res
    }
    if(res.data.length <= 0){
        res.count = 0
        return res
    }
    let user_ids = res.data.map(s=>{
        return s.user_id
    })
    let result = Result.create(0)
    result.data = res.data
    sql = `select user_id,user_real_name,user_image_url from user_detail where user_id in (` + user_ids.join(',') + ')'
    res =  await DB.exec(sql)
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
    result.count = count
    return result
}