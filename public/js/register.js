$(document).ready(function ($){
	var againData;
	$('#register').click(function (e){
		var data = {
			user:{
				name:$('#signupName').val() || '',
				email:$('#signupEmail').val() || '',
				password:$('#signupPassword').val() || ''
			}
		};
		againData = data;
		var d = data.user;
		var emailReg = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
		if(!emailReg.test(d.email)){
			alert('邮箱格式错误');
			return;
		}
		if(d.name.length > 1 && d.password.length > 5 && d.name.length < 17 && d.password.length < 17){
			$.post('/user/signup', data, function (data){
				if(data.err === 1){
					alert('该用户名已被占用');
				}else if(data.err === 0){
					location.href = '/';
				}else if(data.err === 2){
					alert('密码必须由6-16位数字和字母组合');
				}else if(data.err === 3){
					alert('邮箱错误或已经被注册');
				}else if(data.err === 4){
					alert('已经向指定邮箱发送链接，请前去激活账户');
					$('#againSend').attr('disabled', false);
				}else if(data.err === 5){
					alert('用户名不能是邮箱');
				}
			});
		}else{
			alert('请输入符合要求的用户名或密码');
		}
	});

	var t;
	$('#againSend').click(function (e){
		if(againData){
			$.post('/user/signup?again=again', againData, function (data){
				if(data.err === 4){
					alert('已经向指定邮箱发送链接，请前去激活账户');
					$('#againSend').attr('disabled', true);
					$('#againSend').html('5分钟后可再次发送');
					t = setTimeout(function (){
						$('#againSend').attr('disabled', false);
						$('#againSend').html('未收到？再次发送');
					}, 1000*60*5);
				}
			});
		}
	});

	// header.jade里面的关闭弹窗逻辑
	if($('#closeSignup')){
		$('#closeSignup').click(function (e){
			$('#againSend').attr('disabled', true);
			$('#signupName').val('');
			$('#signupEmail').val('');
			$('#signupPassword').val('');
			clearTimeout(t);
			$('#againSend').html('未收到？再次发送');
		});
	}

});