$(document).ready(function ($){
	$('#login').click(function (e){
		var data = {
			user:{
				name:$('#signinName').val() || '',
				password:$('#signinPassword').val() || ''
			}
		};
		if(data.user.name && data.user.password){
			$.post('/user/signin', data, function (data){
				if(data.err === 1){
					alert('用户名或密码错误');
				}else if(data.err === 0){
					location.href = '/';
				}else if(data.err === 4){
					alert('请激活账户之后再进行登录');
				}
			});
		}
	});
	if($('#closeSignin')){
		$('#closeSignin').click(function (e){
			$('#signinName').val('');
			$('#signinPassword').val('');
		});
	}
});