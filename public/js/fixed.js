// 制作热门图书的滑动固定效果
$(document).ready(function($){
	var p = $('#hotbook').position();
	var w = $('#hotbook').width();
	var t = 0;
	var f1 = true;
	var f2 = false;
	w += 30;
	$(document).scroll(function (){
		t = $(document).scrollTop();
		if(t > 153 && f1){
			$('#hotbook').css({
				position:'fixed',
				left:p.left+'px',
				top:'15px',
				width:w+'px',
			});
			f2 = true;
			f1 = false;
		}
		if(t < 153 && f2){
			$('#hotbook').css({
				position:'relative',
				left:'0px',
				top:'0px'
			});
			f2 = false;
			f1 = true;
		}
	});
});