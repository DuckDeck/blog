const db = require('../sqlhelp/mysql') 
const Tool = require('../tool/tool')
const sqls = {
   insert:`insert into chat_message values(?,?,?,?,?,?,?,?)`,
   sorts:`select * from article_sort where user_id = ?`,
   deleteSort:`delete from article_sort where sort_article_id = ?`,
}
class ChatInfo{
    constructor(id,chat_type,sender_id,receive_id,time,chat_id,send_status,chat_content){
        this.id = id
        this.chat_type = chat_type
        this.sender_id = sender_id
        this.receive_id = receive_id
        this.time = time
        this.chat_id = chat_id
        this.send_status = send_status
        this.chat_content = chat_content
    }

    static save(chat){
       return db.exec(sqls.insert,[chat.id, chat.chat_type,chat.sender_id,chat.receive_id,chat.time,chat.chat_id,chat.send_status,chat.chat_content])
    }
 

}
module.exports = ChatInfo