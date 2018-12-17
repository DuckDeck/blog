const APIError = require('../rest').APIError;
const Result = require('../model/result.js')
const fs = require('fs')
const Tool = require('../tool/tool')
const Check = require('../tool/check')
const DB = require('../sqlhelp/mysql')
module.exports = {
    //新消息个数
    'GET /api/message/newmessagecount/:userId/:token': async (ctx, next) => {
        let result = await Check.checkToken(ctx)
        if(result.code != 0){
            ctx.rest(result)
            return
        }
        let id = ctx.params.userId
        let c = {}
        let res = await DB.exec('select count(id) as count from message_comment where receive_id = ? and read_status = 0',[id])
        console.log(res)
        c.comment_unread_count = res.data[0].count
        res = await DB.exec('select count(id) as count from message_like where receive_id = ? and read_status = 0',[id])
        console.log(res)
        c.like_unread_count = res.data[0].count
        res = await DB.exec('select count(id) as count from message_attention where receive_id = ? and read_status = 0',[id])
        console.log(res)
        c.attention_unread_count = res.data[0].count
        // res = await DB.exec('select count(id) as count from chat_message where receive_id = ? and read_status = 0',[id])
        // console.log(res)

        // c.notice_unread_count = res.data[0].count
        //换成聊天未读信息
        res = await DB.exec('select count(id) as count from chat_message where receive_id = ? and send_status = 0',[id])
        c.notice_unread_count = res.data[0].count
        let count = c.comment_unread_count + c.like_unread_count + c.attention_unread_count + c.notice_unread_count
        ctx.rest(Result.createCount(0,count,c))
    },

   
    'GET /api/message/listbytype/:type/:userId/:token/:index/:size': async (ctx, next) => {
        let result = await Check.checkToken(ctx)
        if(result.code != 0){
            ctx.rest(result)
            return
        }
        result = Check.checkPage(ctx)
        if(result.code != 0){
            ctx.rest(result)
            return
        }
        result = Check.checkNum(ctx.params,'type')
        if(result.code != 0){
            ctx.rest(result)
            return
        }
        let index = parseInt(ctx.params.index)
        let size = parseInt(ctx.params.size)
        let user_id = ctx.params.userId
        let type = ctx.params.type
        
        ctx.rest(result)
    },

    'GET /api/message/setread/:type/:msgid/:userId/:token/': async (ctx, next) => {
        let result = await Check.checkToken(ctx)
        if(result.code != 0){
            ctx.rest(result)
            return
        }
        result = Check.checkNum(ctx.params,'type')
        if(result.code != 0){
            ctx.rest(result)
            return
        }
        result = Check.checkNum(ctx.params,'msgid')
        if(result.code != 0){
            ctx.rest(result)
            return
        }
        let user_id = ctx.params.userId
        let type = ctx.params.type
        
        result = await Message.messageByReceiveIdWithType(user_id,type,index,size)
        ctx.rest(result)
    },
}




























