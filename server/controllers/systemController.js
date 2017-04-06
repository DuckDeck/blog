const APIError = require('../rest').APIError;
const System = require('../model/system')
const Result = require('../model/result.js')
const Check = require('../tool/check')
const Tool = require('../tool/tool')
module.exports = {
    'POST /api/system/:mId/:token': async (ctx, next) => {
        let tokenResult = await Check.checkManageToken(ctx)
        if(tokenResult.code != 0){
            ctx.rest(tokenResult)
            return
        }
        var  id = ctx.params.userId,
            token = ctx.params.token,
            t = ctx.request.body;
        if (!t.blog_name || !t.blog_name.trim()) {
            ctx.rest(Result.create(10,{msg:'miss blog_name'})) 
            return
        } 
        if (!t.blog_desc || !t.blog_desc.trim()) {
            ctx.rest(Result.create(10,{msg:'miss blog_desc'})) 
            return
        } 
        if (!t.blog_keyword || !t.blog_keyword.trim()) {
            ctx.rest(Result.create(10,{msg:'miss blog_keyword'})) 
            return
        } 
        let sys = new System(t.blog_name,t.blog_name,t.blog_desc,t.blog_keyword)
        let result = await System.update(sys)
        ctx.rest(result) 
     
    },
    'GET /api/manage/system/:mId/:token': async (ctx, next) => {
       let tokenResult = await Check.checkManageToken(ctx)
       if(tokenResult.code != 0){
            ctx.rest(tokenResult)
            return
       }
       let id = ctx.params.mId
       let token = ctx.params.token
       let result = await System.systemInfo()
       
       ctx.rest(Tool.convertResultData(result))  
    },


}

