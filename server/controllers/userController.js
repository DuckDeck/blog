const APIError = require('../rest').APIError;
 const user = require('../model/user')
const Result = require('../model/result.js')
const Tool = require('../tool/tool')

module.exports = {
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
    'GET /api/user/:userId/:token': async (ctx, next) => {
        let tokenResult = await Tool.checkToken(ctx)
        if(tokenResult.code != 0){
            ctx.rest(tokenResult)
            return
        }
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

