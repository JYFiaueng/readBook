var express = require('express');
var path = require('path');
var session = require('express-session');
var mongoose = require('mongoose');
var mongoStore = require('connect-mongo')(session);
var cookieParser = require('cookie-parser');
var serveStatic = require('serve-static');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var connect_multiparty = require('connect-multiparty');
var logger = require('morgan');

var port = process.env.PORT || 3000;
var app = express();

// 国际化
var language = require('./config/language');
var i18next = require('i18next');
i18next.init({
	lng:'zh',
	resources:language
});
app.locals.inxt = i18next;

// 本地化moment模块
app.locals.moment = require('moment');

// 定义两个权限等级
app.locals.admin = 50;
app.locals.superAdmin = 51;

// 引入邮件发送模块
var dbUrl = 'mongodb://localhost/book';
app.locals.sendMail = require('./config/email');

// 连接数据库
mongoose.connect(dbUrl);

// models loading
var models_path = __dirname + '/app/models';

// 遍历指定路径中的所有文件
var walk = function (path){
	fs
	.readdirSync(path)
	.forEach(function (file){
		var newPath = path + '/' + file;
		var stat = fs.statSync(newPath);
		if(stat.isFile()){
			if(/(.*)\.(js|coffee)/.test(file)){
				require(newPath);
			}
		}else if(stat.isDirectory()){
			walk(newPath);
		}
	});
};

// 配置
app.set('views', './app/views/pages');
app.set('view engine', 'jade');
app.use(bodyParser());
app.use(serveStatic(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));
app.set(favicon('./public/favicon.ico'));
app.use(cookieParser());
app.use(connect_multiparty());
app.use(session({
	secret:'nodeProject',
	resave:false,
	saveUninitialized:true,
	store:new mongoStore({
		url:dbUrl,
		mongooseConnection:'sessions'
	})
}));

// 启动
app.listen(port);
console.log('project started on port:' + port);

// 开发环境配置
if('development' === app.get('env')){
	app.set('showStackError', true);
	app.use(logger(':method :url :status'));
	app.locals.pretty = true;//展开为易读的代码
	mongoose.set('debug', true);
}

// 引入路由处理模块
require('./config/routes')(app);