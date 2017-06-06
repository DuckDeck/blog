
const db = require('../sqlhelp/mysql') 
const Tool = require('../tool/tool')
const sqls = {
    articals:`select article_id,article_name,article_create_time,article_release_time,article_ip,article_click,article_sort_id,
    user_id,article_type_id,article_type,article_brief,article_main_img,article_up,article_recommend,article_status,
    (select sort_article_name from article_sort where  article_sort.sort_article_id = article.article_sort_id) 
    as article_sort_name , (select count(comment_id) from user_comment where user_comment.comment_target_id =
    article.article_id) as comment_count from article where user_id = ? limit ? , ?`,  
    articalById:`SELECT *,(select sort_article_name   from article_sort where article_sort.sort_article_id = article.article_id) 
    as sort_name FROM article where article_id = ?`,
    insertArticle:'insert into article values(0,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,0)',
    deleteArticle:`delete from article where article_id = ? `,
    deleteArticleTagMap:`delete from article_tag_map where article_id = ? `,
    updateArticle:`UPDATE article SET article_name = ?,article_create_time = ?,article_release_time = ?,article_ip = ?,article_click = ?, article_sort_id = ?, 
    user_id = ?, article_type_id = ?, article_type = ?, article_content = ?,article_brief=?, article_main_img=?,article_up = ?, article_recommend = ?,
     article_status = ? WHERE article_id = ?`,
    selectArticleMainCommentById:`SELECT comment_id,comment_target_user_id,comment_target_id,
comment_content,commenter_user_id,comment_time FROM user_comment where  comment_target_id = ? order by comment_time desc limit 10`,
    selectArticleSubCommentById:`SELECT comment_id,comment_target_user_id,comment_target_id,
comment_content,commenter_user_id,comment_time,comment_type,comment_scope FROM user_sub_comment where  comment_scope in `,
// fck when you use in  to select  ? is a trouble
    myNewArcitleCount:`select count (article_id) as articleCount from article where user_id = ?`,
    myNewArcitle:`select article_id,article_name from article where user_id = ? limit 7`,
    getTempAarticle:`SELECT *,(select sort_article_name   from article_sort where article_sort.sort_article_id = article.article_id) 
    as sort_name FROM article where user_id = ? and article_status = 5`,
    setReleaseArticle:`update article set article_status = ?,article_release_time = ? where article_id in `
}
class Article{
    constructor(title,content){
        this.title = title
        this.create_time = Date.parse(new Date())
        this.release_time = Date.parse(new Date())
        this.content = content
        this.ip = ''
        this.readerCount = 0
        this.category = 1
        this.userId = 0
        this.typeId = 0
        this.articalType = 0
        this.articalUp = 0
        this.articalSupport = 0
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
    static articles(user_id,pageIndex,pageSize){
        return db.exec(sqls.articals,[user_id,pageSize * pageSize,pageSize])
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
        return db.exec(sqls.selectArticleMainCommentById,[article_id])
    }

    static getArticleSubCommentById(subIds){
         if(Tool.getType(subIds) == "Array"){
            subIds.sort()
            subIds = subIds.join(',')
         }
        return db.exec(sqls.selectArticleSubCommentById + '('+subIds + ')')
    }

    static myArticleCount(user_id){
        return db.exec(sqls.myNewArcitleCount,[user_id])
    }

    static myNewArticle(user_id){
        return db.exec(sqls.myNewArcitle,[user_id])
    }

    static getTempAarticle(user_id){
        return db.exec(sqls.getTempAarticle,[user_id])
    }

    static setReleaseArticle(status,ids){
        if(Tool.getType(ids) == "Array"){
            ids.sort()
            ids = ids.join(',')
        }
        return db.exec(sqls.setReleaseArticle + '(' + ids + ')',[status,new Date().getTime()])
    }
    
}
module.exports = Article
