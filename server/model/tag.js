
const db = require('../sqlhelp/mysql') 
const Tool = require('../tool/tool')
const sqls = {
   insert:`insert into article_tag values(0,?,?)`,
   tags:`select * from article_tag where user_id = ?`,
   searchTag:`select * from article_tag where user_id = ? and tag_name like %?%`,
   insertArticalTagMap:'insert into article_tag_map values(0,?,?)',
   articleTags:`select * from article_tag_map_view where article_id = ?`,
   deleteTag:`delete from article_tag where tag_id = ?`,
   deleteTagMap:`delete from article_tag_map where tag_id = ?`,
   tagsByArticleId:`select * from article_tag_map_view where article_id = ?`,
   deleteTagByArticleId:`delete from article_tag_map where article_id = ?`
}
class Tag{
    constructor(user_id,tag_name){
        this.tag_id = 0
        this.user_id = user_id
        this.tag_name = tag_name
    }

    static save(tag){
       return db.exec(sqls.insert,[tag.user_id, tag.tag_name])
    }

    static tags(user_id){
        return db.exec(sqls.tags,[user_id])
    }

    static deleteTag(tag_id){
        return Promise.all([db.exec(sqls.deleteTag,[tag_id]),db.exec(sqls.deleteTagMap,[tag_id])])
    }

    static deleteTagByArticleId(articleId){
        return db.exec(sqls.deleteTagByArticleId,[articleId])
    }

    static articleTags(article_ids){
        let actions = []
        for(var id of article_ids){
           actions.push(db.exec(sqls.articleTags,[id]))
        }
        return Promise.all(actions)
    }

    static articleTagByArticleId(article_id){
        return db.exec(sqls.tagsByArticleId,[article_id])
    }
    static saveArticalMap(articalId,tags){
        let actions = []
        for(var tag of tags){
           actions.push(db.exec(sqls.insertArticalTagMap,[tag,articalId]))
        }
        return Promise.all(actions)
    }
}
module.exports = Tag