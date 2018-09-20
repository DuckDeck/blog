
const db = require('../sqlhelp/mysql') 
const Tool = require('../tool/tool')
const sqls = {
   insertMessage:'insert into zoe_message values(?,?,?,?,?,?,?,?)'
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

    }
    
}
module.exports = Message