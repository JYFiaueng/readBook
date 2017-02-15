图书小站
============

过程（还需完善，未做总结）：

### 安装的东西：
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
	npm i nodemailer --save
	npm i nodemailer-smtp-transport --save
	npm i svg-captcha --save



### 功能迭代
	首页展示，jade模版循环显示
	管理员的图书管理列表
	管理员图书录入功能
	用户注册登录
	评论，嵌套评论
	图书分类
	图书搜索
	搜索列表分页
	图片上传（图书、头像）
	同步豆瓣数据
	访客统计（PV）
	单元测试，Grunt集成测试
	自己添加了对图书分类的修改和删除逻辑，按照图书列表的样子改一改就ok了
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
	国际化(一个一个写，累死了，全是驼峰法)(使用了模块i18next)
	删掉了更改账户（这个不能让人改，从没见过还能改帐号的网站(╯°Д°)╯︵ ┻━┻）
	修复图书内容获取错误的问题
	用$or将搜索的范围进行了扩展（书名、作者、标签、出版社）
	有时候会出现modal function not define，是因为js代码在document加载完成之前就运行了，没有得到boostrap为其添加的方法,http://stackoverflow.com/questions/8586306/bootstrap-modal-is-not-a-function
	用~str.indexOf(queryStr)代替了str.indexOf(queryStr) !== -1
	在首页添加图书被加入书单的图书的排行，固定其位置显示在右侧
	制作热门图书的滑动固定效果（在fixed.js文件中）
	用户注册时进行邮箱激活
	用户登录时进行是否激活的验证
	用户可通过邮箱登录
	未收到邮件可再次发送
	点击注册弹窗的关闭按钮进行清理逻辑
	通过邮箱进行密码找回nodemailer
	将原来的修改头像和密码进行了分离，将修改密码改为链接将用户引入changePassPage路由进行密码的修改
	登陆的时候要求用户输入验证码svg-captcha

	（未做）
	用户可设置密保问题进行密码的找回

	花生壳
	http://1o6003i090.iask.in:21758
	http://1o6003i090.iask.in:23903