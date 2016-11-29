--save-dev 将插件版本添加到package.json中
bower init 会生成 bower.json 文件
.bowerrc 文件用于更改bower的默认配置
慢任务就是sass、less等的编译就是慢任务



// 对于路由 /user/signup/1111?userid=1112
// var _userid = req.query.userid;1112
// var _userid = req.body.userid;//表单里面的userid
// var _userid = req.params.userid;1111
// 直接用下面这个方式暴力查找，会先查找路由里面的userid，然后找表单里面是否有userid，最后找查询字符串里面的userid
// req.param('user');


会话一般用来跟踪用户，确定用户的身份
会话的持久化：cookie、内存、数据库
cookie-session模块已经自动实现了使用cookie进行持久化，教程里面使用了数据库进行session的持久化
npm i express-session connect-mongo
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);
app.use(session({
	secret:'nodeProject',
	resave:false,
	saveUninitialized:true,
	store:new mongoStore({
		url:dbUrl,
		mongooseConnection:'sessions'
	})
}));
将要保存的用户数据赋给req.session对象即可实现使用数据库的session持久化

使用中间件将用户的持久化session加入到locals中，做到全局可用

2016年11月12日 20:51:49
自己添加了对图书分类的修改和删除逻辑，按照图书列表的样子改一改就ok了

单元测试：
	mocha：simple、flexible、fun
	QUnit
	Jasmine

**自行添加图书和评论的测试用例

安装的东西：
npm i express
npm i jade
npm i body-parser
npm i serve-static
npm i mongoose
npm i underscore
npm i -g bower
bower bootstrap
.bowerrc 修改bower安装组件的默认路径
bower init 生成bower.json文件
npm init 生成package.json文件
npm i -g grunt
npm i -g grunt-cli
npm i grunt
npm i grunt-contrib-watch --save-dev
npm i grunt-nodemon --save-dev
npm i grunt-concurrent --save-dev
gruntfile.js 编写grunt的运行文件
npm install cookie-parser
npm install express-session
npm install connect-mongo
npm i bcryptjs --save
npm i morgan
npm install --save connect-multiparty
npm install grunt-mocha-test --save
npm install mocha --save
npm install should --save

grunt 运行app
grunt test测试app


实战开始：
	需求分析
	项目依赖初始化
	入口文件编码
	创建视图
	测试前端流程
	样式开发，伪造模版数据
	设计数据库模型
	开发后端逻辑
	配置依赖文件，网站开发结束

一期功能：
	首页展示
	图书列表
	图书录入
	图书播放

二期功能：
	用户注册登录
	评论
	图书分类
	图书搜索
	列表分页
	图片上传
	同步豆瓣数据
	访客同级
	单元测试，Grunt集成测试

未做功能：
	安全性方面
	异常的处理
	前后端流程
	...

2016年11月13日 13:19:10
将图书改为图书之后自己进行扩展增加的功能
自己增加的功能：
	增加用户修改头像的功能
	增加用户回复时显示自己的头像
	增加对图书分类的修改和删除功能
	为nodebook添加根据pv量显示在首页的图书进行排行
	按照管理员输入的字段对图书进行过滤，便于删除和修改图书
	按照管理员输入的字段对用户进行过滤，便于提升和降低用户权限
	增加superAdmin用户可对所有用户的等级进行修改，包括其自己
	按照管理员输入的字段对图书分类进行过滤，便于修改和删除分类
	更改首页图书的显示方式
	增加用户修改用户名和修改密码的功能
	为很多a标签添加了title
	优化管理员登录之后的页面按钮显示
	优化登录注册页面的显示
	更改图书详情页的显示结构
	获取到图书的评价最多的标签最为其默认分类
	密码修改那里有巨大的问题(终于解决了)
	增加记录用户登录次数和最后登录时间的功能，和图书的pv类似
	登陆改为ajax异步请求，加入用户提示
	注册改为ajax异步请求，加入用户提示
	制作404页面
	加入阅读清单
	在详情页加一个加入阅读清单（purchaseList）的按钮
	添加了将图书加入书单时的用户反馈，成功、失败...
	做一个计划阅读的图书的查看页面
	限制清单中书的数量(10)
	书单页面可查询和删除图书
	将user.js里面的返回类型分成三种0（成功） 1（报错） 2（其他错误）
	对路由（routes.js）进行了整理
	增加返回顶部按钮
	国际化(一个一个写，累死了)(使用了模块i18next)
	删掉了更改账户（这个不能让人改，从没见过还能改帐号的网站(╯°Д°)╯︵ ┻━┻）
	修复图书内容获取错误的问题
	用$or将搜索的范围进行了扩展（书名、作者、标签、出版社）
	有时候会出现modal function not define，是因为js代码在document加载完成之前就运行了，没有得到boostrap为其添加的方法,http://stackoverflow.com/questions/8586306/bootstrap-modal-is-not-a-function