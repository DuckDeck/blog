
const db = require('../sqlhelp/mysql') 
const Tool = require('../tool/tool')
const sqls = {
   insertError:'insert into blog_error values(0,?,?,?,?,?,?)',
}
class ErrorInfo{
    constructor(num,name,msg,desc,stack,time){
        this.error_num = num
        this.error_name = name
        this.error_message = msg
        this.error_desc = desc
        this.error_stack = stack
        this.error_time = time
    }
    static insert(err){
      return  db.exec(sqls.insertError,[err.error_num,err.error_name,err.error_message,err.error_desc,err.error_stack,err.error_time])
    }

}
module.exports = ErrorInfo
