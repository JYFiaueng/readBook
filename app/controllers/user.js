// 这里是和用户有关的路由

var User = require('../models/user');
var fs = require('fs');
var path = require('path');

// 这三个只用于返回对象{err:...}的
var ERR = 1;
var SUC = 0;
var MSG = 2;

var App;
exports.loadApp = function (app){
	App = app;
};

exports.showSignup = function (req, res){
	res.render('signup', {
		title:App.locals.inxt.t('Signup')
	});
};

exports.showSignin = function (req, res){
	res.render('signin', {
		title:App.locals.inxt.t('Signin')
	});
};

// signup
exports.signup = function (req, res){
	var _user = req.body.user;
	var user;
	// 限制密码（6-16数字字母组合）
	var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
	if(!reg.test(_user.password)){
		return res.json({
			err:MSG
		});
	}
	User.findOne({name:_user.name}, function (err, user){
		if(err){
			console.log(err);
			return;
		}
		if(user){
			return res.json({
				err:ERR
			});
		}else{
			user = new User(_user);
			user.save(function (err, user){
				if(err){
					console.log(err);
					return;
				}
				// 注册完成之后自动登录
				req.session.user = user;
				return res.json({
					err:SUC
				});
			});
		}
	});
};

// signin
exports.signin = function (req, res){
	var _user = req.body.user;
	var name = _user.name;
	var password = _user.password;
	User.findOne({name:name}, function (err, user){
		if(err){
			console.log(err);
			return;
		}
		if(!user){
			return res.json({
				err:ERR
			});
		}
		user.comparePassword(password, function (err, isMatch){
			if(err){
				console.log(err);
				return;
			}
			if(isMatch){
				// 更新用户的登录次数
				User.update({_id:user._id}, {$set:{lastLogin:Date.now()}, $inc:{pv:1}}, function (err){
					if(err){
						console.log(err);
						return;
					}
				});
				req.session.user = user;
				return res.json({
					err:SUC
				});
			}else{
				return res.json({
					err:ERR
				});
			}
		});
	});
};

// logout
exports.logout = function (req, res){
	delete req.session.user;
	// delete app.locals.user;
	res.redirect('/');
};

// user list page
exports.list = function (req, res){
	var queryStr = req.query.queryStr || '';
	User.fetch(function (err, users){
		if(err){
			console.log(err);
			return;
		}
		res.render('userlist', {
			title:App.locals.inxt.t('Account')+App.locals.inxt.t('list'),
			users:users,
			queryStr:queryStr,
		});
	});
};

// admin poater 针对头像上传所做的中间件
exports.saveImage = function (req, res, next){
	var imageData = req.files.uploadImage;//图片数据
	var filePath = imageData.path;//文件路径
	var originalFilename = imageData.originalFilename;//图片原始名字
	if(originalFilename){
		fs.readFile(filePath, function (err, data){
			var timestamp = Date.now();//时间戳
			var type = imageData.type.split('/')[1];//文件类型
			var image = timestamp + '.' + type;//新的文件名
			var newPath = path.join(__dirname, '../../', '/public/headImage/' + image);//构建文件在服务器上的路径
			fs.writeFile(newPath, data, function (err){//将文件写入到指定位置
				if(err){
					console.log(err);
				}
				req.image = image;
				next();
			});
		});
	}else{
		next();
	}
};

// change image
exports.saveImg = function (req, res){
	// 更新头像
	if(!req.image){
		req.image = req.body.userImage;
	}
	// if(!req.body.username){
	// 	req.body.username = req.session.user.name;
	// }
	// 限制密码（6-16数字字母组合）
	var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
	if(!reg.test(req.body.password)){
		return res.redirect('/user/changeImage');
	}
	if(req.body.password !== ''){
		User.saltPassword(req.body.password, function (hash){
			req.body.password = hash;
			if(req.image){
				User.update({_id:req.session.user._id}, {$set:{image:req.image/*, name:req.body.username*/, password:req.body.password}}, function (err, user){
					if(err){
						console.log(err);
						return;
					}
					req.session.user.image = req.image;
					// req.session.user.name = req.body.username;
					res.redirect('/');
				});
			}else{
				User.update({_id:req.session.user._id}, {$set:{/*name:req.body.username,*/ password:req.body.password}}, function (err, user){
					if(err){
						console.log(err);
						return;
					}
					// req.session.user.name = req.body.username;
					res.redirect('/');
				});
			}
		});
	}else{
		if(req.image){
			User.update({_id:req.session.user._id}, {$set:{image:req.image/*, name:req.body.username*/}}, function (err, user){
				if(err){
					console.log(err);
					return;
				}
				req.session.user.image = req.image;
				// req.session.user.name = req.body.username;
				res.redirect('/');
			});
		}/*else{
			User.update({_id:req.session.user._id}, {$set:{name:req.body.username}}, function (err, user){
				if(err){
					console.log(err);
					return;
				}
				req.session.user.name = req.body.username;
				res.redirect('/');
			});
		}*/
	}
};

// change image
exports.changeImage = function (req, res){
	res.render('changeImage', {
		title:App.locals.inxt.t('change')+App.locals.inxt.t('Account')+App.locals.inxt.t('info')
	});
};

// change role
exports.changeRole = function (req, res){
	var _id = req.query.id;
	var role = req.query.role;
	User.update({_id:_id}, {$set:{role:role}}, function (err, user){
		if(err){
			console.log(err);
			return;
		}
		res.json({success:1});
	});
};

// midware for user
exports.signinRequired = function (req, res, next){
	var user = req.session.user;
	if(!user){
		return res.redirect('/signin');
	}
	next();
};

// midware for admin
exports.adminRequired = function (req, res, next){
	var user = req.session.user;
	if(user.role < 50){
		return res.redirect('/signin');
	}
	next();
};

// show user bookList
exports.showList = function (req, res){
	var queryStr = req.query.queryStr || '';
	User.findOne({name:req.session.user.name})
		.populate({path:'purchaseList'})
		.exec(function (err, user){
			if(err){
				console.log(err);
				return;
			}
			res.render('bookList', {
				title:App.locals.inxt.t('MyBookList'),
				userInfo:user,
				queryStr:queryStr
			});
		});
};

// add user bookList
exports.addList = function (req, res){
	// 获取要添加的图书的id
	var _id = req.query.id;
	User.findOne({_id:req.session.user._id}, function (err, user){
		if(err){
			res.json({
				err:ERR
			});
			console.log(err);
			return;
		}
		// 用户书单的最大数量
		if(user.purchaseList.length > 9){
			res.json({
				err:MSG
			});
			return;
		}
		// 检测书单中的重复书
		for(var i = 0; i < user.purchaseList.length; i++){
			if(user.purchaseList[i] == _id){
				res.json({
					err:MSG
				});
				return;
			}
		}
		// 通过校验压如图书
		user.purchaseList.push(_id);
		user.save(function (err, user){
			if(err){
				res.json({
					err:ERR
				});
				console.log(err);
				return;
			}
			res.json({
				err:SUC
			});
		});
	});
};

// del user bookList
exports.delList = function (req, res){
	// 获取要删除的图书的id
	var _id = req.query.id;
	User.findOne({_id:req.session.user._id}, function (err, user){
		if(err){
			res.json({
				err:ERR
			});
			console.log(err);
			return;
		}
		// 找到要删除的图书
		for(var i = 0; i < user.purchaseList.length; i++){
			if(user.purchaseList[i] == _id){
				// 将指定图书的id从用户的purchaseList中删除
				user.purchaseList.splice(i, 1);
				break;
			}
		}
		// 将文档重新存入数据库
		user.save(function (err, user){
			if(err){
				res.json({
					err:ERR
				});
				console.log(err);
				return;
			}
			res.json({
				err:SUC
			});
		});
	});
};