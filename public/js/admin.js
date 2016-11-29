$(document).ready(function ($){
	$('.del').click(function (e){
		var target = $(e.target);
		var id = target.data('id');
		var tr = $('.item-id-' + id);

		$.ajax({
			type:'DELETE',
			url:'/admin/book/list?id=' + id,
		})
		.done(function (results){
			if(results.success === 1){
				if(tr.length > 0){
					tr.remove();
				}
			}
		});
	});

	$('#douban').blur(function (){
		var douban = $(this);
		var id = douban.val();
		if(id){
			// 请求豆瓣数据
			$.ajax({
				url:'https://api.douban.com/v2/book/' + id,
				cache:true,
				type:'get',
				dataType:'jsonp',
				crossDomain:true,
				jsonp:'callback',
				success:function (data){
					console.log(data);
					$('#inputTitle').val(data.title);
					$('#inputSubtitle').val(data.subtitle);
					$('#inputAuthor').val(data.author);
					$('#inputPoster').val(data.image);
					$('#inputImagesLarge').val(data.images.large);
					$('#inputImagesMedium').val(data.images.medium);
					$('#inputImagesSmall').val(data.images.small);
					$('#inputYear').val(data.pubdate);
					$('#inputAlt').val(data.alt);
					$('#inputPages').val(data.pages);
					$('#inputPrice').val(data.price);
					$('#inputPublisher').val(data.publisher);
					$('#inputRatingAverage').val(data.rating.average);
					$('#inputRatingNumRaters').val(data.rating.numRaters);
					$('#inputMax').val(data.rating.max);
					$('#inputMin').val(data.rating.min);
					$('#inputAuthor_intro').val(data.author_intro);
					// 选出tags中标记数量最多的做为此图书的默认标签
					var max = data.tags[0].count;
					var c = 0;
					for(var j = data.tags.length-1; j >= 0 ; j--){
						if(max < data.tags[j].count){
							max = data.tags[j].count;
							c = j;
						}
					}
					$('#inputCategory').val(data.tags[c].title);
					$('#inputSummary').val(data.summary);
					$('#inputCatalog').val(data.catalog);
					for(var i = 0; i < data.tags.length; i++){
						data.tags[i] = data.tags[i].title + '(' + data.tags[i].count + ')';
					}
					$('#inputTags').val(data.tags.join('  '));
				}
			});
		}
	});
});

// https://api.douban.com/v2/book/1220562

/*
tags 对象数组 name count title
	rating 评分 average numRaters max min
	images 图片地址 large medium small
	author_intro 作者简介
	catalog 章节信息
	publisher 出版商
	price 价格
	pages 页数
	pubdate 出版时间
	image 封面
	title 图书标题
	subtitle 副标题
	summary 简介
	alt 豆瓣地址
	author 作者数组
*/