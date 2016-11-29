$(document).ready(function ($){

	// 用户点击头像进行回复时添加隐藏的回复对象的表单域，表单上传到服务器后进行数据处理存储到数据库中
	$('.comment').click(function (e){
		var target = $(this);
		var toId = target.data('tid');
		var commentId = target.data('cid');
		// 以最后一次点击的头像为准
		if($('#toId').length > 0){
			$('#toId').val(toId);
		}else{
			$('<input>').attr({
				type:'hidden',
				id:'toId',
				name:'comment[tid]',
				value:toId
			}).appendTo('#commentForm');
		}
		if($('#commentId').length > 0){
			$('#commentId').val(commentId);
		}else{
			$('<input>').attr({
				type:'hidden',
				id:'commentId',
				name:'comment[cid]',
				value:commentId
			}).appendTo('#commentForm');
		}
	});

	$('#addList').click(function (e){
		var bid = $('#bookId').val();
		if($('#userLogin').val() == '0'){
			// 未登录弹出登录窗
			console.log($('#signinModal'));
			$('#signinModal').modal('toggle');
		}else if($('#userLogin').val() == '1'){
			$.post('/user/book/list/add?id=' + bid, function (result){
				// 添加书单成功与否的弹窗提示
				$('#addListSuccess').modal('show');
				if(result.err === 1){
					$('#addListTitle').html('添加失败');
				}else if(result.err === 0){
					$('#addListTitle').html('添加成功');
				}else if(result.err === 2){
					$('#addListTitle').html('书籍重复或书单满了');
				}
				var t = 3;
				$('#addListTime').html(t);
				var s = setInterval(function (){
					if(t === 0){
						clearInterval(s);
						$('#addListSuccess').modal('hide');
						return;
					}
					t--;
					$('#addListTime').html(t);
				}, 1000);
			});
		}
	});

});