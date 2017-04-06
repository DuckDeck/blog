const APIError = require('../rest').APIError;
const Result = require('../model/result.js')
const path = require('path')
const fs = require('fs')
const Check = require('../tool/check')
const DB = require('../sqlhelp/mysql')
module.exports = {
    //管理用户
    'GET /api/managelist/:mId/:token/': async (ctx, next) => {
        let tokenResult = await Check.checkManageToken(ctx)
        if(tokenResult.code != 0){
            ctx.rest(tokenResult)
            return
        }
       let sql = 'select * from blog_manage'
       let res = await DB.exec(sql)
       ctx.rest(res)
    },

    'Post /api/manageupdate/:mId/:token': async (ctx, next) => {
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
        };
      await user.checkLogin(m.userName).then(function(result){
          if(result.data.length >0){
              let user = result.data[0]
              let pass = user.user_password    
              let mdPass = Tool.md5(m.password)
              if(pass == mdPass){
                   let token = Tool.md5(Math.random().toString())
                   Tool.saveToken(user.user_id,token)
                   result = Result.create(0)
                   if(user.user_group_id == 10){
                       result.data = {isManager:true,token:token,user_id:user.user_id}
                   }
                   else{
                        result.data = {isManager:false,token:token,user_id:user.user_id}
                   }
              }
              else{
                  result = Result.create(501)
              }
          }
          else{
              result = Result.create(500)
          }
         ctx.rest(result)     
      })
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
       let res = await user.updateUserHead(userInsert)
       res.data = {url:urlPath}
       ctx.rest(res)
    },
    
    'GET /api/user/:userId': async (ctx, next) => {
       let id = ctx.params.userId
       let token = ctx.params.token
       //只测试这一下，不然后太麻烦
       //已经OK了，这下一般没会人去破解
       await user.userInfoById(id).then(function(result){
            if(result.data.length > 0){
                let user = result.data[0]
                result.data = user
            }
            else{
                result = Result.create(500)
            }
            ctx.rest(result)     
       }).catch(function(err){
            ctx.rest(err)  
       })   
    },
    

}




























