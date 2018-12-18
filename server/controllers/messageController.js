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
        c.comment_unread_count = res.data[0].count
        res = await DB.exec('select count(id) as count from message_like where receive_id = ? and read_status = 0',[id])
        c.like_unread_count = res.data[0].count
        res = await DB.exec('select count(id) as count from message_attention where receive_id = ? and read_status = 0',[id])
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

    //根据类型获取新的消息列表 
    'GET /api/message/listbytype/:type/:userId/:token/:index/:size': async (ctx, next) => {
        let result = await Check.checkToken(ctx)
        if(result.code != 0){
            ctx.rest(result)
            return
        }
        result = Check.checkPage(ctx)
        if(result){
            ctx.rest(result)
            return
        }
        result = Check.checkNum(ctx.params,'type')
        if(result){
            ctx.rest(result)
            return
        }
        let index = parseInt(ctx.params.index)
        let size = parseInt(ctx.params.size)
        let user_id = ctx.params.userId
        let type = parseInt(ctx.params.type)
        let sql = ''
        switch (type) {
            case 1:  //评论信息
                sql = 'select * from message_comment where receive_id = ? order by message_time desc limit ?,?'
                result = await DB.exec(sql,[user_id,index,size])
                console.log(result)
                break;
            case 2: //用户喜欢信息
                sql = 'select * from message_like where receive_id = ? order by message_time desc limit ?,?'
                result = await DB.exec(sql,[user_id,index,size])
                break;
            case 3: //全部的关注
                sql = 'select * from message_attention where receive_id = ? order by message_time desc limit ?,?'
                result = await DB.exec(sql,[user_id,index,size])

                break;
            case 4: //全部最新的聊天 信息
                sql = 'SELECT sender_id,count(id) as count FROM chat_message where receive_id = ? group by  sender_id limit ?,?'
                result = await DB.exec(sql,[user_id,index,size])
            default:
                break;
        }
        let ids = null
        if(type != 1){
            ids = result.data.map(s=>{
                return s.sender_id
            })
            
        }
        else{
            ids = result.data.map(s=>{
                return s.commenter_id
            })
        }
        if(ids.length > 0){
            let tmp = new Set(ids)
            ids = [...tmp].join(',')
            sql = `select user_id,user_real_name,user_image_url from user_info where user_id in (` + ids + `)`
            let res = await DB.exec(sql)
            result.data = result.data.map(s=>{
                let info = res.data.find(k=>{
                    return k.user_id == s.sender_id || k.user_id == s.commenter_id
                })
                if(info != null){
                    s.user_info = info
                }
                return s
            })
        }
        if (type == 4) { //这里有优化的空间，应该不需要二次查询
            sql = `select id,sender_id,chat_content,time,chat_id from chat_message where id in (select max(id) from chat_message where sender_id in (` + ids +`) group by sender_id)` 
            let res = await DB.exec(sql)
            result.data = result.data.map(s=>{
                let chat = res.data.find(k=>{
                    return k.sender_id == s.sender_id
                })
                if(chat != null){
                    s.chat_info = chat
                }
                return s
            })
        }
        console.log(result)
        //这里要设计一下已读信息
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




























