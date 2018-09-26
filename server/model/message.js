const db = require('../sqlhelp/mysql') 
const Tool = require('../tool/tool')
const sqls = {
   insertMessage:'insert into zoe_message values(?,?,?,?,?,?,?,?)',
   updateReadStatus:`update zoe_message set read_status = 1 where id = ?`,
   messageByReceiveId:`select * from zoe_message where receive_id = ? order by time desc limit ? , ? `,
   messageByReceiveIdWithType:`select * from zoe_message where receive_id = ? and message_type = ? order by time desc limit ? , ? `,
   haveNewMessage:`select count(id) as count from zoe_message where receive_id = ? and read_status = 0`
}
class Message{
    constructor(message_type,sender_id,receive_id,time,read_status,target_id,content){
        this.id = 0
        this.message_type = message_type
        this.sender_id = sender_id
        this.receive_id = receive_id
        this.time = time
        this.read_status = read_status
        this.target_id = target_id
        this.content = content
    }
    static insertMesage(msg){
        return db.exec(sqls.insertMessage,[msg.id,msg.message_type,msg.sender_id,msg.receive_id,msg.time,msg.read_status,msg.target_id,msg.content])
    }
    static updateReadStatus(id){
        return db.exec(sqls.updateReadStatus,[id])
    }
    static messageByReceiveId(user_id,index=0,size=10){
        return db.exec(sqls.messageByReceiveId,[user_id,index,size])
    }
    static messageByReceiveIdWithType(user_id,msg_type,index=0,size=10){
        return db.exec(sqls.messageByReceiveId,[user_id,msg_type,index,size])
    }
    static haveNewMessage(user_id){
        return db.exec(sqls.haveNewMessage,[user_id])
    }
}
module.exports = Message