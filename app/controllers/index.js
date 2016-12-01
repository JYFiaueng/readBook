// 这个文件的作用是和首页进行交互

var Book = require('../models/book');
var Category = require('../models/category');

var App;
exports.loadApp = function (app){
	App = app;
};

// index page
exports.index = function (req, res){
	console.log(App == req.app);//true，这样居然可以直接得到app对象，根本不需要进行引入
	Category
		.find({})
		.populate({path:'books', options:{limit:6,sort:{pv:-1}}})
		.exec(function (err, categories){
			if(err){
				console.log(err);
				return;
			}
			Book.find({})
				.sort({addnumber:-1})
				.limit(5)
				.exec(function (err, hotBook){
					res.render('index', {
						title:App.locals.inxt.t('Home'),
						categories:categories,
						hotBook:hotBook
					});
				});
		});
};

// search page
exports.search = function (req, res){
	var catId = req.query.cat;
	var q = req.query.q;
	var page = parseInt(req.query.p) || 0;
	var count = 6;
	var index = page * count;
	var reg = new RegExp(q+'.*', 'i');
	// 如果有catId就是点击的分类标题，没有就是搜索的
	if(catId){
		Category
			.findOne({_id:catId})
			.populate({
				path:'books',
				select:'title poster'
			})
			.exec(function (err, category){
				if(err){
					console.log(err);
					return;
				}
				var books = category.books || 0;
				var results = books.slice(index, index+count);
				res.render('results', {
					title:App.locals.inxt.t('Search')+App.locals.inxt.t('Result'),
					keyword:category.name,//关键字
					currentPage:page+1,//当前页面
					query:'cat=' + catId,//查询字符串
					totalPage:Math.ceil(books.length/count),//页面数量
					books:results
				});
			});
	}else{
		Book
			// .find({title:reg, tags:reg, author:reg})//使用正则做到模糊匹配
			.find({$or:[{'title':reg},{tags:reg},{author:reg},{publisher:reg}]})//使用正则做到模糊匹配
			.exec(function (err, books){
				if(err){
					console.log(err);
					return;
				}
				var results = books.slice(index, index+count);
				res.render('results', {
					title:App.locals.inxt.t('Search')+App.locals.inxt.t('Result'),
					keyword:q,//关键字
					currentPage:page+1,//当前页面
					query:'q=' + q,//查询字符串
					totalPage:Math.ceil(books.length/count),//页面数量
					books:results
				});
			});
	}
};

// search page
/*exports.search = function (req, res){
	var catId = req.query.cat;
	var page = req.query.p;
	var index = page * 2;
	Category
		.findOne({_id:catId})
		.populate({
			path:'movies',
			select:'title poster',
			options:{limit:2, skip:index}
		})
		.exec(function (err, category){
			if(err){
				console.log(err);
				return;
			}
			res.render('results', {
				title:'结果列表页面',
				keyword:category.name,
				category:category
			});
		});
};*/