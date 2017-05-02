$(document).ready(function ($){
	$('.changeRole').click(function (e){
		var target = $(e.target);
		var id = target.data('id');
		var tr = $('.item-id-' + id);
		var role = tr.find('input').val();
		$.ajax({
			type:'post',
			url:'/user/changeRole?id=' + id + '&role=' + role,
		})
		.done(function (results){
			if(results.success === 1){
				alert('修改成功!');
				tr.find('.role').html(role);
				tr.find('input').val('');
			}else{
				alert('修改失败!');
			}
		});
	});
});