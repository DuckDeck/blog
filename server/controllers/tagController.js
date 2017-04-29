const APIError = require('../rest').APIError;
 const Tag = require('../model/tag')
const Result = require('../model/result.js')
const Check = require('../tool/check')
module.exports = {
    'POST /api/tag/:userId/:token': async (ctx, next) => {
        let tokenResult = await Check.checkToken(ctx)
        if(tokenResult.code != 0){
            ctx.rest(tokenResult)
            return
        }
       var  id = ctx.params.userId,
            token = ctx.params.token,
            t = ctx.request.body;
        if (!t.tag || !t.tag.trim()) {
            ctx.rest(Result.create(10,{msg:'miss tag'})) 
            return
        } 
        let tag = new Tag(id,t.tag)
        let saveTagResult = await Tag.save(tag)
        ctx.rest(saveTagResult) 
     
    },
    'GET /api/tag/userid/:userId': async (ctx, next) => {
        let paraCheckResult = Check.checkNum(ctx.params,'userId')
        if(paraCheckResult){
            ctx.rest(paraCheckResult)
            return
        }
       let id = ctx.params.userId
       let tagResult =await Tag.tags(id)
       ctx.rest(tagResult)  
    },
     'DELETE /api/tag/:id/:userId/:token': async (ctx, next) => {
       let tokenResult = await Check.checkToken(ctx)
       if(tokenResult.code != 0){
            ctx.rest(tokenResult)
            return
       }
       let id = ctx.params.id
       let user_id = ctx.params.userId
       let token = ctx.params.token
       await Tag.deleteTag(id).then(function(result){
           ctx.rest(Result.create(0)) 
       }).catch(function(err){
            ctx.rest(err)  
       })   
    },

}

