
const db = require('../sqlhelp/mysql') 
const Tool = require('../tool/tool')
const sqls = {
    insert:'insert into user values(0,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
    checkLogin:'select * from user where user_name = ?',
    userInfoById:`select user_name,user_phone,user_gender,user_qq,user_email,
    user_address,user_mark,user_rank_id,user_image_url,user_says from user where user_id = ?`
}
class User{
    constructor(userName,password){
        this.user_group_id = 0
        this.user_name = userName
        this.user_password = Tool.md5(password)
        this.user_phone = 0
        this.user_gender = '?'
        this.user_qq = 0
        this.user_email = '?'
        this.user_address = '?'
        this.user_mark = 0
        this.user_rank_id = 0
        this.user_last_login_ip = '?'
        this.user_birthday = 0
        this.user_description = "?"
        this.user_image_url = '?'
        this.user_register_time = 0
        this.user_register_ip = '?'
        this.user_last_update_time = 0
        this.user_says = '?' //'用户语录'
        this.user_lock = 0
        this.user_freeze = 0
        this.user_auth = '?'
    }

    static save(user){
       return db.exec(sqls.insert,[user.user_group_id,user.user_name,user.user_password,
        user.user_phone,user.user_gender,user.user_qq,
        user.user_email,user.user_address,user.user_mark,
        user.user_rank_id,user.user_last_login_ip,user.user_birthday,
        user.user_description,user.user_image_url,user.user_register_time,
        user.user_register_ip,user.user_last_update_time,user.user_says,
        user.user_lock,user.user_freeze,user.user_auth])
    }

    static createTestManager(){
        User.save(new User('test1','123456'))
    }

    static checkLogin(userName){
        return db.exec(sqls.checkLogin,[userName])
    }

    static userInfoById(user_id){
        return db.exec(sqls.userInfoById,[user_id])
    }
}
module.exports = User