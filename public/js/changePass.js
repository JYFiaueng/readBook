$(document).ready(function ($){
	var fp = $('#changePass');
	var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
	fp.click(function (){
		var id = $('#userId').val();
		var password = $('#Password').val();
		console.log(password);
		console.log(id);
		if(!reg.test(password)){
			alert('请输入有效的密码');
			return;
		}
		$.get('/user/changePass', {id:id, password:password}, function (data){
			if(data.result == '1'){
				alert('修改成功');
				location.href='/';
			}else if(data.result == '0'){
				alert('请输入有效的密码');
			}
		});
	});
});