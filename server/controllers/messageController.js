const APIError = require('../rest').APIError;
const Result = require('../model/result.js')
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
        //换成聊天未读信息,未读信息没问题，因为未读信息肯定是别人发给自己的，所以可以用receive_id
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
        let peerIds = []
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
            case 4: //全部最新的聊天 信息,不能用receive_id和receive_id因为同样两个人聊天id是想反的，要用chat_id
                sql = 'SELECT chat_id,count(chat_id) as count FROM chat_message where receive_id = ? or sender_id = ? group by  chat_id limit ?,?'
                result = await DB.exec(sql,[user_id,user_id,index,size])
            default:
                break;
        }
        let ids = null
        if(type == 4){
            ids = result.data.map(s=>{
                return s.chat_id
            })
        }
        else if(type == 1){
           
            ids = result.data.map(s=>{
                return s.commenter_id
            })
            
        }
        else{
            ids = result.data.map(s=>{
                return s.sender_id
            })
        }
        if(ids.length > 0){
            let tmpIds = null
            if(type == 4){ //因为这里获取的是chat_id所以要转换一下
                let tmp = []
                for(let item of ids){
                   let t = item.split('_')
                   if(parseInt(t[0]) != parseInt(user_id)){
                     tmp.push(parseInt(t[0]))
                   }
                   if(parseInt(t[1]) != parseInt(user_id)){
                    tmp.push(parseInt(t[1]))
                  }
                }
                tmp = new Set(tmp)
                peerIds = [...tmp]
                tmpIds = peerIds.join(',')
                //处理一下聊天的对方ID，因为这里没有
                result.data.map(s=>{
                    peerIds.forEach(k=>{
                        if(s.chat_id.indexOf(k)>=0){
                            s.peer_id = k
                        }
                    })
                    return s
                })
            }
            else{
                let tmp = new Set(ids)
                tmpIds = [...tmp].join(',')
            }
            
            sql = `select user_id,user_real_name,user_image_url from user_info where user_id in (` + tmpIds + `)`
            let res = await DB.exec(sql)
            result.data = result.data.map(s=>{
                let info = res.data.find(k=>{
                    return k.user_id == s.sender_id || k.user_id == s.commenter_id || k.user_id == s.peer_id
                })
                if(info != null){
                    s.user_info = info
                }
                return s
            })
        }
        if (type == 4) {
            if(ids.length>0){
                let tmp = new Set(ids)
                ids = [...tmp]
                if(ids.length == 1){
                    ids = `\'` + ids[0] + `\'`
                }
                else{
                    ids = ids.map(s=>{
                        return `\'` + s + `\'`
                    }).join(',')
                }
                sql = `select id,sender_id,chat_content,time,chat_id from chat_message where id in (select max(id) from chat_message where chat_id in (` + ids +`) group by chat_id)` 
                console.log(sql)
                let res = await DB.exec(sql)
                result.data = result.data.map(s=>{
                    let chat = res.data.find(k=>{
                        return k.chat_id == s.chat_id
                    })
                    if(chat != null){
                        s.chat_info = chat
                    }
                    return s
                })
            }
            
        }
        console.log(result)
        //这里要设计一下已读信息
        switch (type) {
            case 1:
                 ids = result.data.map(s=>{
                     return s.id
                 })
                 console.log(ids)
                 if(ids.length > 0){
                     ids = ids.length == 1 ? ids[0] : ids.join(',')
                    sql = 'update message_comment set read_status = 1 where id in (' + ids + ')'
                    await DB.exec(sql)
                 }
                
                break;
            case 2:
                ids = result.data.map(s=>{
                    return s.id
                })
                if(ids.length > 0){
                    ids = ids.length == 1 ? ids[0] : ids.join(',')
                    sql = `update message_like set read_status = 1 where id in (` + ids + `)`
                    await DB.exec(sql)
                }
               
               break;
            case 3:
                ids = result.data.map(s=>{
                     return s.id
                 })
                 if(ids.length > 0){
                    ids = ids.length == 1 ? ids[0] : ids.join(',')
                     sql = `update message_attention set read_status = 1 where id in (` + ids + `)`
                    await DB.exec(sql)
                 }
                
                break;
            default:
                break;
        }
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
    'GET /api/manage/chatlist/:mId/:token/:index/:size': async (ctx, next) => {
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
        let sql = 'select chat_id from chat_message group by chat_id'
        let res = await DB.exec(sql)
        let count = res.data.length
        if(count == 0){
            ctx.rest(res)
            return
        }
        sql = 'select * from chat_message where id in (select max(id) from chat_message group by chat_id) order by id desc limit ?,?'
        res = await DB.exec(sql,[size * index,size])
        if(res.code != 0){
            ctx.rest(res)
            return
        }
        let id1 = res.data.map(s=>{
            return s.sender_id
        })
        let id2 = res.data.map(s=>{
            return s.receive_id
        })
        id1 = new Set(id1)
        id2 = new Set(id2)
        let ids = new Set([...id1, ...id2])
        ids = [...ids]
        if(ids.length > 0){
            ids = ids.length == 1 ? ids[0] : ids.join(',')
            sql = `select user_id,user_real_name,user_image_url from user_info where user_id in (` + ids + `)`
            let result = await DB.exec(sql)
            res.data = res.data.map(s=>{
                let info1 = result.data.find(k=>{
                    return k.user_id == s.sender_id
                })
                if(info1 != null){
                   s.info1 = info1
                }
                let info2 = result.data.find(k=>{
                    return k.user_id == s.receive_id
                })
                if(info2 != null){
                   s.info2 = info2
                }
                return s
            })
        }
        res.count = count
        ctx.rest(res)
    },

    'GET /api/manage/chatwithid/:chat_id/:mId/:token/:index/:size': async (ctx, next) => {
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
        let chat_id = ctx.params.chat_id
        let sql = 'select * from chat_message where chat_id = ? order by id desc limit ?,?'
        let res = await DB.exec(sql,[chat_id,size * index,size])
        ctx.rest(res)
    }

}