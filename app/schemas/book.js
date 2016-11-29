/*定义图书的数据模式*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var BookSchema = new Schema({
	author:String,
	alt:String,
	title:String,
	subtitle:String,
	summary:String,
	poster:String,
	publisher:String,
	year:String,
	price:String,
	pages:String,
	catalog:String,
	author_intro:String,
	images:{
		large:String,
		medium:String,
		small:String
	},
	rating:{
		average:Number,
		numRaters:Number,
		max:Number,
		min:Number
	},
	tags:String,
	pv:{
		type:Number,
		default:0
	},
	category:{
		type:ObjectId,
		ref:'Category'
	},
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
BookSchema.pre('save', function (next){
	// 判断这个数据是否为新的数据
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	next();
});

// 在模型上添加一些静态方法
BookSchema.statics = {
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

module.exports = BookSchema;