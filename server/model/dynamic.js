
const db = require('../sqlhelp/mysql') 
const Tool = require('../tool/tool')
const sqls = {
   insert:`insert into user_dynamic values(0,?,?,?,?,?,?,?,?)`,
   dynamicByUserId:`select * from user_dynamic where dynamic_user_id = ? order by dynamic_oper_time desc limit ? ,?`
}
class Dynamic{
    constructor(dynamic_user_id,dynamic_target_id,dynamic_target_belong_id,dynamic_type_id,dynamic_oper_type){
        this.dynamic_id = 0
        this.dynamic_user_id = dynamic_user_id
        this.dynamic_target_id = dynamic_target_id
        this.dynamic_target_belong_id = dynamic_target_belong_id
        this.dynamic_type_id = dynamic_type_id
        switch(dynamic_type_id){
            case 1:
                this.dynamic_type_name = '发表了文章'
                break
            case 2:
                this.dynamic_type_name = '修改了文章'
                break
            case 3:
                this.dynamic_type_name = '删除了文章'
                break
            case 4:
                this.dynamic_type_name = '发布了评论' //大
                break
            case 5: 
                this.dynamic_type_name = '修改了评论' //大
                break
            case 6:
                this.dynamic_type_name = '删除了评论' //大
                break
            case 7:
                this.dynamic_type_name = '发布了评论' //小
                break
            case 8:
                this.dynamic_type_name = '修改了评论' //小
                break
            case 9:
                this.dynamic_type_name = '删除了评论' //小
                break
            case 10:
                this.dynamic_type_name = '关注了'
                break
            case 11:
                this.dynamic_type_name = '取消关注了'
                break
        }
        this.dynamic_oper_type = dynamic_oper_type
        
        this.dynamic_oper_name = '' //备用
     
        this.dynamic_oper_time = new Date().getTime()
    }

    static save(dynamic){
       return db.exec(sqls.insert,[dynamic.dynamic_user_id,dynamic.dynamic_target_id,dynamic.dynamic_target_belong_id,
       dynamic.dynamic_type_id,dynamic.dynamic_type_name,dynamic.dynamic_oper_type,dynamic.dynamic_oper_name,dynamic.dynamic_oper_time])
    }

    static userDynamic(id,index = 0,size = 10){
        return db.exec(sqls.dynamicByUserId,[id,index * size,size])
    }
}
module.exports = Dynamic