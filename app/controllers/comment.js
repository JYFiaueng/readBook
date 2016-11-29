// 这里是和评论相关的路由

var Comment = require('../models/comment');
var _ = require('underscore');

// comment
exports.save = function (req, res){
	var _comment = req.body.comment;
	var bookId = _comment.book;
	var comment = new Comment(_comment);

	// 如果回复的人是自己，就当作一条评论存入
	if(_comment.tid === req.session.user._id){
		comment.save(function (err, comment){
			if(err){
				console.log(err);
				return;
			}
			res.redirect('/book/' + bookId);
		});
		return;
	}
	// 判断是不是一条回复，如果是的话找到被回复者，将回复者的id和内容存入其reply中
	if(_comment.cid){
		Comment.findById(_comment.cid, function (err, comment){
			var reply = {
				from:_comment.from,
				to:_comment.tid,
				content:_comment.content
			};
			comment.reply.push(reply);
			comment.save(function (err, comment){
				if(err){
					console.log(err);
					return;
				}
				res.redirect('/book/' + bookId);
			});
		});
	}else{
		comment.save(function (err, comment){
			if(err){
				console.log(err);
				return;
			}
			res.redirect('/book/' + bookId);
		});
	}

};