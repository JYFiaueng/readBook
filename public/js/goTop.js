requirejs.config({
	paths:{
		//jquery : "http://apps.bdimg.com/libs/jquery/2.1.4/jquery.min"
		jquery : "../libs/jquery/dist/jquery.min"
	}
});

requirejs(["jquery", "backTop"], function($, backtop){
	$("#extraDiv1").backTop({
		mode:"move",
		speed: 400
	});
});