const APIError = require('../rest').APIError;
const User = require('../model/user')
const Result = require('../model/result.js')
const Tool = require('../tool/tool')
const path = require('path')
const fs = require('fs')
const Link = require('../model/link')
const Check = require('../tool/check')
const DB = require('../sqlhelp/mysql')
const Sort = require('../model/articleSort')
const Dynamic = require('../model/dynamic')
const imgPath = require('../../config/pathConfig')


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
     //管理员获取用户信息
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
     //管理员获取用户喜欢的文章列表
     'GET /api/manage/userlikearticle/:userId/:mId/:token/:index/:size': async (ctx, next) => {
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
        let paraCheckResult = Check.checkNum(ctx.params,'userId')
        if(paraCheckResult){
            ctx.rest(paraCheckResult)
            return
        }
        let userId = parseInt(ctx.params.userId)
        let index = parseInt(ctx.params.index)
        let size = parseInt(ctx.params.size)
        let sql = `select count(like_id) as count from like_article where user_id = ?`
        let res = await DB.exec(sql,[userId])
        if(res.code != 0){
            ctx.rest(res)
            return
        }
        if(res.data[0].count == 0){
            ctx.rest(Result.createCount(0,0,[]))
            return
        }
        let count = res.data[0].count
        res = await DB.exec("select article_id from like_article where user_id = ? order by like_time desc limit ?,?",[userId,index*size,size])
        if(res.code != 0){
            ctx.rest(res)
            return
        }
        let articles = res.data
        let articleIds = articles.map(s=>{
            return s.article_id
        })
        sql = `select * from article_related_info where  article_id in (` + articleIds.join(',') + `)`
        //注意，这进而是有被删除的文章的，因为我没有完全删除。
        //所以如果喜欢的文章被删除的话，这里就要产品来判断还要不要返回给已经设为喜欢的文章的用户了
        //这里我就直接返回了
        res = await DB.exec(sql)
        if(res.code != 0){
            ctx.rest(res)
            return
        }
        ctx.rest(Result.createCount(0,count,res.data))
     },
     //管理员获取用户收藏的文章列表
     'GET /api/manage/usercollectarticle/:userId/:mId/:token/:index/:size': async (ctx, next) => {
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
        let paraCheckResult = Check.checkNum(ctx.params,'userId')
        if(paraCheckResult){
            ctx.rest(paraCheckResult)
            return
        }
        let userId = parseInt(ctx.params.userId)
        let index = parseInt(ctx.params.index)
        let size = parseInt(ctx.params.size)
        let sql = `select count(collect_id) as count from collect_article where user_id = ?`
        let res = await DB.exec(sql,[userId])
        if(res.code != 0){
            ctx.rest(res)
            return
        }
        if(res.data[0].count == 0){
            ctx.rest(Result.createCount(0,0,[]))
            return
        }
        let count = res.data[0].count
        res = await DB.exec("select article_id from collect_article where user_id = ? order by collect_time desc limit ?,?",[userId,index*size,size])
        if(res.code != 0){
            ctx.rest(res)
            return
        }

        let articleIds = res.data.map(s=>{
            return s.article_id
        })
        sql = `select * from article_related_info where  article_id in (` + articleIds.join(',') + `)`
        //注意，这进而是有被删除的文章的，因为我没有完全删除。
        //所以如果收藏的文章被删除的话，这里就要产品来判断还要不要返回给已经设为收藏的文章的用户了
        //这里我就直接返回了
        res = await DB.exec(sql)
        if(res.code != 0){
            ctx.rest(res)
            return
        }
        ctx.rest(Result.createCount(0,count,res.data))  
     },
     //管理员获取用户关注的人
     'GET /api/manage/userattentioned/:userId/:mId/:token/:index/:size': async (ctx, next) => {
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
        let paraCheckResult = Check.checkNum(ctx.params,'userId')
        if(paraCheckResult){
            ctx.rest(paraCheckResult)
            return
        }
        let userId = parseInt(ctx.params.userId)
        let index = parseInt(ctx.params.index)
        let size = parseInt(ctx.params.size)
        let sql = `select count(a_id) as count from user_attention where user_id = ?`
        let res = await DB.exec(sql,[userId])
        if(res.code != 0){
            ctx.rest(res)
            return
        }
        if(res.data[0].count == 0){
            ctx.rest(Result.createCount(0,0,[]))
            return
        }
        let count = res.data[0].count
        res = await DB.exec("select * from user_attention where user_id = ? order by attention_time desc limit ?,?",[userId,index*size,size])
        if(res.code != 0){
            ctx.rest(res)
            return
        }
        ctx.rest(Result.createCount(0,count,res.data))    
     },
     //用户登录
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
        // this a bug which can make the password is not the same from register
       let isMail = false
       if(/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test(m.userName)){
           isMail = true
       }
       let res = {}
       if(isMail){
           res = await User.checkLoginEmail(m.userName)
       }
       else{
            res =  await User.checkLogin(m.userName)
       }
       if(res.code != 0){
           ctx.rest(res)
           return
       }
       if(res.data.length <= 0){
           ctx.rest(Result.create(500))
           return
       }
       let user = res.data[0]  
       m.password =  Check.decryptyPass(m.password)
       if(m.password == ""){
           ctx.rest(Result.create(501))
           return
       }

       let mdPass = Tool.md5(m.password)
       if(res.data[0].user_password != mdPass){
           ctx.rest(Result.create(501))
           return
       }
       Check.deleteUserKey(user.user_id)
       if(user.user_isValidate != 1){
           ctx.rest(Result.create(503,{user_id:user.user_id}))
           return
        }
      let token = Tool.md5(Math.random().toString())
       await User.saveToken(token,user.user_id)
       let result = Result.create(0,{token:token,user_id:user.user_id})
       ctx.rest(result)      
      },
    //用户注册
    'POST /api/register': async (ctx, next) => {
        let  t = ctx.request.body
        if (!t.nickname || !t.nickname.trim()) {
            ctx.rest(Result.create(10,{msg:'miss nickName'})) 
            return
        }
        if (!t.password || !t.password.trim()) {
            ctx.rest(Result.create(10,{msg:'miss password'})) 
            return
        }
        if (!t.email || !t.email.trim()) {
            ctx.rest(Result.create(10,{msg:'miss email'})) 
            return
        }
       let pass =  Check.decryptyPass(t.password.trim())
       if(pass == ""){
           ctx.rest(Result.create(501))
           return
       }
       let m = {
            nickName: t.nickname.trim(),
            password: pass,
            email:t.email.trim()
        }
        if(Check.regexCheck(m.email,'email')){
            ctx.rest(Result.create(11,{msg:'email format wrong'})) 
            return 
        }
        let activityCode = (Math.random() * 100000000).toFixed(0)
        let user = new User(m.email,m.password)
        user.user_register_time = (new Date()).getTime()
        user.user_register_ip = ctx.request.ip
        user.token = Tool.md5(activityCode)
        let res = await User.save(user)
        if(res.code != 0){
            ctx.rest(res)
            return
        }
        let id = res.data.id
        let img_path = imgPath.imgPath + "static/system/tra.png"
        let sql = "insert into user_info (user_id,user_real_name,user_email,user_image_url) values (?,?,?,?)"
        res = await DB.exec(sql,[id,m.nickName,m.email,img_path])
        //todo. switch the domain
        let mailResult = await Tool.sendEmailToActive(m.nickName,m.email,config.emailPath + "#/active/"+id+"/" + activityCode)
        ctx.rest(Result.create(0))
      },
    //todo active route need change add the user id to tell the active is need or not
    'GET /api/active/:code': async (ctx, next) => {
        let code = ctx.params.code
        let sql = `select user_id from user where user_token = ?`
        let res = await DB.exec(sql,[Tool.md5(code)])
        if(res.code != 0){
            ctx.rest(res)
            return
        }
        if(res.data.length <= 0){
            ctx.rest(Result.create(101))
            return
        }
        //如果没错
        let user_id = res.data[0].user_id
        sql = "update  user set user_isValidate = 1, user_token = '' where user_id = ?"
        DB.exec(sql,[user_id])
        ctx.rest(Result.create(0))
      },
      //用户检查邮箱
    'POST /api/checkemail': async (ctx, next) => {
        var  t = ctx.request.body
        if (!t.email || !t.email.trim()) {
            ctx.rest(Result.create(10,{msg:'miss email'})) 
            return
        }

        if(Check.regexCheck(t.email,'email')){
            ctx.rest(Result.create(11,{msg:'email format wrong'})) 
            return 
        }
        let sql = 'select user_id from user_info where user_email = ? ' 
        let res =await DB.exec(sql,[t.email])
        if(res.code != 0){
            ctx.rest(res)
            return
        }
        if(res.data.length == 0){
            ctx.rest(Result.create(0))
            return
        }
        else{
            ctx.rest(Result.create(502))
            return
        }

      },
      //检查用户名合法
    'POST /api/checkusername': async (ctx, next) => {
        var  t = ctx.request.body
        if (!t.user_name || !t.user_name.trim()) {
            ctx.rest(Result.create(10,{msg:'miss userName'})) 
            return
        }

        let sql = 'select user_id from user where user_name = ? ' 
        let res =await DB.exec(sql,[t.user_name])
        if(res.code != 0){
            ctx.rest(res)
            return
        }
        if(res.data.length == 0){
            ctx.rest(Result.create(0))
            return
        }
        else{
            ctx.rest(Result.create(504))
            return
        }

      },
     //重新发邮件
    'GET /api/resendemail/:userid': async (ctx, next) => {
        let userid = ctx.params.userid
        let activityCode = (Math.random() * 100000000).toFixed(0)
        let sql = 'update user set user_token = ? where user_id = ?' 
        let res = await DB.exec(sql,[Tool.md5(activityCode),userid])
        sql = 'select user_real_name,user_email from user_detail where user_id = ?'
        res = await DB.exec(sql,[userid])
        let user = res.data[0]
        //DOTO switch the inner net to outer

        await Tool.sendEmailToActive(user.user_real_name,user.user_email,config.emailPath + "#/active/"+userid+"/" + activityCode)
        ctx.rest(Result.create(0))
     },
     //上传用户头像
   
    //获取重设码
    'POST /api/resetcode': async (ctx, next) => {
        var  t = ctx.request.body
        if (!t.email || !t.email.trim()) {
            ctx.rest(Result.create(10,{msg:'miss email'})) 
            return
        }
        if(Check.regexCheck(t.email,'email')){
            ctx.rest(Result.create(11,{msg:'email format wrong'})) 
            return 
        }
        let sql = 'select user_id,user_real_name from user_info where user_email = ? ' 
        let res =await DB.exec(sql,[t.email])
        if(res.code != 0){
            ctx.rest(res)
            return
        }
        if(res.data.length == 0){
            ctx.rest(Result.create(500))
            return
        }
        let user_id = res.data[0].user_id;
        let user_real_name = res.data[0].user_real_name;
        let reset_code = (Math.random() * 10000000).toString().slice(0,6)
        let md5_reset_code = Tool.md5(reset_code)
        sql = 'update user set user_token = ? where user_id = ?'
        res = await DB.exec(sql,[md5_reset_code,user_id])
        if(res.code != 0){
            ctx.rest(res)
            return
        }
        let mailResult = await Tool.sendEmailToReset(user_real_name, reset_code, t.email)
        ctx.rest(Result.create(0))
      },
   //重设密码
    'POST /api/resetpassword': async (ctx, next) => {
        var  t = ctx.request.body
        let emailResult = Check.regexCheck(t.email,'email')
        if(emailResult){
            let result = Result.create(11)
            result.cMsg = "email参数格式错误"
            result.msg = "email parament format wrong"
            ctx.rest(result)
            return
        }
        let codeResult = Check.checkNum(t,'code')
        if(codeResult){
            ctx.rest(codeResult)
            return
        }
        let passResult = Check.checkString(t,'password')
        if(passResult){
            ctx.rest(passResult)
            return
        }
        let email = t.email
        let code = t.code;
        let password =  Check.decryptyPass(t.password.trim())
        if(password == ""){
            ctx.rest(Result.create(501))
            return
        }

        
        let sql = 'select user_id from user_info where user_email = ? ' 
        let res =await DB.exec(sql,[t.email])
        if(res.code != 0){
            ctx.rest(res)
            return
        }
        if(res.data.length == 0){
            ctx.rest(Result.create(500))
            return
        }
        let user_id = res.data[0].user_id
        sql = 'select user_token from user where user_id = ' + user_id
        res = await DB.exec(sql)
        if(res.code != 0){
            ctx.rest(res)
            return
        } 
        let token = res.data[0].user_token
        if(token != Tool.md5(code)){
            ctx.rest(Result.create(102))
            return
        }
        sql = 'update user set user_password = ? where user_id = ?'
        res = await DB.exec(sql,[Tool.md5(password),user_id])
        ctx.rest(res)
      },
    //上传头像
    'POST /api/user/uploadHead/:userId/:token': async (ctx, next) => {
        //因为上传图片要很多时间，所以这埋在的checkToken时间就不够，就会有问题
       let result0 = await Check.checkToken(ctx,999999)
       if(result0.code != 0){
            ctx.rest(result0)
            return
       }
       let id = ctx.params.userId
       let token = ctx.params.token
       console.log("ctx.request.body.files")
       console.log(ctx.request.files)
       let  t = ctx.request.files.file
       let oldPath = t.path
       if (!fs.existsSync(oldPath)){
           ctx.rest(Result.create(9))
       }
       let fileType = t.type
       let extension = fileType.split('/')[1]
       let newFileName = id + '-' + new Date().getTime()+ '.' + extension
       let newPath =  path.join(__dirname,'../static/myimg/' + newFileName)
       fs.renameSync(oldPath,newPath)
       let urlPath = imgPath.imgPath +  "static/myimg/" + newFileName
       let userInsert = {
           user_id:id,
           user_image_url:urlPath
       }
       let res = await User.updateUserHead(userInsert)
       res.data = {url:urlPath}
       ctx.rest(res)
     },
    //获取个人信息
    'GET /api/user/:targetUserId/:userId/:token': async (ctx, next) => {
        //因为上传图片要很多时间，所以这埋在的checkToken时间就不够，就会有问题
        if (ctx.params.userId != 0){
            let res = await Check.checkToken(ctx,999999)
            if(res.code != 0){
                ctx.rest(res)
                return
            }
        }
       let targetUserId = ctx.params.targetUserId
       let userId =  ctx.params.userId
       //获取用户信息
       let res = await User.userInfoById(targetUserId)
       if(res.code != 0){
          ctx.rest(res)
          return
       }
       if(res.data.length == 0){
          ctx.rest(Result.create(500))
          return
       }
       let userInfo = res.data[0]
       if(!userInfo.article_count){
           userInfo.article_count = 0
       }
       //获取用户链接
       res = await Link.userLinks(targetUserId)
       if(res.code != 0){
          ctx.rest(res)
          return
       }
       userInfo.links = res.data
       //获取分类
       res = await Sort.sorts(targetUserId)
       if(res.code != 0){
          ctx.rest(res)
          return
       }
       userInfo.sorts = res.data
       userInfo.is_attention = false
       //获取用户的文章得的喜欢数
       userInfo.articles_be_liked_count = 0
       res = await DB.exec('select count(like_id) as count from like_article where article_id in (select article_id from article where user_id = 1 and article_status = 1)',[targetUserId])
       if (res.code == 0){
          userInfo.articles_be_liked_count = res.data[0].count
       }
       //获取是否关注
       if(userId >0){
           res = await DB.exec('select count(a_id) as count from user_attention where user_id = ? and attention_id = ?',[userId,targetUserId])
           if(res.code == 0){
               if(res.data[0].count == 0){
                    userInfo.is_attention = false
               }
               else{
                  userInfo.is_attention = true
               }
           }
       }
       ctx.rest(Result.create(0,userInfo))
     },
    //获取用户动态
    'GET /api/userdynamic/:userId/:index/:size': async (ctx, next) => {
       let pageResult = Check.checkPage(ctx)
       if(pageResult){
           ctx.rest(pageResult)
           return
       }
       let id = ctx.params.userId
       let index = parseInt(ctx.params.index)
       let size = parseInt(ctx.params.size)
       let sql = `select count(dynamic_id) as count from user_dynamic where dynamic_user_id = ?`
       let res = await DB.exec(sql,[id])
       if(res.code != 0){
           ctx.rest(res)
           return
       }
       if(res.data[0].count == 0){
          ctx.rest(Result.createCount(0,0,[]))
          return
       }
       let count = res.data[0].count
       res = await Dynamic.userDynamic(id,index,size)
       if(res.code != 0){
         ctx.rest(res)
         return
       }
       let dynamics = res.data
       let sqlSubCommendIds = dynamics.map(s=>{
           if(s.dynamic_type_id == 7){
               return s.dynamic_target_id
           }
           return 0
       })
       let sqlMainCommendIds = dynamics.map(s=>{
           if(s.dynamic_type_id == 4){
               return s.dynamic_target_id
           }
           if(s.dynamic_type_id == 7){
               return s.dynamic_target_belong_id
           }
           return 0
       })
       let sqlArticlesIds =  dynamics.map(s=>{
           if(s.dynamic_type_id == 4){
               return s.dynamic_target_belong_id
           }
           if(s.dynamic_type_id == 1){
               return s.dynamic_target_id
           }
           return 0
       })
       let sqlLikeArticles = dynamics.map(s=>{
          if(s.dynamic_type_id == 12 || s.dynamic_type_id == 13){
             return s.dynamic_target_belong_id
           }
            return 0
        })
        let sqlAttentionUsers = dynamics.map(s=>{
            if(s.dynamic_type_id == 10 || s.dynamic_type_id == 11){
               return s.dynamic_target_belong_id
             }
             return 0
        })
       if(sqlSubCommendIds.length > 0){
            sql =  `select comment_id,comment_target_user_id,comment_target_id,comment_content,commenter_user_id,
                   comment_time,comment_type,comment_scope FROM user_sub_comment where comment_id in (` + sqlSubCommendIds.join(',') + `)`
            res = await DB.exec(sql)
            if(res.code != 0){
                ctx.rest(res)
                return
            }
            for(var day of dynamics){
                let com = res.data.find(s=>{
                    return s.comment_id == day.dynamic_target_id && day.dynamic_type_id == 7
                })
                if(com){
                    day.selfObject = com
                }
                else{
                    day.selfObject = {}
                }
            }
       }

       if(sqlMainCommendIds.length > 0){
            sql =  `select comment_id,comment_target_user_id,comment_target_id,comment_content,commenter_user_id,
            (select user_real_name from user_info where user_info.user_id = user_comment.commenter_user_id) as user_real_name,
                    comment_time FROM user_comment where comment_id in (` + sqlMainCommendIds.join(',') + `)`
            res = await DB.exec(sql)
            if(res.code != 0){
                ctx.rest(res)
                return
            }
            for(var day of dynamics){
                if(day.dynamic_type_id == 7){
                    let com = res.data.find(s=>{
                       return s.comment_id == day.dynamic_target_belong_id
                    })
                    if(com){
                        day.targetObject = com
                    }
                    else{
                        day.targetObject = {}
                    }
                }
                if(day.dynamic_type_id == 4){
                    let  com  =  res.data.find(s=>{
                       return s.comment_id == day.dynamic_target_id
                    })
                    if(com){
                        day.selfObject = com
                    }
                    else{
                        day.selfObject = {}
                    }
                }
            }
       }
       
       if(sqlArticlesIds.length > 0){
            sql = `select article_id,article_name,article_create_time,article_brief,article_main_img,article_click,article_status,(select sort_article_name from article_sort where  article_sort.sort_article_id = article.article_sort_id) 
                 as article_sort_name ,(select user_real_name from user_info where user_info.user_id = article.user_id) as user_real_name, (select count(comment_id) from user_comment where user_comment.comment_target_id =
                 article.article_id) as comment_count from article where article_id in (  ` + sqlArticlesIds.join(',') + `)`
            res = await DB.exec(sql)
            if(res.code != 0){
                ctx.rest(res)
                return
            }
            for(var day of dynamics){
                if(day.dynamic_type_id == 4){
                    let art = res.data.find(s=>{
                        return s.article_id == day.dynamic_target_belong_id && day.dynamic_type_id == 4
                    })
                    if(art){
                        day.targetObject = art
                    }
                    else{
                        day.targetObject = {}
                    }
                }
                if(day.dynamic_type_id == 1){
                    let art =  res.data.find(s=>{
                        return s.article_id == day.dynamic_target_id && day.dynamic_type_id == 1
                    })
                    if(art){
                        day.selfObject = art
                    }
                    else{
                        day.selfObject = {}
                    }
                }
                
            }
       }
       if(sqlLikeArticles.length > 0){
            sql = `select * from article_related_info  where  article_id in (` + sqlLikeArticles.join(',') + `)`
            res = await DB.exec(sql)
            if(res.code != 0){
                ctx.rest(res)
                return
            }
            for(var day of dynamics){
                if(day.dynamic_type_id == 12 || day.dynamic_type_id == 13){
                    let art = res.data.find(s=>{
                        return s.article_id == day.dynamic_target_belong_id && (day.dynamic_type_id == 12 || day.dynamic_type_id == 13)
                    })
                    day.selfObject = art
                }
            }
       }
       if(sqlAttentionUsers.length > 0){
          sql = `select user_id,user_real_name,user_image_url from user_info where user_id in (` + sqlAttentionUsers.join(',') + `)`
          res =  res = await DB.exec(sql)
          if(res.code != 0){
              ctx.rest(res)
              return
          }
          for(var day of dynamics){
            if(day.dynamic_type_id == 10 || day.dynamic_type_id == 11){
                let user = res.data.find(s=>{
                    return s.user_id == day.dynamic_target_belong_id && (day.dynamic_type_id == 10 || day.dynamic_type_id == 11)
                })
                day.selfObject = user
            }
        }
       }
       ctx.rest(Result.createCount(0,count,dynamics))
     },
    //获取用户评论
    'GET /api/usercomment/:userId/:index/:size': async (ctx, next) => {
       let pageResult = Check.checkPage(ctx)
       if(pageResult){
           ctx.rest(pageResult)
           return
       }
       let index = parseInt(ctx.params.index)
       let size = parseInt(ctx.params.size)
       let id = ctx.params.userId
       let sql = `select count(comment_id) as count from user_comments where commenter_user_id = ?  and delete_flag = 0`
       let res = await DB.exec(sql,[id])
       if(res.code != 0){
           ctx.rest(res)
           return
       }
       if(res.data[0].count == 0){
           ctx.rest(Result.createCount(0,0,[]))
           return
       }
       let count = res.data[0].count
       sql = `select * from user_comments where commenter_user_id = ? and delete_flag = 0 order by comment_time desc limit ?,?`
       res = await DB.exec(sql,[id,index*size,size])
       if(res.code != 0){
           ctx.rest(res)
           return
       }
       let comments = res.data
       let articleIds = comments.map(s=>{
           if(s.comment_scope == 0){
               return s.comment_target_id
           }
           else{
               return 0
           }
       })
       if(articleIds.length > 0){
           sql = `select article_id,article_name,article_create_time,article_release_time,article_ip,article_click,article_sort_id,
           user_id,article_type_id,article_type,article_brief,article_main_img,(select user_real_name from user_info where user_info.user_id = article.user_id) as user_real_name, 
           (select count(comment_id) from user_comment where user_comment.comment_target_id =
                 article.article_id) as comment_count from article where article_id in (` + articleIds.join(',') + `)`
           res = await DB.exec(sql)
           if(res.code != 0){
               ctx.rest(res)
               return
           }
           for(let com of comments){
               let art = res.data.find(s=>{
                   return s.article_id == com.comment_target_id
               })
               com.target = art
           }
       }
       let subIds =  comments.map(s=>{
           if( s.comment_scope > 0)
                return s.comment_target_id
            else
                return 0
       })
       sql = `select *,(select user_real_name from user_info where user_info.user_id = user_comment.commenter_user_id) as user_real_name
        from user_comment where comment_id in (`+subIds.join(',') + `) and delete_flag = 0`
       res = await DB.exec(sql)
       if(res.code != 0){
           ctx.rest(res)
           return
       }
       for(let com of comments){
           if(com.comment_scope > 0){
               let art = res.data.find(s=>{
                    return s.comment_id == com.comment_scope
                })
                console.log(art)
                com.target = art
           }
       }
       ctx.rest(Result.createCount(0,count,comments))
     },
     //获取用户喜欢的文章
    'GET /api/userliked/:userId/:index/:size': async (ctx, next) => {
        let pageResult = Check.checkPage(ctx)
        if(pageResult){
            ctx.rest(pageResult)
            return
        }
        let index = parseInt(ctx.params.index)
        let size = parseInt(ctx.params.size)
        let id = ctx.params.userId
        let sql = `select count(like_id) as count from like_article where user_id = ?`
        let res = await DB.exec(sql,[id])
        if(res.code != 0){
            ctx.rest(res)
            return
        }
        if(res.data[0].count == 0){
            ctx.rest(Result.createCount(0,0,[]))
            return
        }
        let count = res.data[0].count
        res = await DB.exec("select article_id from like_article where user_id = ? order by like_time desc limit ?,?",[id,index*size,size])
        if(res.code != 0){
            ctx.rest(res)
            return
        }
        let articles = res.data
        let articleIds = articles.map(s=>{
            return s.article_id
        })
        sql = `select * from article_related_info where  article_id in (` + articleIds.join(',') + `)`
        //注意，这进而是有被删除的文章的，因为我没有完全删除。
        //所以如果喜欢的文章被删除的话，这里就要产品来判断还要不要返回给已经设为喜欢的文章的用户了
        //这里我就直接返回了
        res = await DB.exec(sql)
        if(res.code != 0){
            ctx.rest(res)
            return
        }
        ctx.rest(Result.createCount(0,count,res.data))    
      },
     //获取用户收藏的文章 
    'GET /api/usercollected/:userId/:index/:size': async (ctx, next) => {
        let pageResult = Check.checkPage(ctx)
        if(pageResult){
            ctx.rest(pageResult)
            return
        }
        let index = parseInt(ctx.params.index)
        let size = parseInt(ctx.params.size)
        let id = ctx.params.userId
        let sql = `select count(collect_id) as count from collect_article where user_id = ?`
        let res = await DB.exec(sql,[id])
        if(res.code != 0){
            ctx.rest(res)
            return
        }
        if(res.data[0].count == 0){
            ctx.rest(Result.createCount(0,0,[]))
            return
        }
        let count = res.data[0].count
        res = await DB.exec("select article_id from collect_article where user_id = ? order by collect_time desc limit ?,?",[id,index*size,size])
        if(res.code != 0){
            ctx.rest(res)
            return
        }

        let articleIds = res.data.map(s=>{
            return s.article_id
        })
        sql = `select * from article_related_info where  article_id in (` + articleIds.join(',') + `)`
        //注意，这进而是有被删除的文章的，因为我没有完全删除。
        //所以如果收藏的文章被删除的话，这里就要产品来判断还要不要返回给已经设为收藏的文章的用户了
        //这里我就直接返回了
        res = await DB.exec(sql)
        if(res.code != 0){
            ctx.rest(res)
            return
        }
        ctx.rest(Result.createCount(0,count,res.data))    
      },
    //获取用户关注的人  
    'GET /api/userattentioned/:userId/:index/:size': async (ctx, next) => {
        let pageResult = Check.checkPage(ctx)
        if(pageResult){
            ctx.rest(pageResult)
            return
        }
        let index = parseInt(ctx.params.index)
        let size = parseInt(ctx.params.size)
        let id = ctx.params.userId
        let sql = `select count(a_id) as count from user_attention where user_id = ?`
        let res = await DB.exec(sql,[id])
        if(res.code != 0){
            ctx.rest(res)
            return
        }
        if(res.data[0].count == 0){
            ctx.rest(Result.createCount(0,0,[]))
            return
        }
        let count = res.data[0].count
        res = await DB.exec("select * from user_attention where user_id = ? order by attention_time desc limit ?,?",[id,index*size,size])
        if(res.code != 0){
            ctx.rest(res)
            return
        }
        ctx.rest(Result.createCount(0,count,res.data))    
    },
    //获取用户关注的人  
    'GET /api/userattentioned/:userId/': async (ctx, next) => {
        let id = ctx.params.userId
        let sql = `select count(a_id) as count from user_attention where user_id = ?`
        let res = await DB.exec(sql,[id])
        if(res.code != 0){
            ctx.rest(res)
            return
        }
        if(res.data[0].count == 0){
            ctx.rest(Result.createCount(0,0,[]))
            return
        }
        let count = res.data[0].count
        res = await DB.exec("select * from user_attention where user_id = ? order by attention_time desc",[id])
        if(res.code != 0){
            ctx.rest(res)
            return
        }
        let userIds = res.data.map(s=>{
            return s.attention_id
        })
        res = await DB.exec(`select user_id,user_real_name,user_image_url from user_info where user_id in (` + userIds.join(',') + `)`)
        if(res.code != 0){
            ctx.rest(res)
            return
        }
        ctx.rest(Result.createCount(0,count,res.data))    
    },
    //用户收藏文章
    'GET /api/usersetcollect/:articleId/:isCollect/:userId/:token': async (ctx, next) => {
        var  t = ctx.params
        console.log(t)
        let checkResult = Check.checkNum(t,'userId')
        if(checkResult){
            ctx.rest(checkResult)
        }
        checkResult = Check.checkNum(t,'articleId')
        if(checkResult){
            ctx.rest(checkResult)
        }
        checkResult = Check.checkNum(t,'isCollect')
        if(checkResult){
            ctx.rest(checkResult)
        }
        checkResult = await Check.checkToken(ctx)
       if(checkResult.code != 0){
            ctx.rest(checkResult)
            return
       }
       let isCollect = ctx.params.isCollect
       let id = ctx.params.userId
       let articleId =  ctx.params.articleId
       let sql = ''
       let res = null
       if(isCollect == 0){
          sql = 'delete from collect_article where user_id = ? and article_id = ?'
          res =  await DB.exec(sql,[id,articleId])
       }
       else{
        res = await DB.exec('select count(collect_id) as count from collect_article where article_id = ? and user_id = ?',[articleId,id])
        if(res.data[0]['count'] == 0){
            sql = 'insert into  collect_article (collect_id,user_id,article_id,collect_time) values (0,?,?,?)'
            res =  await DB.exec(sql,[id,articleId,Date.parse(new Date())])
            let collectId = res.data.id
            let dynamic = new Dynamic(id,collectId,articleId,13,0)
            await Dynamic.save(dynamic)
        }
        
        
       }
       ctx.rest(res || Result.create(-50))
    },
    //用户喜欢文章
    'GET /api/usersetlike/:articleId/:isLike/:userId/:token': async (ctx, next) => {
        var  t = ctx.params
        let checkResult = Check.checkNum(t,'userId')
        if(checkResult){
            ctx.rest(checkResult)
        }
        checkResult = Check.checkNum(t,'articleId')
        if(checkResult){
            ctx.rest(checkResult)
        }
        checkResult = Check.checkNum(t,'isLike')
        if(checkResult){
            ctx.rest(checkResult)
        }
       checkResult = await Check.checkToken(ctx)
       if(checkResult.code != 0){
            ctx.rest(checkResult)
            return
       }
       let isLike = ctx.params.isLike
       let id = ctx.params.userId
       let articleId =  ctx.params.articleId
       let sql = ''
       let res = null
       if(isLike == 0){
          sql = 'delete from like_article where user_id = ? and article_id = ?'
          res =  await DB.exec(sql,[id,articleId])
       }
       else{
        res = await DB.exec('select count(like_id) as count from like_article where article_id = ? and user_id = ?',[articleId,id])
        let count = res.data[0]['count']
        if(count == 0){
            sql = 'insert into  like_article (like_id,user_id,article_id,like_time) values (0,?,?,?)'
            res =  await DB.exec(sql,[id,articleId,Date.parse(new Date())])
            let likeId = res.data.id
            let dynamic = new Dynamic(id,likeId,articleId,12,0)
            await Dynamic.save(dynamic)
        } 
      
       }
       ctx.rest(res || Result.create(-50))
    },
    //用户关注某人
    'GET /api/usersetattention/:targetUserId/:isAttention/:userId/:token': async (ctx, next) => {
        var  t = ctx.params
        let checkResult = Check.checkNum(t,'userId')
        if(checkResult){
            ctx.rest(checkResult)
        }
        checkResult = Check.checkNum(t,'targetUserId')
        if(checkResult){
            ctx.rest(checkResult)
        }
        checkResult = Check.checkNum(t,'isAttention')
        if(checkResult){
            ctx.rest(checkResult)
        }
       checkResult = await Check.checkToken(ctx)
       if(checkResult.code != 0){
            ctx.rest(checkResult)
            return
       }
       let isAttention = ctx.params.isAttention
       let id = ctx.params.userId
       let targetUserId =  ctx.params.targetUserId
       let sql = ''
       let res = null
       if(isAttention == 0){
          sql = 'delete from user_attention where user_id = ? and attention_id = ?'
          res =  await DB.exec(sql,[id,targetUserId])
          let dynamic = new Dynamic(id,0,targetUserId,11,0)
          await Dynamic.save(dynamic)
       }
       else{
        res = await DB.exec('select count(a_id) as count from user_attention where attention_id = ? and user_id = ?',[targetUserId,id])
        let count = res.data[0]['count']
        if(count == 0){
            sql = 'insert into  user_attention (a_id,user_id,attention_id,attention_time) values (0,?,?,?)'
            res =  await DB.exec(sql,[id,targetUserId,Date.parse(new Date())])
            let aId = res.data.id
            let dynamic = new Dynamic(id,aId,targetUserId,10,0)
            await Dynamic.save(dynamic)
        } 
      
       }
       ctx.rest(res || Result.create(-50))
    },
    //用户更新基本信息
    'POST /api/user/updatebasic': async (ctx, next) => {
        var  t = ctx.request.body
        let userIdResult = Check.checkNum(t,'user_id')
        if(userIdResult){
            ctx.rest(userIdResult)
        }
        let userRealNameResult = Check.checkString(t,'user_real_name')
        if(userRealNameResult){
            ctx.rest(userRealNameResult)
        }
        let conditionPhone = ''
        if(t.user_phone){
            if(Check.regexCheck(t.user_phone,'cellphone')){
                ctx.rest(Result.create(11,{msg:'cellphone format wrong'})) 
                return 
            } 
            conditionPhone = ', user_phone = "' +  t.user_phone + '"'
        }
        let conditionQQ = ''
        if(t.user_qq){
            if(Check.regexCheck(t.user_qq,'qq')){
                ctx.rest(Result.create(11,{msg:'qq format wrong'})) 
                return 
            }
            conditionQQ = ' , user_qq =  "' + t.user_qq  + '"'
        }
        let conditionAddress = ''
        if(t.user_address){
            conditionAddress = ', user_address =  "' + t.user_address + '"'
        } 
        let user_id = t.user_id
        let user_real_name = t.user_real_name
        let sql = ''
        let res = {}
        //need check the user_name is valid
        if(t.user_name){
            sql = 'update user set user_name = ? where user_id = ?'
            res = await DB.exec(sql,[t.user_name,user_id])
            if(res.code != 0){
                ctx.rest(res)
            }
        }
        sql = 'update user_info set user_real_name = ? ' + conditionAddress + conditionPhone + conditionQQ + ' where user_id = ?'
        res = await DB.exec(sql,[user_real_name,user_id]) 
        ctx.rest(res)
     },
     //用户更新个人信息
    'POST /api/user/updateindividual': async (ctx, next) => {
        var  t = ctx.request.body
        let userIdResult = Check.checkNum(t,'user_id')
        if(userIdResult){
            ctx.rest(userIdResult)
            return
        }
        let userGenderResult = Check.checkNum(t,'user_gender')
        if(userGenderResult){
            ctx.rest(userGenderResult)
            return
        }
        let conditionBirthday = ''
        if(t.user_birthday && t.user_birthday != '0'){
            let userBirthdayResult = Check.checkNum(t,'user_birthday')
            if(userBirthdayResult){
                ctx.rest(userBirthdayResult) 
                return 
            } 
            conditionBirthday = ', user_birthday = ' +  t.user_birthday
        }
        let conditionEditType = ''
        if(t.edit_type){
            let edit_typeResult = Check.checkNum(t,'edit_type')
            if(edit_typeResult){
                ctx.rest(edit_typeResult) 
                return 
            } 
            conditionEditType = ', user_editor_type = ' +  t.edit_type
        }
        if(t.links){
            let links = JSON.parse(t.links)
            for(let l of links){
                let urlResult = Check.regexCheck(l.link_url,"url")
                if(urlResult){
                     ctx.rest(Result.create(11))
                     return  
                }
            }
        }
        let user_id = t.user_id
        let sql = ''
        let res = {}
        
        //need check the user_name is valid
        sql = 'update user_info set user_gender = ? ' + conditionBirthday + conditionEditType+' where user_id = ?'
        res = await DB.exec(sql,[t.user_gender,user_id]) 
        if(res.code != 0){
            ctx.rest(res)
            return
        }
        if(t.user_description){
            sql = 'update user_info set user_description = ? where user_id = ?'
            res = await DB.exec(sql,[t.user_description,user_id]) 
            if(res.code != 0){
                ctx.rest(res)
                return
            }
        }

        if(t.user_says){
            sql = 'update user_info set user_says = ? where user_id = ?'
            res = await DB.exec(sql,[t.user_says,user_id]) 
            if(res.code != 0){
                ctx.rest(res)
                return
            }
        }
        if(t.links){
            let links = JSON.parse(t.links)
            for(let l of links){
                let link = new Link(l.link_name,l.link_url,"")
                link.link_id = l.link_id
                link.link_user_id = user_id
                link.link_type = 1
                await Link.update(link)
            }
        }
 
        
        ctx.rest(Result.create(0))
      },
      //用户更新密码
    'POST /api/user/updatepassword': async (ctx, next) => {
        var  t = ctx.request.body
        let userIdResult = Check.checkNum(t,'user_id')
        if(userIdResult){
            ctx.rest(userIdResult)
            return
        }
        let userOldPassResult = Check.checkString(t,'old_password')
        if(userOldPassResult){
            ctx.rest(userOldPassResult)
            return
        }
        let userNewPassResult = Check.checkString(t,'new_password')
        if(userNewPassResult){
            ctx.rest(userNewPassResult)
            return
        }
        
    
        let user_id = t.user_id



        let old_password =  Check.decryptyPass(t.old_password.trim())
        if(old_password == ""){
            ctx.rest(Result.create(501))
            return
        }
        let new_password =  Check.decryptyPass(t.new_password.trim())
        if(new_password == ""){
            ctx.rest(Result.create(501))
            return
        }
        if(old_password == new_password){
            ctx.rest(Result.create(505))
            return
        }
        let sql = 'select user_id,user_password,user_name from user where user_id = ?'
        let res = await DB.exec(sql,[user_id])
        if(Tool.md5(old_password) != res.data[0].user_password){
            ctx.rest(Result.create(501))
            return
        }
        let user_name = res.data[0].user_name
        if(user_name.indexOf('test') >= 0){
            ctx.rest(Result.create(506))
            return
        }
        
        sql = 'update user set user_password = ? where user_id = ?'
        res = await DB.exec(sql,[Tool.md5(new_password),user_id])
        ctx.rest(res)
      },
}


