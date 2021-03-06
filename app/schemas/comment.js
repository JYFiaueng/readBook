/*定义评论的数据模式*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var CommentSchema = new Schema({
	book:{type:ObjectId, ref:'Book'},
	from:{type:ObjectId, ref:'User'},
	reply:[{
		from:{type:ObjectId, ref:'User'},
		to:{type:ObjectId, ref:'User'},
		content:String,
	}],
	content:String,
	meta:{
		createAt:{
			type:Date,
			default:Date.now()
		},
		updateAt:{
			type:Date,
			default:Date.now()
		}
	}
});

// 每次在存储数据之前都要调用一次这个方法
CommentSchema.pre('save', function (next){
	// 判断这个数据是否为新的数据
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	next();
});

// 在模型上添加一些静态方法
CommentSchema.statics = {
	fetch:function (cb){
		return this
			.find({})
			.sort('meta.updateAt')
			.exec(cb);
	},
	findById:function (id, cb){
		return this
			.findOne({_id:id})
			.exec(cb);
	}
};

module.exports = CommentSchema;