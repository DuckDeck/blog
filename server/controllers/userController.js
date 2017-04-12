const APIError = require('../rest').APIError;
const User = require('../model/user')
const Result = require('../model/result.js')
const Tool = require('../tool/tool')
const path = require('path')
const fs = require('fs')
const Link = require('../model/link')
const Check = require('../tool/check')
const DB = require('../sqlhelp/mysql')
module.exports = {
    //管理用户
    'GET /api/manage/user/:mId/:token/:index/:size': async (ctx, next) => {
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
       let sqlUser = 'select user_id,user_name,user_isValidate,user_register_time from user limit ?,?'
       let res = await DB.exec(sqlUser,[index * size,size])
       ctx.rest(res)
    },

    'GET /api/manage/userinfo/:userId/:mId/:token': async (ctx, next) => {
        let tokenResult = await Check.checkManageToken(ctx)
        if(tokenResult.code != 0){
            ctx.rest(tokenResult)
            return
        }
        let paraCheckResult = Check.checkNum(ctx.params,'userId')
        if(paraCheckResult){
            ctx.rest(paraCheckResult)
            return
        }
        let userId = parseInt(ctx.params.userId)
        
        let sqlUser = 'select a.* ,b.* from  user a join user_info b on a.user_id = b.user_id where a.user_id = ?'
        let res = await DB.exec(sqlUser,[userId])
        if(res.code == 0){
            if(res.data.length > 0){
                res.data = res.data[0]
            }
            else{
                res = Result.create(8)
            }
        }
        ctx.rest(res)
    },

    'POST /api/login': async (ctx, next) => {
       var
            t = ctx.request.body,
            m;
        if (!t.userName || !t.userName.trim()) {
            ctx.rest(Result.create(10,{msg:'miss userName'})) 
            return
        }
        if (!t.password || !t.password.trim()) {
            ctx.rest(Result.create(10,{msg:'miss password'})) 
            return
        }
        m = {
            userName: t.userName.trim(),
            password: t.password.trim()
        }
    
       let res =  await User.checkLogin(m.userName)
       if(res.code != 0){
           ctx.rest(res)
           return
       }
       if(res.data.length <= 0){
           ctx.rest(Result.create(500))
           return
       }
       let user = res.data[0]
       let pass = user.user_password    
       let mdPass = Tool.md5(m.password)
       if(pass != mdPass){
           ctx.rest(Result.create(501))
           return
       }
       let token = Tool.md5(Math.random().toString())
       await User.saveToken(token,user.user_id)
       let result = Result.create(0,{token:token,user_id:user.user_id})
       ctx.rest(result)
    },
    'POST /api/user/uploadHead/:userId/:token': async (ctx, next) => {
       let result0 = await Tool.checkToken(ctx)
        if(result0.code != 0){
            ctx.rest(result0)
            return
        }
       let id = ctx.params.userId
       let token = ctx.params.token
       let  t = ctx.request.body.files.file
       let oldPath = t.path
       if (!fs.existsSync(oldPath)){
           ctx.rest(Result.create(9))
       }
       let fileType = t.type
       let extension = fileType.split('/')[1]
       let newFileName = id + '-' + new Date().getTime()+ '.' + extension
       let newPath =  path.join(__dirname,'../static/myimg/' + newFileName)
       fs.renameSync(oldPath,newPath)
       let urlPath = "http://localhost:3000/static/myimg/" + newFileName
       let userInsert = {
           user_id:id,
           user_image_url:urlPath
       }
       let res = await User.updateUserHead(userInsert)
       res.data = {url:urlPath}
       ctx.rest(res)
    },
    
    'GET /api/user/:userId': async (ctx, next) => {
       let id = ctx.params.userId
       //获取个人信息
       let res = await User.userInfoById(id)
       if(res.code != 0){
          ctx.rest(res)
          return
       }
       let userInfo = res.data[0]
       res = await Link.userLinks(id)
       if(res.code != 0){
          ctx.rest(res)
          return
       }
       userInfo.links = res.data
       let sql = `select article_id,article_name,article_create_time,article_brief,article_main_img,article_click,article_status,(select sort_article_name from article_sort where  article_sort.sort_article_id = article.article_sort_id) 
                 as article_sort_name , (select count(comment_id) from user_comment where user_comment.comment_target_id =
                 article.article_id) as comment_count from article where user_id = ?  order by article_create_time desc limit 10`
       res = await DB.exec(sql,[id])
       if(res.code != 0){
          ctx.rest(res)
          return
       }
       userInfo.articles = res.data
       ctx.rest(Result.create(0,userInfo))
    },
    

}




























