const APIError = require('../rest').APIError;
const Link = require('../model/link')
const Result = require('../model/result.js')
const Tool = require('../tool/tool')
const Check = require('../tool/check')
const DB = require('../sqlhelp/mysql')
module.exports = {
    'POST /api/link/:userId/:token': async (ctx, next) => {
        let tokenResult = await Check.checkToken(ctx)
        if(tokenResult.code != 0){
            ctx.rest(tokenResult)
            return
        }
        var  id = ctx.params.userId,
            token = ctx.params.token,
            t = ctx.request.body;
        let links = []
        for(let i = 0; i< 10;i++){
            if(t[i]){
                //这里就不做Validate了
                let l = new Link(t[i].link_name,t[i].link_url,'')
                l.link_id = t[i].link_id
                l.link_type = 1
                l.link_user_id = id
                links.push(l)
            }
        }
        if(links.length == 0){
            ctx.rest(Result.create(10))
            return
        }

        let actions = []
        links.map(s=>{
            return actions.push( Link.update(s))
        })
        
        let result = await Promise.all(actions)
        if(Tool.getType(result) == "Array"){
            ctx.rest(Result.create(0)) 
        }
        else{
            ctx.rest(result) 
        }
        
     
    },
    'GET /api/link/:userId/': async (ctx, next) => {
       let id = ctx.params.userId
       let result =await Link.userLinks(id)
       ctx.rest(result)  
    },
    'POST /api/link/:linkId/:userId/:token': async (ctx, next) => {
        let tokenResult = await Check.checkToken(ctx)
        if(tokenResult.code != 0){
            ctx.rest(tokenResult)
            return
        }
       var  id = ctx.params.userId,
            link_id =  ctx.params.linkId,
            token = ctx.params.token,
            t = ctx.request.body;
        if(!t.link_name || !t.link_name.trim()) {
            ctx.rest(Result.create(10,{msg:'miss link_name'})) 
            return
        }
        if (!t.link_url || !t.link_url.trim()) {
            ctx.rest(Result.create(10,{msg:'miss link_url'})) 
            return
        }
        //需要正则check
        let link = new Link(t.link_name,t.link_url,t.link_logo||'')
        link.link_id = link_id
        link.link_type = 0
        link.show_order = t.show_order
        link.link_user_id = id
        let res = await Link.update(link)
         ctx.rest(res)  
    },

    'DELETE /api/link/:linkId/:userId/:token': async (ctx, next) => {
        let tokenResult = await Check.checkToken(ctx)
        if(tokenResult.code != 0){
            ctx.rest(tokenResult)
            return
        }
       let id = ctx.params.userId
       let token = ctx.params.token
       let link_id = ctx.params.linkId
       let result =await Link.deleteLink(link_id)
       ctx.rest(result)  
    },
}

