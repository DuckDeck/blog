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
    

    'GET /api/manage/chat/:chatId/:mId/:token/:index/:size': async (ctx, next) => {
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
        let chatId = ctx.params.chatId
        //一般取出20条信息
        let sql = 'select count(id) from chat_message where chat_id = ?'
        let res = await DB.exec(sql,[chatId])
        if(res.code != 0){
            ctx.rest(res)
            return
        }
        let count = res.data[0].count
        if(count <= 0){
            Result.createCount(0,0,[])
            return
        }
        sql = 'select * from chat_message where chat_id = ? order by id desc limit ?,?'
        res = await DB.exec(sql,[chatId,index * size,size])
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
}

