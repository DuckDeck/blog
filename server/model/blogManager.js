
const db = require('../sqlhelp/mysql') 
const Tool = require('../tool/tool')
const sqls = {
    insert:'insert into user blog_manager(0,?,?,?,?,?,?,?,0)',
    checkLogin:'select * from blog_manager where m_username = ?',
    saveToken:`update blog_manager set m_token = ? where m_id = ?`
}
class BlogManager{
    constructor(userName,password){
        this.m_id = 0
        this.m_username = userName
        this.m_password = Tool.md5(password)
        this.m_token = ''
        this.m_group = 0
        this.m_last_login_time = 0
        this.m_login_times = 0
        this.m_head = ''
    }

    static save(blogManager){
       return db.exec(sqls.insert,
       [blogManager.m_username,
       blogManager.m_password,
       blogManager.m_token,
       blogManager.m_group,
       blogManager.m_last_login_time,
       blogManager.m_login_times,
       blogManager.m_head])
    }

    static createTestManager(){
        User.save(new BlogManager('admin','123456'))
    }

    static checkLogin(userName){
        return db.exec(sqls.checkLogin,[userName])
    }

    static saveToken(token,m_id){
        return db.exec(sqls.saveToken,[token,m_id])
    }
  
    
}
module.exports = BlogManager