// 这里是和分类相关的路由

var Category = require('../models/category');
var _ = require('underscore');

var App;
exports.loadApp = function (app){
	App = app;
};

// admin page
exports.new = function (req, res){
	res.render('category_admin', {
		title:App.locals.inxt.t('AddCategory'),
		category:{}
	});
};

// category update
exports.update = function (req, res){
	var id = req.params.id;
	if(id){
		Category.findById(id, function (err, category){
			res.render('category_admin', {
				title:App.locals.inxt.t('change')+App.locals.inxt.t('categoryName'),
				category:category
			});
		});
	}
};

// category post
exports.save = function (req, res){
	var _category = req.body.category;
	var id = req.body.category._id;
	if(id){
		Category.findById(id, function (err, category){
			if(err){
				console.log(err);
				return;
			}
			category = _.extend(category, _category);
			category.save(function (err, category){
				if(err){
					console.log(err);
					return;
				}
				res.redirect('/admin/category/list');
			});
		});
	}else{
		var category = new Category(_category);
		category.save(function (err, category){
			if(err){
				console.log(err);
				return;
			}
			res.redirect('/admin/category/list');
		});
	}
};

// list page
exports.list = function (req, res){
	var queryStr = req.query.queryStr || '';
	Category.fetch(function (err, categories){
		if(err){
			console.log(err);
			return;
		}
		res.render('categorylist', {
			title:App.locals.inxt.t('categoryName')+App.locals.inxt.t('list'),
			categories:categories,
			queryStr:queryStr
		});
	});
};

// category delete
exports.del = function (req, res){
	var id = req.query.id;
	if(id){
		Category.remove({_id:id}, function (err, categories){
			if(err){
				console.log(err);
				return;
			}else{
				res.json({success:1});
			}
		});
	}
};