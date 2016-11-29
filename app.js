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
var dbUrl = 'mongodb://localhost/book';

// 引入语言文件和i18next模块（2016年11月19日 17:15:59）
var language = require('./config/language');
var i18next = require('i18next');
// 加载资源文件
i18next.init({
	lng:'zh',
	resources:language
});
app.locals.inxt = i18next;
// #{inxt.t('key')}
app.locals.moment = require('moment');
// #{moment('...').format('YYYY/MM/DD')}

// 定义两个权限等级
app.locals.admin = 50;
app.locals.superAdmin = 51;


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
			if(/(.*)\.(js|coffee)/.test(file)){//如果是js文件就进行加载
				require(newPath);
			}
		}else if(stat.isDirectory()){
			walk(newPath);
		}
	});
};

/*配置*/

app.set('views', './app/views/pages');
app.set('view engine', 'jade');
// app.set(favicon());
// app.use(bodyParser.urlencoded());
app.use(bodyParser());
app.use(serveStatic(path.join(__dirname, 'public')));//定义静态资源的路径
app.use(express.static(path.join(__dirname, 'bower_components')));
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