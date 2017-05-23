var mysql = require('mysql');  
var conf = {  
  connectionLimit : 10,  
  host            : 'localhost',  
  user            : 'test',  
  password        : '123456',  
}
var pool ;

const sqls = require('./tableSql')

function createPool(){
    if(!conf['database']){
            conf.database = 'blog'
    }
    if(!pool)
    {
        pool = mysql.createPool(conf)
    }
}
const actions = {
    createDB:function(){
        var connection = mysql.createConnection(conf);
        connection.connect();
        sqls.createDB.forEach((s)=>{
            connection.query(s, function(err, rows, fields) {
            });
        })
        connection.end();
       
    },
    createTbs:function(){
        createPool()
 
        pool.query(sqls.createArticleTb)
        pool.query(sqls.createMapArticleTagView)

        pool.query(sqls.createUserTb)
        pool.query(sqls.createUserInfoTb)
        pool.query(sqls.createUserGroupTb)

        pool.query(sqls.createFeatureAuthTb) // ??
        pool.query(sqls.createFriendListTb)
        pool.query(sqls.createUserConcernListTb)
        pool.query(sqls.createUserPrivateLetterTb)
        pool.query(sqls.createSystemMessageTb)
        pool.query(sqls.createFriendLinkTb)

        pool.query(sqls.createAdTb)
        pool.query(sqls.createUserLeaveWordTb)
        pool.query(sqls.createBlogInfoTb)
        pool.query(sqls.createLastVisitorTb)
        pool.query(sqls.createUserShuoShuoTb)
        pool.query(sqls.createPhotoSortTb)
        pool.query(sqls.createPhotoTb)
        pool.query(sqls.createArticleSortTb)
        pool.query(sqls.createArticleTagTb)
        pool.query(sqls.createArticleTagMapTb)

        pool.query(sqls.createUserCommentTb)
        pool.query(sqls.createUserSubCommentTb)
        pool.query(sqls.createSMSTb)

        pool.query(sqls.createUserDynamicTb)
        

        
        pool.query(sqls.createSiteManagerTb)


        //create createview

        pool.query(sqls.createTagMapView)
        pool.query(sqls.createUserDetailView)
        pool.query(sqls.createUserCommentsView)
        //all 21 
    },
}

module.exports = actions