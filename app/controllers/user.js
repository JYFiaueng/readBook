// 这里是和用户有关的路由

var User = require('../models/user');
var Book = require('../models/book');
var fs = require('fs');
var path = require('path');

// 这三个只用于返回对象{err:...}的
var ERR = 1;//服务器错误
var SUC = 0;//成功
var MSG = 2;//密码错误
var EME = 3;//邮箱错误
var SEN = 4;//已经向指定邮箱发送邮件，请去激活
var UEM = 5;//用户名不能是邮箱

var SUBJECT = '贾雨峰图书站';
// var domain = 'http://10.0.53.21:3000';
var domain = 'http://1o6003i090.iask.in:21758';

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
	var again = req.query.again;
	if(again == 'again'){
		User.findOne({email:_user.email}, function (err, user){
			if(err){
				console.log(err);
				return;
			}
			var url = domain+'/user/active?id=' + user.id;
			App.locals.sendMail(_user.email, SUBJECT, '请点击链接进行激活:<a href="'+url+'">'+url+'</a>');
			return res.json({
				err:SEN
			});
		});
		return;
	}
	// 限制密码（6-16数字字母组合）
	var regPass = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
	if(!regPass.test(_user.password)){
		return res.json({
			err:MSG
		});
	}
	// 邮箱格式检测
	var regEmail = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
	if(!regEmail.test(_user.email)){
		return res.json({
			err:EME
		});
	}
	// 用户账户名不能是邮箱
	if(regEmail.test(_user.name)){
		return res.json({
			err:UEM
		});
	}
	// 用户名唯一性验证
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
			// 邮箱唯一性验证
			User.findOne({email:_user.email}, function (err, user){
				if(err){
					console.log(err);
					return;
				}
				if(user){
					return res.json({
						err:EME
					});
				}else{
					user = new User(_user);
					user.save(function (err, user){
						if(err){
							console.log(err);
							return;
						}
						// 注册完成之后自动登录
						// req.session.user = user;
						// return res.json({
						// 	err:SUC
						// });
						// 向用户指定的邮箱发送邮件
						var url = domain+'/user/active?id=' + user.id;
						// sendMail(_user.email, SUBJECT, '<a href="'+url+'">'+url+'</a>', function(err){
						// 	if(err){
						// 		console.log(err);
						// 		return;
						// 	}
						// 	return res.json({
						// 		err:SEN
						// 	});
						// });
						App.locals.sendMail(_user.email, SUBJECT, '请点击链接进行激活 : <a href="'+url+'">'+url+'</a>');
						return res.json({
							err:SEN
						});
					});
				}
			});
		}
	});
};

// signin
exports.signin = function (req, res){
	var _user = req.body.user;
	var name = _user.name;
	var password = _user.password;
	var regEmail = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
	var UserQuery;
	if(regEmail.test(name)){//用户输入的是邮箱
		UserQuery = {email:name};
	}else{
		UserQuery = {name:name};
	}
	User.findOne(UserQuery, function (err, user){
		if(err){
			console.log(err);
			return;
		}
		if(!user){
			return res.json({
				err:ERR
			});
		}
		//未激活不能登陆
		if(user.active === 0){
			return res.json({
				err:SEN
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

exports.active = function (req, res){
	var _id = req.query.id;
	User.update({_id:_id}, {$set:{active:1}}, function (err, user){
		if(err){//激活失败
			console.log(err);
			delete req.session.user;
			res.render('active', {
				title:App.locals.inxt.t('active'),
				result:App.locals.inxt.t('fail')
			});
			return;
		}
		// 激活成功
		User.findOne({_id:_id}, function (err, user){
			req.session.user = user;
			res.render('active', {
				title:App.locals.inxt.t('active'),
				result:App.locals.inxt.t('suc')
			});
		});
	});
};

//find password page
exports.findPassPage = function (req, res){
	res.render('findPass', {
		title:App.locals.inxt.t('findPass'),
	});
};

// find password
exports.findPass = function (req, res){
	var email = req.query.email;
	var regEmail = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
	if(!regEmail.test(email)){
		return res.json({
			result:'0'
		});
	}
	User.findOne({email:email}, function (err, user){
		var url = domain+'/user/changePassPage?id='+user._id;
		App.locals.sendMail(email, SUBJECT, '请点击链接修改密码 : <a href="'+url+'">'+url+'</a>');
		return res.json({
			result:'1'
		});
	});
};

// change pass page
exports.changePassPage = function (req, res){
	var id = req.query.id || '';
	res.render('changePass', {
		title:App.locals.inxt.t('changePass'),
		id:id
	});
};

// change pass
exports.changePass = function (req, res){
	var _id = req.query.id;
	var _password = req.query.password;
	var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
	if(!reg.test(_password)){//用户输入的是邮箱
		return res.json({
			result:'0'
		});
	}
	User.saltPassword(_password, function (hash){
		_password = hash;
		User.update({_id:_id}, {$set:{password:_password}}, function (err){
			if(err){
				console.log(err);
				return res.json({
					result:'0'
				});
			}
			res.json({
				result:'1'
			});
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
	User.update({_id:req.session.user._id}, {$set:{image:req.image}}, function (err){
		if(err){
			console.log(err);
			return;
		}
		req.session.user.image = req.image;
		res.redirect('/');
	});
	// if(!req.body.username){
	// 	req.body.username = req.session.user.name;
	// }
	// 限制密码（6-16数字字母组合）
	// if(req.body.password !== ''){
	// 	var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
	// 	if(!reg.test(req.body.password)){
	// 		return res.redirect('/user/changeImage');
	// 	}
	// 	User.saltPassword(req.body.password, function (hash){
	// 		req.body.password = hash;
	// 		if(req.image){
	// 			User.update({_id:req.session.user._id}, {$set:{image:req.image/*, name:req.body.username*/, password:req.body.password}}, function (err, user){
	// 				if(err){
	// 					console.log(err);
	// 					return;
	// 				}
	// 				req.session.user.image = req.image;
	// 				// req.session.user.name = req.body.username;
	// 				res.redirect('/');
	// 			});
	// 		}else{
	// 			User.update({_id:req.session.user._id}, {$set:{/*name:req.body.username,*/ password:req.body.password}}, function (err, user){
	// 				if(err){
	// 					console.log(err);
	// 					return;
	// 				}
	// 				// req.session.user.name = req.body.username;
	// 				res.redirect('/');
	// 			});
	// 		}
	// 	});
	// }else{
	// 	if(req.image){
		// 	User.update({_id:req.session.user._id}, {$set:{image:req.image/*, name:req.body.username*/}}, function (err){
		// 		if(err){
		// 			console.log(err);
		// 			return;
		// 		}
		// 		req.session.user.image = req.image;
		// 		// req.session.user.name = req.body.username;
		// 		res.redirect('/');
		// 	});
		// }else{
		// 	User.update({_id:req.session.user._id}, {$set:{name:req.body.username}}, function (err, user){
		// 		if(err){
		// 			console.log(err);
		// 			return;
		// 		}
		// 		req.session.user.name = req.body.username;
		// 		res.redirect('/');
		// 	});
		// }
	// }
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
		// 通过校验压入图书
		user.purchaseList.push(_id);
		user.save(function (err, user){
			if(err){
				res.json({
					err:ERR
				});
				console.log(err);
				return;
			}
			// 对图书的阅读量进行增1操作
			Book.update({_id:_id}, {$inc:{addnumber:1}}, function (err){
				if(err){
					console.log(err);
					return;
				}
			});
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