$(document).ready(function ($){
	var fp = $('#findPass');
	fp.click(function (){
		var regEmail = /^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/;
		var email = $('#email').val();
		if(!regEmail.test(email)){//用户输入的是邮箱
			alert('请输入有效的邮箱');
			return;
		}
		$.get('/user/findPass', {email:email}, function (data){
			if(data.result == '1'){
				alert('链接已经发送至邮箱，请通过邮箱修改密码');
				fp.attr('disabled', true);
				fp.html('一分钟后可再次发送');
				setTimeout(function (){
					fp.attr('disabled', false);
					fp.html('未收到？再次发送');
				}, 1000*60);
			}else if(data.result == '0'){
				alert('请输入有效的邮箱');
			}
		});
	});
});