CREATE DATABASE   IF NOT EXISTS blog
use blog
ALTER DATABASE blog DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci;
---------
user 用户表
---------
CREATE TABLE   IF NOT EXISTS   user (
        user_id mediumint(8) NOT NULL AUTO_INCREMENT COMMENT '用户ID',
        user_group_id mediumint(8) NOT NULL COMMENT '用户组ID 10为管理员',  
        user_name varchar(32) NOT NULL COMMENT '用户名',
        user_password varchar(32) NOT NULL COMMENT '用户密码',
        user_token varchar(50) NOT NULL COMMENT 'token',
        user_isSendEmail int(2) NOT NULL DEFAULT 0 COMMENT '用户有没有发送验证邮件',
        user_isValidate int(2) NOT NULL DEFAULT 0 COMMENT '用户有没有验证',
        user_register_time BIGINT(15) NOT NULL DEFAULT 0  COMMENT '用户注册时间',
        user_register_ip varchar(50) NOT NULL DEFAULT ''  COMMENT '用户注册时IP地址',
        user_login_times int(5) NOT NULL DEFAULT 0  COMMENT '用户登录次数',
        user_last_login_ip varchar(50) NOT NULL DEFAULT '' COMMENT '用户上一次登录IP地址',
        user_lock tinyint(3) NOT NULL DEFAULT 0  COMMENT '是否锁定，0为不锁定，1为锁定',
        user_freeze tinyint(3) NOT NULL DEFAULT 0  COMMENT '是否冻结，0为不冻结，1为冻结',
        user_auth varchar(255) NOT NULL DEFAULT '' COMMENT '拥有权限',
        delete_flag int(1) NOT NULL DEFAULT 0 COMMENT '删除标志',
        PRIMARY KEY (user_id)
        ) ENGINE=MyISAM DEFAULT CHARSET=utf8 ;
        
---------
user 用户信息表
---------
CREATE TABLE   IF NOT EXISTS   user_info (
        user_id mediumint(8) NOT NULL  COMMENT '用户ID 对于用户信息表，主键要和user表一要，所以不要让自己增',
        user_real_name varchar(32) NOT NULL COMMENT '用户真名',
        user_phone varchar(20) NOT NULL DEFAULT '' COMMENT '用户手机号码',
        user_gender int(2) NOT NULL DEFAULT 0 COMMENT '用户性别 --0未知 1：男 2：女，3： 人妖，4： 保密',
        user_qq varchar(20) NOT NULL DEFAULT '' COMMENT '用户QQ号码',
        user_email varchar(64) NOT NULL DEFAULT '' COMMENT '用户EMAIL地址',
        user_address varchar(255) NOT NULL DEFAULT '' COMMENT '用户地址',
        user_editor_type INT(2) NOT NULL DEFAULT 0 COMMENT '用户常用编辑器 0是富文本，1是markdown',
        user_mark mediumint(9) NOT NULL DEFAULT 0 COMMENT '用户积分',
        user_rank_id tinyint(3) NOT NULL DEFAULT 0 COMMENT '用户等级',
        user_birthday BIGINT(15) NOT NULL DEFAULT 0  COMMENT '用户生日',
        user_description varchar(255) NOT NULL DEFAULT ''  COMMENT '自我描述',
        user_image_url varchar(255) NOT NULL DEFAULT ''  COMMENT '用户头像',
        user_last_update_time BIGINT(15) NOT NULL DEFAULT 0  COMMENT '用户上次更新博客时间',
        user_says varchar(255) NOT NULL DEFAULT ''  COMMENT '用户语录',
        PRIMARY KEY (user_id)
        ) ENGINE=MyISAM DEFAULT CHARSET=utf8 ;
        

---------------
user_rank 用户等级表
---------------

CREATE TABLE  IF NOT EXISTS user_rank (
 rank_id mediumint(5) NOT NULL AUTO_INCREMENT COMMENT '自增ID',
 user_rank_id smallint(5) NOT NULL COMMENT '等级ID',
 rank_mark mediumint(6) NOT NULL COMMENT '等级积分',
 rank_name varchar(32) NOT NULL COMMENT '等级名称',
 PRIMARY KEY (rank_id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 ;



--------------
user_group 用户组表
--------------
CREATE TABLE  IF NOT EXISTS user_group (
 g_id tinyint(3) NOT NULL AUTO_INCREMENT COMMENT '自增ID号',
 group_id tinyint(3) NOT NULL COMMENT '用户组ID',
 group_name varchar(20) NOT NULL COMMENT '用户组名',
 group_power varchar(20) NOT NULL COMMENT '用户权限',
 PRIMARY KEY (g_id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 ;


----------------
power_list 功能权限表
----------------
CREATE TABLE  IF NOT EXISTS feature_auth (
 f_id int(10) NOT NULL AUTO_INCREMENT COMMENT '自增ID',
 feature_id int(10) NOT NULL COMMENT '权限ID',
 feature_name varchar(36) NOT NULL COMMENT '权限描述',
 PRIMARY KEY (p_id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 ;



-----------------
friend 好友表 
-----------------
CREATE TABLE  IF NOT EXISTS friend (
 f_id smallint(5) NOT NULL AUTO_INCREMENT COMMENT '自增ID',
 user_id mediumint(8) NOT NULL COMMENT '用户ID',
 friend_id mediumint(8) NOT NULL COMMENT '好友ID',
 PRIMARY KEY (f_id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 ;


--------------------
user_attention 用户关注表
--------------------
CREATE TABLE  IF NOT EXISTS user_attention (
 a_id smallint(5) NOT NULL AUTO_INCREMENT COMMENT '自增ID',
 user_id mediumint(8) NOT NULL COMMENT '用户ID',
 attention_id mediumint(8) NOT NULL COMMENT '关注ID',
 attention_time BIGINT(15) DEFAULT 0 COMMENT '关注时间',
 PRIMARY KEY (a_id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 ;





------------------------
friendly_link 友情链接
------------------------
CREATE TABLE  IF NOT EXISTS friendly_link (
 link_id smallint(5) NOT NULL AUTO_INCREMENT COMMENT '友情链接自增ID',
 link_user_id smallint(8) NOT NULL DEFAULT 0 COMMENT '友情链接的所属用户',
 link_type smallint(8) NOT NULL DEFAULT 0 COMMENT '友情链接的类型 0表示系统，1 表示自定义', 
 link_name varchar(60) NOT NULL COMMENT '友情链接名称',
 link_url varchar(255) NOT NULL COMMENT '链接地址',
 link_logo varchar(255) NOT NULL COMMENT 'LOGO图片',
 show_order tinyint(3) NOT NULL DEFAULT 0 COMMENT '在页面显示的顺序',
 PRIMARY KEY (link_id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 ;

------------------------
ad 广告表
------------------------
CREATE TABLE  IF NOT EXISTS ad (
 ad_id smallint(5) NOT NULL AUTO_INCREMENT COMMENT '自增ID',
 position_id smallint(5) NOT NULL COMMENT '0,站外广告;从1开始代表的是该广告所处的广告位,同表ad_postition中的字段position_id的值',
 media_type tinyint(3) NOT NULL DEFAULT 0 COMMENT '广告类型,0图片;1flash;2代码3文字',
 ad_name varchar(60) NOT NULL COMMENT '该条广告记录的广告名称',
 ad_link varchar(255) NOT NULL COMMENT '广告链接地址',
 ad_code text NOT NULL COMMENT '广告链接的表现,文字广告就是文字或图片和flash就是它们的地址',
 start_time BIGINT(15) NOT NULL DEFAULT 0 COMMENT '广告开始时间',
 end_time BIGINT(15) NOT NULL DEFAULT 0 COMMENT '广告结束时间',
 link_man varchar(60) NOT NULL COMMENT '广告联系人',
 link_email varchar(60) NOT NULL COMMENT '广告联系人的邮箱',
 link_phone varchar(60) NOT NULL COMMENT '广告联系人得电话',
 click_count mediumint(8) NOT NULL DEFAULT 0 COMMENT '广告点击次数',
 enabled tinyint(3) NOT NULL DEFAULT 1 COMMENT '该广告是否关闭;1开启; 0关闭; 关闭后广告将不再有效',
 PRIMARY KEY (ad_id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 ;


------------------
stay_message 用户留言表 相当于是给blog主人留言，不是评论 这和评论有区别吗？
------------------ 
CREATE TABLE  IF NOT EXISTS stay_message (
 stay_id smallint(5) NOT NULL AUTO_INCREMENT COMMENT '留言表自增ID',
 user_id mediumint(8) NOT NULL COMMENT '用户ID',
 stay_user_id mediumint(8) NOT NULL COMMENT '留言者ID',
 message_content varchar(255) NOT NULL COMMENT '留言内容',
 stay_user_ip varchar(50) NOT NULL COMMENT '留言用户的IP地址',
 message_stay_time BIGINT(15) NOT NULL COMMENT '留言时间',
 place varchar(64) NOT NULL COMMENT '地区',
 delete_flag int(1) NOT NULL DEFAULT 0 COMMENT '删除标志',
 PRIMARY KEY (stay_id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 ;


--------------------
about_blog 博客信息表
--------------------
CREATE TABLE  IF NOT EXISTS about_blog (
 blog_id mediumint(8) NOT NULL  COMMENT '用户ID',
 blog_keyword varchar(255) NOT NULL COMMENT '博客关键字',
 blog_description varchar(255) NOT NULL COMMENT '博客描述',
 blog_name varchar(36) NOT NULL COMMENT '博客名称',
 blog_title varchar(128) NOT NULL COMMENT '博客标题',
 PRIMARY KEY (blog_id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 ;


----------------------
visitor 最近访客表
----------------------
CREATE TABLE  IF NOT EXISTS visitor (
 v_id mediumint(8) NOT NULL AUTO_INCREMENT COMMENT '访客记录ID',
 visitor_id mediumint(8) NOT NULL COMMENT '访客ID',
 visitor_time BIGINT(15) NOT NULL COMMENT '来访时间',
 user_id mediumint(8) NOT NULL COMMENT '被访用户ID',
 visitor_ip varchar(50) NOT NULL COMMENT '访客IP地址',
 type_id int(3) NOT NULL COMMENT '访问板块ID',
 where_id mediumint(8) NOT NULL COMMENT '查看某板块的某个子项目，如查看相册板块的第3个相册，该ID对应该相册的ID号',
 PRIMARY KEY (v_id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 ;


-----------------------
shuoshuo 用户心情说说表
-----------------------
CREATE TABLE  IF NOT EXISTS shuoshuo (
 shuo_id mediumint(8) NOT NULL AUTO_INCREMENT COMMENT '说说记录ID',
 user_id mediumint(8) NOT NULL COMMENT '用户ID',
 shuo_time BIGINT(15) NOT NULL DEFAULT 0 COMMENT '发布时间',
 shuo_ip varchar(50) NOT NULL COMMENT '说说发布时的IP地址',
 shuoshuo varchar(255) NOT NULL COMMENT '说说内容',
 type_id tinyint(3) NOT NULL DEFAULT 3 COMMENT '栏目ID,默认为3',
 delete_flag int(1) NOT NULL DEFAULT 0 COMMENT '删除标志',
 PRIMARY KEY (shuo_id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 ;


-----------------------
photo_sort 相片分类表
-----------------------
CREATE TABLE  IF NOT EXISTS photo_sort (
 sort_img_id mediumint(8) NOT NULL  AUTO_INCREMENT COMMENT '相册ID',
 sort_img_name varchar(20) NOT NULL COMMENT '相册名',
 sort_img_type varchar(20) NOT NULL COMMENT '展示方式 0->仅主人可见,1->输入密码即可查看,2->仅好友能查看,3->回答问题即可查看',
 img_password varchar(32) NOT NULL COMMENT '查看密码',
 user_id mediumint(8) NOT NULL COMMENT '所属用户ID',
 img_sort_question varchar(255) NOT NULL COMMENT '访问问题',
 img_sort_answer varchar(128) NOT NULL COMMENT '访问问题的答案',
 type_id int(3) NOT NULL DEFAULT 1 COMMENT '默认1表示相册板块',
 top_pic_src mediumint(8) NOT NULL COMMENT '封面图片的路径',
 PRIMARY KEY (sort_img_id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 ;

-----------------------
photos 相片表
-----------------------
CREATE TABLE  IF NOT EXISTS photos (
 photo_id mediumint(8) NOT NULL AUTO_INCREMENT COMMENT '相片ID',
 photo_name varchar(255) NOT NULL COMMENT '相片名称',
 photo_src varchar(255) NOT NULL COMMENT '图片路径',
 photo_description varchar(255) NOT NULL COMMENT '图片描述',
 user_id mediumint(8) NOT NULL COMMENT '所属用户ID',
 sort_id mediumint(8) NOT NULL COMMENT '所属相册ID',
 upload_time BIGINT(15) NOT NULL COMMENT '图片上传时间',
 upload_ip varchar(50) NOT NULL COMMENT '图片操作上传IP地址',
 delete_flag int(1) NOT NULL DEFAULT 0 COMMENT '删除标志',
 PRIMARY KEY (photo_id) 
) ENGINE=MyISAM DEFAULT CHARSET=utf8 ;

-------------------------
article_sort 文章分类表
-------------------------
CREATE TABLE  IF NOT EXISTS article_sort (
 sort_article_id mediumint(8) NOT NULL AUTO_INCREMENT COMMENT '文章自增ID',
 user_id mediumint(8) NOT NULL COMMENT '该分类所属用户',
 sort_article_name varchar(60) NOT NULL COMMENT '分类名称',
 PRIMARY KEY (sort_article_id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 ;

-------------------------
article_sort 文章标签表
-------------------------
CREATE TABLE  IF NOT EXISTS article_tag (
 tag_id mediumint(8) NOT NULL AUTO_INCREMENT COMMENT '标签ID',
 user_id mediumint(8) NOT NULL  COMMENT '用户ID', 
 tag_name varchar(60) NOT NULL COMMENT '标签名',
 PRIMARY KEY (tag_id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 ;

-------------------------
article_sort 文章标签映射表
-------------------------
CREATE TABLE  IF NOT EXISTS article_tag_map (
 tag_article_id mediumint(8) NOT NULL AUTO_INCREMENT COMMENT '标签自增ID',
 tag_id mediumint(8) NOT NULL COMMENT '标签ID',
 article_id mediumint(8) NOT NULL COMMENT '标文章ID',
 PRIMARY KEY (tag_article_id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;


--------------------------
article 文章表
--------------------------
CREATE TABLE  IF NOT EXISTS article (
 article_id smallint(5) NOT NULL AUTO_INCREMENT COMMENT '日志自增ID号',
 article_name varchar(128) NOT NULL COMMENT '文章名称',
 article_create_time BIGINT(15) NOT NULL COMMENT '创建时间',
 article_release_time BIGINT(15) NOT NULL COMMENT '发布时间',
 article_ip varchar(50) NOT NULL COMMENT '发布IP',
 article_click int(10) NOT NULL COMMENT '查看人数',
 article_sort_id mediumint(8) NOT NULL COMMENT '所属分类',
 user_id mediumint(8) NOT NULL COMMENT '所属用户ID',
 article_type_id tinyint(3) NOT NULL DEFAULT 1 COMMENT '栏目ID',
 article_type int(2) NOT NULL DEFAULT 1 COMMENT '文章的模式:0为私有，1为公开，2为仅好友查看',
 article_content text NOT NULL COMMENT '文章内容',
 article_brief varchar(2000) NOT NULL DEFAULT '' COMMENT '文章简要',
 article_main_img varchar(1000) NOT NULL DEFAULT '' COMMENT '文章主要图片',
 article_up tinyint(3) NOT NULL DEFAULT 0 COMMENT '是否置顶:0为否，1为是',
 article_recommend tinyint(3) NOT NULL DEFAULT 0 COMMENT '是否博主推荐:0为否，1为是',
 article_status tinyint(3) NOT NULL DEFAULT 0 COMMENT '文章状态，0为没有发布，也就是草稿，1 为发布 5是临时文章',
 delete_flag int(1) NOT NULL DEFAULT 0 COMMENT '删除标志',
 PRIMARY KEY (article_id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 ;


--------------------------
user_comment 用户评论表
--------------------------
CREATE TABLE  IF NOT EXISTS user_comment (
 comment_id mediumint(8) NOT NULL AUTO_INCREMENT COMMENT '评论自增ID号',
 comment_target_user_id mediumint(8) NOT NULL COMMENT '收到评论的用户ID，目前好像没什么用', 
 comment_type_id tinyint(3) DEFAULT 0 NOT NULL COMMENT '评论栏目ID',
 comment_target_id mediumint(8) NOT NULL COMMENT '评论内容的ID',
 comment_content varchar(255) NOT NULL COMMENT '评论内容',
 commenter_user_id mediumint(8) NOT NULL COMMENT '评论者ID',
 comment_time BIGINT(15) NOT NULL COMMENT '评论时间',
 commenter_ip varchar(50) NOT NULL COMMENT '评论时的IP地址',
 delete_flag int(1) NOT NULL DEFAULT 0 COMMENT '删除标志',
 PRIMARY KEY (comment_id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 ;



--------------------------
user_comment 用户子评论表
--------------------------
CREATE TABLE  IF NOT EXISTS user_sub_comment (
 comment_id mediumint(8) NOT NULL AUTO_INCREMENT COMMENT '评论自增ID号',
 comment_target_user_id mediumint(8) NOT NULL COMMENT '回复评论的用户ID，目前好像没什么用',
 comment_target_id mediumint(8) NOT NULL COMMENT '评论内容的ID',
 comment_content varchar(255) NOT NULL COMMENT '评论内容',
 commenter_user_id mediumint(8) NOT NULL COMMENT '评论者ID',
 comment_time BIGINT(15) NOT NULL COMMENT '评论时间',
 commenter_ip varchar(50) NOT NULL COMMENT '评论时的IP地址',
 comment_type tinyint(3) DEFAULT 0 NOT NULL COMMENT '评论类型，如果是0 ，就是对parent评论，如果是1 ，就是评论子评论',
 comment_scope mediumint(8) DEFAULT 0 NOT NULL COMMENT '评论的scope，就是是共同的父评论',
 delete_flag int(1) NOT NULL DEFAULT 0 COMMENT '删除标志',
 PRIMARY KEY (comment_id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 ;


----------------------------
phone_message 短信记录表
----------------------------
CREATE TABLE  IF NOT EXISTS phone_message (
 phone_id mediumint(8) NOT NULL AUTO_INCREMENT COMMENT '自增ID号',
 phone_num varchar(12) NOT NULL COMMENT '用户手机号码',
 contents varchar(255) NOT NULL COMMENT '发送内容',
 send_time BIGINT(15) NOT NULL COMMENT '发送时间',
 user_id mediumint(8) NOT NULL COMMENT '用户ID',
 PRIMARY KEY (phone_id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 ;


------------------------------
-- blog_manager BLog网站管理员
------------------------------
CREATE TABLE  IF NOT EXISTS blog_manager (
 m_id mediumint(8) NOT NULL AUTO_INCREMENT COMMENT '自增ID号',
 m_username varchar(100) NOT NULL COMMENT '账号',
 m_password varchar(255) NOT NULL COMMENT '密码',
 m_token varchar(255) NOT NULL COMMENT '登录token',
 m_group tinyint(3) NOT NULL COMMENT '管理员组',
 m_last_login_time BIGINT(15) NOT NULL COMMENT '上次登录时间',
 m_login_times int(6) DEFAULT 0 COMMENT '登录次数',
 m_head varchar(100) NOT NULL COMMENT '头像',
 delete_flag int(1) NOT NULL DEFAULT 0 COMMENT '删除标志',
 PRIMARY KEY (m_id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 ;




------------------------------
-- user_dynamic 用户动态
------------------------------
CREATE TABLE  IF NOT EXISTS user_dynamic (
 dynamic_id mediumint(8) NOT NULL AUTO_INCREMENT COMMENT '自增ID号',
 dynamic_user_id mediumint(8) NOT NULL COMMENT '用户ID',
 dynamic_target_id mediumint(8) NOT NULL COMMENT '目标ID',
 dynamic_target_belong_id mediumint(8) NOT NULL COMMENT '目标ID的所属ID',
 dynamic_type_id mediumint(8) NOT NULL COMMENT '类型Id',
 dynamic_type_name varchar(255) NOT NULL COMMENT '类型名称',
 dynamic_oper_type mediumint(8) NOT NULL COMMENT '操作类型ID',
 dynamic_oper_name varchar(255) NOT NULL COMMENT '操作类型名称',
 dynamic_oper_time BIGINT(15) NOT NULL COMMENT '操作时间',
 PRIMARY KEY (dynamic_id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 ;


类型Id: 1,2,3,4,5,6,7,8
 case 1:
this.dynamic_type_name = '发表了文章'

case 2:
this.dynamic_type_name = '修改了文章'

case 3:
this.dynamic_type_name = '删除了文章'

case 4:
this.dynamic_type_name = '发布了评论' //大

case 5: 
this.dynamic_type_name = '修改了评论' //大

case 6:
this.dynamic_type_name = '删除了评论' //大

case 7:
this.dynamic_type_name = '发布了评论' //小

case 8:
this.dynamic_type_name = '修改了评论' //小

case 9:
this.dynamic_type_name = '删除了评论' //小

case 10:
this.dynamic_type_name = '关注了'

case 11:
this.dynamic_type_name = '取消关注了'

case 12:
this.dynamic_type_name = '喜欢了文章'

case 13:
this.dynamic_type_name = '收藏了文章'


//关注专题 


操作类型ID this is a alterlate
1 添加（关注）
2 修改
3 删除（取消）




------------------------------
-- error 服务器出错
------------------------------
CREATE TABLE  IF NOT EXISTS blog_error (
 error_id mediumint(8) NOT NULL AUTO_INCREMENT COMMENT '自增ID号',
 error_num mediumint(8) NOT NULL DEFAULT 0 COMMENT '错误号',
 error_name varchar(255) NOT NULL COMMENT '错误名',
 error_message varchar(2000) NOT NULL COMMENT '错信息',
 error_desc varchar(2000) NOT NULL COMMENT '目标描述',
 error_stack varchar(2000) NOT NULL COMMENT '目标Stack',
 error_time BIGINT(15) NOT NULL COMMENT '出错时间',
 PRIMARY KEY (error_id)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 ;

------------------------------
-- collect_article 用户收藏文章
------------------------------
CREATE TABLE   IF NOT EXISTS `blog`.`collect_article` (
  `collect_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL DEFAULT 0 COMMENT '用户id',
  `article_id` INT NOT NULL DEFAULT 0 COMMENT '文章id',
  `collect_time` BIGINT(15) NULL COMMENT '收藏时间',
  PRIMARY KEY (`collect_id`));

------------------------------
-- collect_article 用户喜欢文章
------------------------------
CREATE TABLE   IF NOT EXISTS `blog`.`like_article` (
  `like_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL DEFAULT 0 COMMENT '用户id',
  `article_id` INT NOT NULL DEFAULT 0 COMMENT '文章id',
  `like_time` BIGINT(15) NULL COMMENT '收藏时间',
  PRIMARY KEY (`like_id`));


------------------------------
-- create tag_map view
------------------------------
create view article_tag_map_view as  select tag.* , 
map.article_id from article_tag as tag left join article_tag_map as map on tag.tag_id = map.tag_id

------------------------------
-- create user_detail view
------------------------------

CREATE 
    ALGORITHM = UNDEFINED 
     DEFINER = `stan`@`%`  --这里要根据数据库不一样而修改
    SQL SECURITY DEFINER
VIEW `user_detail` AS
    SELECT 
        `a`.`user_group_id` AS `user_group_id`,
        `a`.`user_name` AS `user_name`,
        `a`.`user_password` AS `user_password`,
        `a`.`user_token` AS `user_token`,
        `a`.`user_isSendEmail` AS `user_isSendEmail`,
        `a`.`user_isValidate` AS `user_isValidate`,
        `a`.`user_register_time` AS `user_register_time`,
        `a`.`user_register_ip` AS `user_register_ip`,
        `a`.`user_login_times` AS `user_login_times`,
        `a`.`user_last_login_ip` AS `user_last_login_ip`,
        `a`.`user_lock` AS `user_lock`,
        `a`.`user_freeze` AS `user_freeze`,
        `a`.`user_auth` AS `user_auth`,
        `b`.`user_id` AS `user_id`,
        `b`.`user_real_name` AS `user_real_name`,
        `b`.`user_phone` AS `user_phone`,
        `b`.`user_gender` AS `user_gender`,
        `b`.`user_qq` AS `user_qq`,
        `b`.`user_email` AS `user_email`,
        `b`.`user_address` AS `user_address`,
        `b`.`user_editor_type` AS `user_editor_type`,
        `b`.`user_mark` AS `user_mark`,
        `b`.`user_rank_id` AS `user_rank_id`,
        `b`.`user_birthday` AS `user_birthday`,
        `b`.`user_description` AS `user_description`,
        `b`.`user_image_url` AS `user_image_url`,
        `b`.`user_last_update_time` AS `user_last_update_time`,
        `b`.`user_says` AS `user_says`
    FROM
        (`user` `a`
        JOIN `user_info` `b` ON ((`a`.`user_id` = `b`.`user_id`)))


------------------------------
-- create user_comments view
------------------------------

 create view user_comments as 
 SELECT comment_id,comment_target_user_id,comment_target_id,
comment_content,commenter_user_id,comment_time, 0 as 'comment_type',  0 as 'comment_scope',delete_flag FROM user_comment  union
SELECT comment_id,comment_target_user_id,comment_target_id,
comment_content,commenter_user_id,comment_time,comment_type,comment_scope,delete_flag FROM 
user_sub_comment 



------------------------------
-- create 文章相关信息的View
------------------------------
CREATE 
    ALGORITHM = UNDEFINED 
    DEFINER = `root`@`localhost` 
    SQL SECURITY DEFINER
VIEW `article_related_info` AS
    SELECT 
        `article`.*,
        (SELECT 
                COUNT(`user_comment`.`comment_id`)
            FROM
                `user_comment`
            WHERE
                (`article`.`article_id` = `user_comment`.`comment_target_id`)) AS `comment_count`,
        (SELECT 
                COUNT(`like_article`.`like_id`)
            FROM
                `like_article`
            WHERE
                (`like_article`.`article_id` = `article`.`article_id`)) AS `like_count`,
        (SELECT 
                `article_sort`.`sort_article_name`
            FROM
                `article_sort`
            WHERE
                (`article_sort`.`sort_article_id` = `article`.`article_sort_id`)) AS `article_sort_name`,
        `user_info`.`user_real_name` AS `user_real_name`,
        `user_info`.`user_image_url` AS `user_image_url`
    FROM
        (`article`
        JOIN `user_info` ON ((`article`.`user_id` = `user_info`.`user_id`)))
    WHERE
        (`article`.`article_status` = 1)
------------------------------
-- create chat_message 这个用于聊天？
------------------------------


CREATE TABLE `blog`.`chat_message` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `chat_type` INT NOT NULL,
  `sender_id` INT NOT NULL,
  `receive_id` INT NOT NULL,
  `time` BIGINT(20) NOT NULL,
  `chat_id` INT NOT NULL,
  `send_status` INT NOT NULL,
  `chat_content` LONGTEXT NULL,
  PRIMARY KEY (`id`)
  );


第一种情况一般是系统发的
目前这里定为6种信息
这种设计其实效率很低，如果你关注的人很多或者写了很多文章，那么数据量会特别多
所以，可以这里面某些消息可以用订阅的方式，
不过如果移除关注有话数据量会少很多
1 文章的评论
2 评论的评论
3 喜欢和赞
4 有人关注了你
5 系统通知  一般是广告之类的或者新闻
6 其他
//这里一般来说发送者都是系统
一般来说是点对点的
//对于分组发送，还是有难度的，目前没这个需求

//其实可以建多个表，评论  喜欢， 私信和通知 关注 其他
，这样更节省资源
//有人评论了后产生的消息
CREATE TABLE `blog`.`message_comment` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `receive_id` INT NOT NULL COMMENT '接收这个信息的ID，一般是用户ID',
  `commenter_id` INT NULL COMMENT '评论者ID',
  `comment_project_id` INT NOT NULL COMMENT '评论的项目ID，一般是文章',
  `comment_project_title` VARCHAR(500) NOT NULL COMMENT '\'评论的项目标题，一般是文章标题\'',
  `message_time` BIGINT(15) NOT NULL COMMENT '评论时间',
  `read_status` TINYINT(4) NULL DEFAULT 0 COMMENT '是否已读'，
  `content` TEXT(2000) NULL COMMENT '\'评论内容\'',
  
  `comment_id` INT NULL COMMENT '主体评论的ID',
  `comment_scope_id` INT NULL COMMENT '评论对象的父ID，这种用于小评论',
  `comment_scope_belong_id` INT NULL COMMENT '评论对象的父ID的所属者ID',
  PRIMARY KEY (`id`));


alter database blog CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci

 alter table message_comment convert to character set utf8mb4 collate utf8mb4_bin

//喜欢的信息
CREATE TABLE `message_like` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `receive_id` int(11) NOT NULL COMMENT '收这条信息的人',
  `sender_id` int(11) NOT NULL COMMENT '谁作出来的操作',
  `comment_project_id` int(11) DEFAULT NULL COMMENT '喜欢的项目ID',
  `comment_project_title` varchar(1000) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '喜欢的项目标题',
  `message_time` BIGINT(15) NOT NULL COMMENT '喜欢时间',
  `like_message_type` int(11) NOT NULL COMMENT '1是文章，2 是评论',
  `like_status` int(11) NOT NULL COMMENT '喜欢和踩，1 是喜欢，2 是踩',
  `read_status` tinyint(4) NOT NULL DEFAULT '0' COMMENT '有没有读',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `message_attention` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `receive_id` int(11) NOT NULL COMMENT '收这条信息的人',
  `sender_id` int(11) NOT NULL COMMENT '谁作出来的操作',
  `message_time` BIGINT(15) NOT NULL,
  `read_status` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE `message_notice` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `receive_id` int(11) NOT NULL COMMENT '收这条信息的人',
  `sender_id` int(11) NOT NULL COMMENT '谁作出来的操作',
  `message_time` BIGINT(15) NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci COMMENT '内容',
  `read_status` tinyint(4) NOT NULL,
  `message_group` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT '消息分组，一般用于私信',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


//修正字符串问题
ALTER TABLE chat_message CHANGE chat_content chat_content LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;