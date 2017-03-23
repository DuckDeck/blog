const APIError = require('../rest').APIError;
 const Link = require('../model/link')
const Result = require('../model/result.js')
const Tool = require('../tool/tool')

module.exports = {
    'POST /api/link/:userId/:token': async (ctx, next) => {
        let tokenResult = await Tool.checkToken(ctx)
        if(tokenResult.code != 0){
            ctx.rest(tokenResult)
            return
        }
        var  id = ctx.params.userId,
            token = ctx.params.token,
            t = ctx.request.body;
        console.log(t)
        // if (!t.blog_name || !t.blog_name.trim()) {
        //     ctx.rest(Result.create(10,{msg:'miss blog_name'})) 
        //     return
        // } 
        // if (!t.blog_desc || !t.blog_desc.trim()) {
        //     ctx.rest(Result.create(10,{msg:'miss blog_desc'})) 
        //     return
        // } 
        // if (!t.blog_keyword || !t.blog_keyword.trim()) {
        //     ctx.rest(Result.create(10,{msg:'miss blog_keyword'})) 
        //     return
        // } 
        // let sys = new System(t.blog_name,t.blog_name,t.blog_desc,t.blog_keyword)
        // let result = await System.update(sys)
        // ctx.rest(result) 
        ctx.rest(Result.create(0)) 
     
    },
    'GET /api/link/:userId/:token': async (ctx, next) => {
        let tokenResult = await Tool.checkToken(ctx)
        if(tokenResult.code != 0){
            ctx.rest(tokenResult)
            return
        }
       let id = ctx.params.userId
       let token = ctx.params.token
       let result =await Link.userLinks(id)
       ctx.rest(result)  
    },


}

