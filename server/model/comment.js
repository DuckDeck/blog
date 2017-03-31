
const db = require('../sqlhelp/mysql') 
const Tool = require('../tool/tool')
const sqls = {
   insertMainComment:`insert into user_comment values(?,?,?,?,?,?,?,?,?)`,
   insertSubComment:`insert into user_sub_comment values(?,?,?,?,?,?,?,?,?,?)`,
   commentById:`SELECT comment_id,comment_target_user_id,comment_target_id,
comment_content,commenter_user_id,comment_time FROM user_comment where  comment_id = ? and delete_flag = 0`,
   subCommentById:`SELECT comment_id,comment_target_user_id,comment_target_id,
comment_content,commenter_user_id,comment_time,comment_type,comment_scope FROM 
user_sub_comment where  comment_scope = ? and delete_flag = 0`,
   newestComment:`select comment_id,comment_target_user_id,comment_target_id,
comment_content,commenter_user_id,comment_time from user_comment where comment_id in 
(select max(comment_id) from user_comment group by comment_target_id) and comment_target_id in `,
 mynewestComment:`select comment_id,comment_content, comment_time,(select user_name from user where user_id = user_comment.commenter_user_id) as commenter
  from user_comment where comment_target_user_id = ? union 
select comment_id,comment_content, comment_time,(select user_name from user where user_id = user_sub_comment.commenter_user_id) as commenter 
 from user_sub_comment where comment_target_user_id = ?`
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
       this.comment_type = 0
       this.comment_scope = 0
    }
    
    static insertMainComment(comment){
       return db.exec(sqls.insertMainComment,[comment.comment_id,comment.comment_target_userId,comment.comment_type_id,
        comment.comment_target_id,comment.commentContent,comment.commenter_id,
        comment.comment_time,comment.commenter_ip,comment.delete_flag,])
    }

    
    static insertSubComment(comment){
       return db.exec(sqls.insertSubComment,[comment.comment_id,comment.comment_target_userId,
        comment.comment_target_id,comment.commentContent,comment.commenter_id,
        comment.comment_time,comment.commenter_ip,comment.comment_type,comment.comment_scope,comment.delete_flag,])
    }

    static commentById(commendId){
        return db.exec(sqls.commentById,[commendId])
    }

    static subCommentById(commendId){
        return db.exec(sqls.subCommentById,[commendId])
    }

    static newestComment(article_ids){
        if(Tool.getType(article_ids) == "Array"){
            article_ids.sort()
            article_ids = article_ids.join(',')
         }
        return db.exec(sqls.newestComment + '('+ article_ids +')')
    }

    static mynewestComment(user_id){
        return db.exec(sqls.mynewestComment,[user_id,user_id])
    }
}
module.exports = Comment