var Index = require('../app/controllers/index');
var User = require('../app/controllers/user');
var Book = require('../app/controllers/book');
var Category = require('../app/controllers/category');
var Comment = require('../app/controllers/comment');

/*定义路由*/
module.exports = function (app){

	// 将app对象加入自定义模块中
	Index.loadApp(app);
	User.loadApp(app);
	Book.loadApp(app);
	Category.loadApp(app);

	// pre handler user
	app.use(function (req, res, next){
		var _user = req.session.user;
		var _lng = req.session.lng;
		// 将用户的session加入本地变量中
		app.locals.user = _user;
		// 更改为用户上次使用的语言
		if(_lng){
			app.locals.inxt.changeLanguage(_lng);
		}
		next();
	});

	// index page
	app.get('/', Index.index);

	// change language
	app.get('/language', function (req, res){
		var _lng = req.query.lng;
		// 获取到发起请求的那个页面的URL
		var _url = req.headers.referer;
		if(_lng){
			app.locals.inxt.changeLanguage(_lng);
			req.session.lng = _lng;
			res.redirect(_url);
		}
	});

	// captcha
	app.get('/captcha', User.captcha);

	// signin page
	app.get('/signin', User.showSignin);
	// signup page
	app.get('/signup', User.showSignup);
	// user logout
	app.get('/logout', User.logout);

	// user signup
	app.post('/user/signup', User.signup);
	// user signin
	app.post('/user/signin', User.signin);
	// find Password page
	app.get('/user/findPassPage', User.findPassPage);
	// find Password page
	app.get('/user/findPass', User.findPass);
	// change pass page
	app.get('/user/changePassPage', User.changePassPage);
	// change pass
	app.get('/user/changePass', User.changePass);
	// user active
	app.get('/user/active', User.active);
	// change image page(在此之上添加了修改用户名和密码)
	app.get('/user/changeImage', User.signinRequired, User.changeImage);
	// change user info
	app.post('/user/changeImage/change', User.signinRequired, User.saveImage, User.saveImg);
	// change user role
	app.post('/user/changeRole', User.signinRequired, User.adminRequired, User.changeRole);
	// add book list
	app.post('/user/book/list/add', User.signinRequired, User.addList);
	// book list page
	app.get('/user/book/list', User.signinRequired, User.showList);
	// delete book list
	app.delete('/user/book/list/del', User.signinRequired, User.delList);

	// book detail
	app.get('/book/:id', Book.detail);

	// user comment
	app.post('/user/comment', User.signinRequired, Comment.save);

	// search result page
	app.get('/results', Index.search);

	// admin user list page
	app.get('/admin/user/list', User.signinRequired, User.adminRequired, User.list);

	// admin add book page
	app.get('/admin/book/new', User.signinRequired, User.adminRequired, Book.new);
	// admin book list page
	app.get('/admin/book/list', User.signinRequired, User.adminRequired, Book.list);
	// admin update book
	app.get('/admin/book/update/:id', User.signinRequired, User.adminRequired, Book.update);
	// admin add book
	app.post('/admin/book/add', User.signinRequired, User.adminRequired, Book.savePoster, Book.save);
	// admin delete book
	app.delete('/admin/book/list', User.signinRequired, User.adminRequired, Book.del);

	// admin book category page
	app.get('/admin/category/new', User.signinRequired, User.adminRequired, Category.new);
	// admin book category list page
	app.get('/admin/category/list', User.signinRequired, User.adminRequired, Category.list);
	// admin update book category
	app.get('/admin/category/update/:id', User.signinRequired, User.adminRequired, Category.update);
	// admin add book category
	app.post('/admin/category/add', User.signinRequired, User.adminRequired, Category.save);
	// admin delete book category
	app.delete('/admin/category/list', User.signinRequired, User.adminRequired, Category.del);

	// 404 page
	app.get('*', function (req, res){
		res.render('404', {
			title:'404'
		});
	});

};