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
				}
			});
		}
	});
});