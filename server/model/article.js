
const db = require('../sqlhelp/mysql') 
const sqls = {
    articals:`select article_id,article_name,article_create_time,article_release_time,article_ip,article_click,article_sort__id,user_id,article_type_id,article_type,
article_brief,article_main_img,article_up,article_recommend,article_status,(select sort_article_name from article_sort where 
    article_sort.sort_article_id = article.article_sort__id) as article_sort_name from article where user_id = ?`,
    articalById:'SELECT *,(select sort_article_name from article_sort where article_sort.sort_article_id = article.article_id) as sort_name FROM article where article_id = ?',
    insertArticle:'insert into article values(0,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
    deleteArticle:`delete from article where article_id = ? `,
    deleteArticleTagMap:`delete from article_tag_map where article_id = ? `,
    updateArticle:`UPDATE article SET article_name = ?,article_create_time = ?,article_release_time = ?,article_ip = ?,article_click = ?, article_sort__id = ?, 
    user_id = ?, article_type_id = ?, article_type = ?, article_content = ?,article_brief=?, article_main_img=?,article_up = ?, article_recommend = ?, article_status = ? WHERE article_id = ?`
}
class Article{
    constructor(title,content){
        this.title = title
        this.create_time = Date.parse(new Date())
        this.release_time = 0
        this.content = content
        this.ip = '192.123.111.111'
        this.readerCount = 111
        this.category = 1
        this.userId = 1
        this.typeId = 1
        this.articalType = 1
        this.articalUp = 1
        this.articalSupport = 1
        this.articalStatus = 0
        this.articleBrief = ''
        this.articleMainImage = ''
    }
   static save(article){
       return db.exec(sqls.insertArticle,
       [article.title,article.create_time,article.release_time,article.ip,article.readerCount,article.category,
       article.userId,article.typeId,article.articalType,article.content,article.articleBrief,article.articleMainImage,
       article.articalUp,article.articalSupport,article.articalStatus])
    }
   static articles(user_id){
        return db.exec(sqls.articals,[user_id])
    }
    static articalById(article_id){
        return db.exec(sqls.articalById,[article_id])
    }

    static deleteArticle(articleId){
        return Promise.all([db.exec(sqls.deleteArticle,[articleId]),db.exec(sqls.deleteArticleTagMap,[articleId])])
    }

    static updateAtricle(article){
        return db.exec(sqls.updateArticle,
       [article.title,article.create_time,article.release_time,article.ip,article.readerCount,article.category,
       article.userId,article.typeId,article.articalType,article.content,article.articleBrief,article.articleMainImage,
       article.articalUp,article.articalSupport,article.articalStatus,article.article_id])
    }
}
module.exports = Article
