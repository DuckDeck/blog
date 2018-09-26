const APIError = require('../rest').APIError;
const Result = require('../model/result.js')
const fs = require('fs')
const Tool = require('../tool/tool')
const Check = require('../tool/check')
const Message = require('../model/message')

module.exports = {
    //管理用户
    'GET /api/message/havenewmessage/:userId/:token': async (ctx, next) => {
        let result = await Check.checkToken(ctx)
        if(result.code != 0){
            ctx.rest(result)
            return
        }
        let id = ctx.params.userId
        result = await Message.haveNewMessage(id)
        ctx.rest(result)
    },

    'GET /api/message/list/:userId/:token/:index/:size': async (ctx, next) => {
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
        let index = parseInt(ctx.params.index)
        let size = parseInt(ctx.params.size)
        let user_id = ctx.params.userId
        result = await Message.messageByReceiveId(user_id,index,size)
        ctx.rest(result)
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
        result = await Message.messageByReceiveIdWithType(user_id,type,index,size)
        ctx.rest(result)
    },
}




























