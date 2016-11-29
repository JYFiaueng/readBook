// 这里是和图书相关的方法

var Book = require('../models/book');
var Comment = require('../models/comment');
var Category = require('../models/category');
var _ = require('underscore');
var fs = require('fs');
var path = require('path');

var App;
exports.loadApp = function (app){
	App = app;
};

// detail page
exports.detail = function (req, res){
	var id = req.params.id;
	// 针对每次图书详情页的访问将图书文档的pv字段进行自增操作
	Book.update({_id:id}, {$inc:{pv:1}}, function (err){
		if(err){
			console.log(err);
			return;
		}
	});
	// 查找数据并向用户展示详情页
	Book.findById(id, function (err, book){
		if(err){
			console.log(err);
			return;
		}
		Comment
			.find({book:id})
			.populate('from', 'name image')//查询关联的User的数据，在schemas已经关联过了
			.populate('reply.from', 'name image')
			.populate('reply.to', 'name image')
			.exec(function (err, comments){
				if(err){
					console.log(err);
					return;
				}
				res.render('detail', {
					title:book.title,
					book:book,
					comments:comments
				});
			});
	});
};

// admin page
exports.new = function (req, res){
	Category.find({}, function (err, categories){
		if(err){
			console.log(err);
			return;
		}
		res.render('admin', {
			title:App.locals.inxt.t('book')+App.locals.inxt.t('submit'),
			categories:categories,
			book:{
				images:{},
				rating:{}
			}
		});
	});
};

// admin update book
exports.update = function (req, res){
	var id = req.params.id;
	if(id){
		Book.findById(id, function (err, book){
			Category.find({}, function (err, categories){
				res.render('admin', {
					title:App.locals.inxt.t('book')+App.locals.inxt.t('update'),
					book:book,
					categories:categories
				});
			});
		});
	}
};

// admin poater 针对海报上传所做的中间件
exports.savePoster = function (req, res, next){
	var posterData = req.files.uploadPoster;//图片数据
	var filePath = posterData.path;//文件路径
	var originalFilename = posterData.originalFilename;//图片原始名字
	if(originalFilename){
		fs.readFile(filePath, function (err, data){
			var timestamp = Date.now();//时间戳
			var type = posterData.type.split('/')[1];//文件类型
			var poster = timestamp + '.' + type;//新的文件名
			var newPath = path.join(__dirname, '../../', '/public/upload/' + poster);//构建文件在服务器上的路径
			fs.writeFile(newPath, data, function (err){//将文件写入到指定位置
				if(err){
					console.log(err);
				}
				req.poster = poster;
				next();
			});
		});
	}else{
		next();
	}
};

// admin post book
exports.save = function (req, res){
	var id = req.body.book._id;
	var bookObj = req.body.book;
	var _book;

	// 如果有文件被上传上来，就将海报地址改为上传上来的文件所在的地址，执行后续操作即可
	if(req.poster){
		bookObj.poster = req.poster;
	}

	// 如果有id，说明是一次更新，没有id说明是一次插入
	if(id){
		Book.findById(id, function (err, book){
			if(err){
				console.log(err);
				return;
			}
			_book = _.extend(book, bookObj);
			_book.save(function (err, book){
				if(err){
					console.log(err);
					return;
				}
				res.redirect('/book/' + book._id);
			});
		});
	}else{
		_book = new Book(bookObj);
		var categoryId = _book.category;
		var categoryName = bookObj.categoryName;
		Book.findOne({alt:bookObj.alt}, function (err, book){
			if(err){
				console.log(err);
				return;
			}
			// 图书已经存在
			if(book){
				return res.redirect('/admin/book/new');
			}
			_book.save(function (err, book){
				if(err){
					console.log(err);
					return;
				}
				// 将新添加的电影的id存入category集合中
				if(categoryId){//选中了单选框的分类优先级更高
					Category.findById(categoryId, function (err, category){
						category.books.push(book._id);
						category.save(function (err, category){
							res.redirect('/admin/book/list');
						});
					});
				}else if(categoryName){//自定义的分类，将此分类添加到category集合中
					// 判断用户的自定义分类是否在数据库中已经存在了
					Category.findOne({name:categoryName}, function (err, category){
						if(err){
							console.log(err);
							return;
						}
						// 如果存在直接将图书压入即可，不存在就新建一个分类
						if(category){
							category.books.push(book._id);
						}else{
							category = new Category({
								name:categoryName,
								books:[book._id]
							});
						}
						category.save(function (err, category){
							// 为具有新的分类的新添加的图书加上category，不然这个图书就没有category属性了
							book.category = category._id;
							book.save(function (err, book){
								res.redirect('/admin/book/list');
							});
						});
					});
				}
			});
		});
	}
};

// list page
exports.list = function (req, res){
	var queryStr = req.query.queryStr || '';
	Book.fetch(function (err, books){
		if(err){
			console.log(err);
			return;
		}
		res.render('list', {
			title:App.locals.inxt.t('book')+App.locals.inxt.t('list'),
			books:books,
			queryStr:queryStr
		});
	});
};

// list delete book
exports.del = function (req, res){
	var id = req.query.id;
	if(id){
		Book.remove({_id:id}, function (err, book){
			if(err){
				console.log(err);
				return;
			}else{
				res.json({success:1});
			}
		});
	}
};