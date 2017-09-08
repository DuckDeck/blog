**更新，目前网站和接口全面启用HTTPS,域名改成了bqbbq.com**

## Demo地址和使用

https://bqbbq.com/#/

测试号1： test1  密码: 123456

测试号2： test2  密码: 123456

博客后台管理登录

https://bqbbq.com/#/manage

测试号1： admin密码: 123456

(**请大家不要做修改密码（已更新，测试账号密码不能修改），删除里面的文章等操作，另外，管理员只能同时存在一个人登录，因为要做登录验证,后台图片也不要删除**)

## 功能
+ 注册账号，登录
+ 搜索文章，作者，分类功能
+ 文章分类和标签功能
+ 响应式布局，适配手机端
+ 富文本编辑和MarkDown编辑模式自由切换
+ 评论文章和其他人的评论
+ 用户修改个性设计
+ 后台管理员登录
+ 侧边栏

## 先上效果图

![主页面](http://upload-images.jianshu.io/upload_images/1281203-c2fe05961c621d74.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

![主页面文章列表](http://upload-images.jianshu.io/upload_images/1281203-921eb1847ab0d2b6.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


![搜索结果](http://upload-images.jianshu.io/upload_images/1281203-c93fc5471c1b264b.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


![我的文章标签和分类](http://upload-images.jianshu.io/upload_images/1281203-6791cf4ff94e78fe.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


![写文章](http://upload-images.jianshu.io/upload_images/1281203-6fcfac530be3e214.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)



![修改设置](http://upload-images.jianshu.io/upload_images/1281203-affc4a36df17ac7b.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)



![后台管理](http://upload-images.jianshu.io/upload_images/1281203-55a3e762e09a438a.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

上面的图片只展示一小部分功能。里面还有更多的内容让读者挖掘

## 如何使用
+ 1.Clone项目 `git clone https://github.com/DuckDeck/blog.git`。
+ 2.进入项目根目录使用npm安装模块 `cd blog 后再   npm install`。
+ 3 ~~在config文件夹下新建文件imgPathConfig.js文件，在里面输入以下内容~~。
+ 3 更新，不再使用imgPathConfig，使用pathConfig文件，按照你的需要，把里面的Path改成自己的域名

```
export let imgPath = isProduction?"https://yourDomainAPI.com/": "http://localhost:3000/"

export let emailPath = isProduction? "https://yourDomain.com":"http://localhost:8088/"
```

![配置路径](http://upload-images.jianshu.io/upload_images/1281203-8b616f65bde624e3.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

注意要将自己Server的NODE环境改成production

``
export NODE_ENV = production
``

+ 3.在`server/sqlhelp/mysql.js`文件里面配置数据库连接
```
var pool  = mysql.createPool({  
  connectionLimit : 10,  
  host            : 'localhost',   //主机
  user            : 'test',          /用户名
  password        : '???????????????', // 密码
  database        : 'blog' , //数据库名
});  
```
注意，配置好后要在Mysql数据库里新建一个叫blog的数据库，如果你觉得用命令操作数据库麻烦可以使用MySQL Workbench来管理Mysql还是非常方便的。
+ 4.如果你是使用Visual Studio Code来写代码的话，那么直接使用按F5就能启动server端，如果是其他IDE，可以用命令来启动`node start.js`来启动服务器端，启动后，Node程序会在你的数据库里新建Blog所需要的表格和视图。
+ 5.建好表格后，这个时侯数据库还没有数据。如果你想使用自己的数据库，那么可以用我写的小爬虫程序可来爬取数据。它位于根目录的crawler下，其中jianchumy.js可以爬取我在简书发的文章。然后保存到数据库里。它还可以插入两个用户和一些文章分类。所以建议读者在这里运行这个文件`node jianchumy.js` 来生成一些数据。
+ 6.如果你不会配置Mysql的话也可以使用我server的数据，只需要修改`src/config/env.js`这个文件，将`development`的`baseUrl`改成`https://api.bqbbq.com/api/`即可。
+ 7.再用命令启动前端即可，在项目根目录里使用命令`npm run dev`。
+ 8.浏览器会自动启动并打开`localhiost:8088`并打开Blog主页面。
+ 9.如果想发布，使用命令`npm run build`即可，生成的文件在dist目录下，然后就能直接会使用了。
