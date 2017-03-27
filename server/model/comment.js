
const db = require('../sqlhelp/mysql') 
const Tool = require('../tool/tool')
const sqls = {
   insertMainComment:`insert into user_comment values(?,?,?,?,?,?,?,?,?)`,
   insertSubComment:`insert into user_sub_comment values(?,?,?,?,?,?,?,?)`

}
class Comment{
    constructor(comment_target_id,commenter_userId,commentContent){
       this.comment_id = 0
       this.comment_target_userId = 0
       this.comment_target_id = comment_target_id
       this.commentContent = commentContent
       this.commentLevel = 0
       this.commenter_id = commenter_userId
       this.commenter_ip = ''
       this.comment_time = 0
       this.comment_type_id = 0
       this.delete_flag = 0
    }
    
    static insertMainComment(comment){
        db.exec(sqls.insertMainComment,[comment.comment_id,comment.comment_target_userId,comment.comment_type_id,
        comment.comment_target_id,comment.commentContent,comment.commenter_id,
        comment.comment_time,comment.commenter_ip,comment.delete_flag,])
    }

    static insertSubComment(comment){
        db.exec(sqls.insertSubComment,[comment.comment_id,comment.comment_target_userId,
        comment.comment_target_id,comment.commentContent,comment.commenter_id,
        comment.comment_time,comment.commenter_ip,comment.delete_flag,])
    }

}
module.exports = Comment