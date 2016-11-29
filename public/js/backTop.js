//返回顶部组件

define(['jquery', 'scrollTo'], function($, scrollto){
	function BackTop(el, opts){
		this.opts = $.extend({}, BackTop.DEFAULTS, opts);
		this.$el = $(el);
		this.scroll = new scrollto.ScrollTo({
			dest:this.opts.dest,
			speed:this.opts.speed
		});
		this._checkPosition();
		if(this.opts.mode == "move"){
			this.$el.on("click", $.proxy(this._move, this));
		}else{
			this.$el.on("click", $.proxy(this._go, this));
		}
		$(window).on("scroll", $.proxy(this._checkPosition, this));
	}
	BackTop.DEFAULTS = {
		mode:"move",
		pos:$(window).height(),
		speed:800,
		dest:0
	};
	BackTop.prototype._move = function(){
		this.scroll.move();
	};
	BackTop.prototype._go = function(){
		this.scroll.go();
	};
	BackTop.prototype._checkPosition = function(){
		var $el = this.$el;
		if($(window).scrollTop() > this.opts.pos){
			$el.fadeIn();
		}else{
			$el.fadeOut();
		}
	};

	//添加到jquery的原型链上，注册成插件
	$.fn.extend({
		backTop:function(opts){
			return this.each(function(){
				new BackTop(this, opts);
			});
		}
	});

	return {
		BackTop: BackTop
	};
});