var crypto = require('crypto');
var bcrypt = require('bcryptjs');


var should = require('should');
var app = require('../../app');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var user;
// test
describe('<Unit Test', function (){

	describe('Model User:', function (){

		// 测试之前产生一个随机的用户名字符串
		before(function (done){
			user = {
				name:getRandomString(),
				password:'password'
			};
			done();
		});

		// 确保数据库中没有随机产生的这个测试用户名
		describe('Before Method save', function (){
			it('should begin without test user', function (done){//一个it代表一个测试用例
				User.find({name:user.name}, function (err, users){
					users.should.have.length(0);
					done();
				});
			});
		});

		// 开始测试
		describe('User save', function (){

			// 保存函数的单元测试
			it('should save without problems', function (done){
				var _user = new User(user);
				_user.save(function (err){
					should.not.exist(err);//判断err是否为真
					_user.remove(function (err){
						should.not.exist(err);
						done();
					});
				});
			});

			// 密码的单元测试
			it('should password be hashed correctly', function (done){
				var password = user.password;
				var _user = new User(user);
				_user.save(function (err){
					should.not.exist(err);//判断err是否为真
					_user.password.should.not.have.length(0);
					bcrypt.compare(password, _user.password, function (err, isMatch){
						should.not.exist(err);//判断err是否为真
						isMatch.should.equal(true);
						_user.remove(function (err){
							should.not.exist(err);
							done();
						});
					});
				});
			});

			// 权限的单元测试
			it('should have default role 0', function (done){
				var _user = new User(user);
				_user.save(function (err){
					_user.role.should.equal(0);
					_user.remove(function (err){
						done();
					});
				});
			});

			// 测试重复的用户名
			it('should fail to save an existing user', function (done){
				var _user1 = new User(user);
				_user1.save(function (err){
					should.not.exist(err);
					var _user2 = new User(user);
					_user2.save(function (err){
						should.exist(err);//user2保存时应该会抛出错误，因为user1已经将此用户名保存过了
						_user1.remove(function (err){
							if(!err){
								_user2.remove(function (err){
									done();
								});
							}
						});
					});
				});
			});

		});

		after(function(done) {
			// clear user info...
			done();
		});

	});

});

// 产生一个默认长度为16的字符串
function getRandomString(len){
	if(!len) len = 16;
	return crypto.randomBytes(Math.ceil(len/2)).toString('hex');
	// 生成加密用的伪随机码，支持2种方法，当传递cb的话就是异步方法，不传cb就是同步方法
}