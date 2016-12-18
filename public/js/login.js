$(document).ready(function ($){
	$('#login').click(function (e){
		var data = {
			user:{
				name:$('#signinName').val() || '',
				password:$('#signinPassword').val() || ''
			},
			captcha:$('#captcha').val()
		};
		if(data.user.name && data.user.password){
			$.post('/user/signin', data, function (data){
				if(data.err === 1){
					alert('用户名或密码错误');
				}else if(data.err === 0){
					location.href = '/';
				}else if(data.err === 4){
					alert('请激活账户之后再进行登录');
				}else if(data.err === 6){
					alert('验证码错误');
				}
				ChangeCaptcha();
			});
		}
	});

	if($('#closeSignin')){
		$('#closeSignin').click(function (e){
			$('#signinName').val('');
			$('#signinPassword').val('');
		});
	}

	$('#changeCaptcha').click(function (e){
		ChangeCaptcha();
	});

	function ChangeCaptcha(){
		$.get('/captcha', function (data){
			var html = '<iframe src="captcha.svg" width="150" height="50" style="overflow:hidden;border:none;"></iframe>';
			$('#captchaImg').html(html);
		});
	}

	$('#ALogin').click(function (e){
		ChangeCaptcha();
	});

	ChangeCaptcha();

});