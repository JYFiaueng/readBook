$(document).ready(function ($){
	$('.del').click(function (e){
		var target = $(e.target);
		var id = target.data('id');
		var tr = $('.item-id-' + id);

		$.ajax({
			type:'DELETE',
			url:'/user/book/list/del?id=' + id,
		})
		.done(function (results){
			if(results.err === 0){
				if(tr.length > 0){
					tr.remove();
				}
			}else if(results.err === 1){
				alert('删除失败');
			}
		});
	});
});