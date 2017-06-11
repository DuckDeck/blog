
const db = require('../sqlhelp/mysql') 
const Tool = require('../tool/tool')
const sqls = {
    insert:'insert into user values(0,?,?,?,?,?,?,?,?,?,?,?,?,?,0)',
    checkLogin:'select * from user where user_name = ?',
    checkLoginEmail:'select * from user_detail where user_email = ?',
    userInfoById:`select  user_id , user_name, user_real_name , user_phone , user_gender , 
    user_qq  , user_email, user_address, user_editor_type,user_mark,user_birthday,user_description,user_image_url, 
    user_last_update_time , user_says ,(select count(article_id) as article_count  from article where article.user_id = user_detail.user_Id and article_status = 1
               group by user_id) as article_count,(select count(comment_id) from user_comments where user_comments.commenter_user_id = user_detail.user_id
            ) as comment_count from user_detail where user_id = ?`,
    userInfoByIds:'SELECT  user_id,user_name,user_real_name,user_gender,user_image_url from user_detail where user_id in',
    updateUserHead:'update user_info set user_image_url = ? where user_id = ?'
}

class User{
    constructor(userName,password){
        this.user_group_id = 0
        this.user_name = userName
        this.user_password = Tool.md5(password)
        this.user_phone = ''
        this.user_gender = ' '
        this.user_qq = ''
        this.user_email = ' '
        this.user_address = ' '
        this.user_mark = 0
        this.user_rank_id = 0
        this.user_last_login_ip = ' '
        this.user_birthday = 0
        this.user_description = " "
        this.user_image_url = ' '
        this.user_register_time = 0
        this.user_register_ip = ' '
        this.user_last_update_time = 0
        this.user_says = ' ' //'用户语录'
        this.user_lock = 0
        this.user_freeze = 0
        this.user_auth = ' '
    }

    static save(user){
       return db.exec(sqls.insert,[user.user_group_id,user.user_name,user.user_password,
        user.token,1,0,user.user_register_time, user.user_register_ip,0,user.user_register_ip,
        user.user_lock,user.user_freeze,user.user_auth])
    }

    static createTestManager(){
        User.save(new User('test1','123456'))
    }

    static checkLogin(userName){
        return db.exec(sqls.checkLogin,[userName])
    }

    static checkLoginEmail(email){
        return db.exec(sqls.checkLoginEmail,[email])
    }

    static userInfoById(user_id){
        return db.exec(sqls.userInfoById,[user_id])
    }

    static userInfoByIds(ids){
        if(Tool.getType(ids) == "Array"){
            ids.sort()
            ids = ids.join(',')
        }
        return db.exec(sqls.userInfoByIds + '(' + ids + ')')
    }

    static updateUserHead(user){
        return db.exec(sqls.updateUserHead,[user.user_image_url,user.user_id])
    }

    static saveToken(token,user_id){
        return db.exec('update user set user_token = ? where user_id = ?',[token,user_id])
    }
    
}
module.exports = User