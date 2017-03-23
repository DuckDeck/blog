
const db = require('../sqlhelp/mysql') 
const Tool = require('../tool/tool')
const sqls = {
   systemInfo:'select * from about_blog',
   update:'replace about_blog (blog_id,blog_keyword,blog_description,blog_name,blog_title) values (?,?,?,?,?)'
}
class System{
    constructor(name,title,desc,keyword){
        this.blog_keyword = keyword
        this.blog_description = desc
        this.blog_name = name
        this.blog_title = title
        this.blog_id = 0
    }
    static update(system){
      return  db.exec(sqls.update,[system.blog_id,system.blog_keyword,system.blog_description,system.blog_name,system.blog_title])
    }
    static systemInfo(){
        return db.exec(sqls.systemInfo)
    }
  

}
module.exports = System