
const db = require('../sqlhelp/mysql') 
const Tool = require('../tool/tool')
const sqls = {
   allUserTypeLink:'select * from friendly_link where link_user_id = ? and link_type = 1',
   update:`replace friendly_link (link_id,link_user_id,link_type,link_name,link_url,link_logo,show_order) values (?,?,?,?,?,?,?)`,
   delete:`delete from friendly_link where link_id = ?`
}
class Link{
    constructor(link_name,link_url,link_logo){
        this.show_order = 0
        this.link_logo = link_logo
        this.link_url = link_url
        this.link_name = link_name
        this.link_type = 0
        this.link_user_id = 0
        this.link_id = 0
    }
    static update(system){
      return  db.exec(sqls.update,[system.link_id,system.link_user_id,system.link_type,system.link_name,
      system.link_url,system.link_logo,system.show_order])
    }
    static userLinks(user_id){
        return db.exec(sqls.allUserTypeLink,[user_id])
    }
    static deleteLink(link_id){
        return db.exec(sqls.delete,[link_id])
    }
}
module.exports = Link