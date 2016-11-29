/*定义用户数据模式*/

var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var SALT_WORK_FACTOR = 10;

var UserSchema = new Schema({
	name:{
		unique:true,
		type:String
	},
	image:{
		type:String,
		default:'http://img.mukewang.com/57c04d3d0001b57f19201200-200-200.jpg'
	},
	password:String,
	// 0:nomal user 
	// 1:verified user
	// 2:professional user
	// >10:admin
	// >50:super admin
	role:{
		type:Number,
		default:0
	},
	lastLogin:{
		type:Date,
		default:Date.now()
	},
	pv:{
		type:Number,
		default:1
	},
	purchaseList:[{
		type:ObjectId,
		ref:'Book'
	}],
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
UserSchema.pre('save', function (next){
	var user = this;
	// 判断这个数据是否为新的数据
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	// 对密码进行加盐
	bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt){
		if(err) return next(err);
		bcrypt.hash(user.password, salt, function (err, hash){
			if(err) return next(err);
			user.password = hash;
			next();
		});
	});
});

// 实例方法
UserSchema.methods = {
	comparePassword:function (_password, cb){
		bcrypt.compare(_password, this.password, function (err, isMatch){
			if(err) return cb(err);
			cb(null, isMatch);
		});
	}
};

// 在模型上添加一些静态方法
UserSchema.statics = {
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
	},
	saltPassword:function (pwd, cb){
		bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt){
			if(err){
				console.log(err);
				return;
			}
			var _password = pwd;
			var _cb = cb;
			bcrypt.hash(_password, salt, function (err, hash){
				if(err){
					console.log(err);
					return;
				}
				console.log(hash);
				_cb(hash);
			});
		});
	}
};

module.exports = UserSchema;