const Result = require('../model/result.js')
const Check = require('../tool/check')
const DB = require('../sqlhelp/mysql')
const Chat = require('../model/chat')
module.exports = {
    //因为web上一般是没有本地保存的？或许可以加上
    'GET /api/chat/unread/:id/:chatId/:userId/:token': async (ctx, next) => {
        let tokenResult = await Check.checkToken(ctx)
        if(tokenResult.code != 0){
            ctx.rest(tokenResult)
            return
        }
        let res = Check.checkNum(ctx.params,'id')
        if(res){
            ctx.rest(res)
            return
        }
        let id = ctx.params.id
        let chatId = ctx.params.chatId
        //一般取出20条信息
        res = await Chat.getChat(id,chatId)
        if(res.code == 0){
            res.data = res.data.sort((a,b)=>{
                return a.time - b.time
            })
        }
        let ids = res.data.map(s=>{
            return s.id
        })
        if(ids.length>0){
            ids = ids.length == 1 ? ids : ids.join(',')
            await DB.exec('update chat_message set send_status = 1 where id in (' + ids + ')')
        }
        ctx.rest(res)
    },
    

}

