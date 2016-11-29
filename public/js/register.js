$(document).ready(function ($){
	$('#register').click(function (e){
		var data = {
			user:{
				name:$('#signupName').val() || '',
				password:$('#signupPassword').val() || ''
			}
		};
		if(data.user.name.length > 1 && data.user.password.length > 5 && data.user.name.length < 17 && data.user.password.length < 17){
			$.post('/user/signup', data, function (data){
				if(data.err === 1){
					alert('该用户名已被占用');
				}else if(data.err === 0){
					location.href = '/';
				}else if(data.err === 2){
					alert('密码必须由6-16位数字和字母组合');
				}
			});
		}
	});
});