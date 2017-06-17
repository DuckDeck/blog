![ZOE Blog](http://upload-images.jianshu.io/upload_images/1281203-07b53ac45a94f192.jpg?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

>好久没写iOS的文章了，但这次来点不一样的，利用下班等业余时间撸了一个完整的开源博客解决方案，后端使用的是Mysql存储数据，服务器开发使用Node.js的Koa2框架，前端使用Vue2.x和ElementUI。 整个从数据库设计到前端展示全部功能由自己把控。项目地址是[ZOE blog](https://github.com/DuckDeck/blog)

###项目地址和使用
http://52stanhu.com/
测试号1： test1  密码: 123456
测试号2： test2  密码: 123456
博客后台管理登录
http://52stanhu.com/#/manage
测试号1： admin密码: 123456

###功能
注册账号，登录
搜索文章，作者，分类功能
文章分类和标签功能
响应式布局，适配手机端
富文本编辑和MarkDown编辑模式自由切换
评论文章和其他人的评论
修改设计
后台管理员登录
侧边栏

###如何使用
+ 1.Clone项目 `git clone https://github.com/DuckDeck/blog.git`
+ 2.进入项目目录使用npm安装模块 `cd blog   npm install`
+ 3 在config文件夹下新建文件imgPathConfig.js文件，在里面输入以下内容
```
export const imgPath = "http://localhost:3000/"
export const emailPath = "http://localhost:8088/"
```
+ 3.在`server/sqlhelp/mysql.js`文件里面配置数据库连接
```
var pool  = mysql.createPool({  
  connectionLimit : 10,  
  host            : 'localhost',   //主机
  user            : 'test',          /用户名
  password        : '123456', // 密码
  database        : 'blog' , //数据库名
});  
```
注意，配置好后要在Mysql数据库里新建一个叫blog的数据库，如果你觉得用命令操作数据库麻烦可以使用MySQL Workbench来管理Mysql还是非常方便的
+ 4.如果你是使用Visual Studio Code来写代码的话，那么直接使用按F5就能启动server端，如果是其他IDE，可以用命令来启动`node start.js`来启动服务器端
+ 5.再用命令启动前端即可，在项目根目录里使用命令`npm run dev`
+ 6.浏览器会自动启动并打开`localhiost:8088`并打开Blog主页面。