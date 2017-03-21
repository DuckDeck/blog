
const db = require('../sqlhelp/mysql') 
const Tool = require('../tool/tool')
const sqls = {
   insert:`insert into article_sort values(0,?,?)`,
   sorts:`select * from article_sort where user_id = ?`,
   deleteSort:`delete from article_sort where sort_article_id = ?`,
}
class ArticalSort{
    constructor(user_id,sort_name){
        this.sort_id = 0
        this.user_id = user_id
        this.sort_name = sort_name
    }

    static save(sort){
       return db.exec(sqls.insert,[sort.user_id, sort.sort_name])
    }
    static sorts(user_id){
        return db.exec(sqls.sorts,[user_id])
    }
    static deleteSort(sort_id){
        return db.exec(sqls.deleteSort,[sort_id])
    }

}
module.exports = ArticalSort