
const db = require('../sqlhelp/mysql') 
const sqls = {
    articals:`select article_id,article_name,article_create_time,article_release_time,article_ip,article_click,article_sort__id,
    user_id,article_type_id,article_type,article_brief,article_main_img,article_up,article_recommend,article_status,
    (select sort_article_name from article_sort where  article_sort.sort_article_id = article.article_sort__id) 
    as article_sort_name , (select count(comment_id) from user_comment where user_comment.comment_target_id =
    article.article_id) as comment_count from article where user_id = ?`,  
    articalById:'SELECT *,(select sort_article_name   from article_sort where article_sort.sort_article_id = article.article_id) as sort_name FROM article where article_id = ?',
    insertArticle:'insert into article values(0,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
    deleteArticle:`delete from article where article_id = ? `,
    deleteArticleTagMap:`delete from article_tag_map where article_id = ? `,
    updateArticle:`UPDATE article SET article_name = ?,article_create_time = ?,article_release_time = ?,article_ip = ?,article_click = ?, article_sort__id = ?, 
    user_id = ?, article_type_id = ?, article_type = ?, article_content = ?,article_brief=?, article_main_img=?,article_up = ?, article_recommend = ?,
     article_status = ? WHERE article_id = ?`,
    selectArticleCommentById:`SELECT  comment_id,comment_target_id,comment_target_user_id,comment_content,commenter_user_id,comment_time,
        commenter_ip, 0 as type  FROM blog.user_comment where delete_flag = 0 and comment_target_id = ? union 
        SELECT comment_id,comment_target_id,comment_target_user_id,comment_content,commenter_user_id,comment_time,
        commenter_ip, 1 as type  FROM blog.user_sub_comment where delete_flag = 0 and comment_target_id = ?`
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

    static getArticleCommentById(article_id){
        return db.exec(sqls.selectArticleCommentById,[article_id,article_id])
    }
}
module.exports = Article
