/*/영현 외/*/

$(window).ready(function(){
	var xData;
	var festival_name=[{name:"6월 축제",src:"img/news_2.jpg"},{name:"7월 축제",src:"img/news_1.jpg"},{name:"8월 축제",src:"img/news_2.jpg"},{name:"9월 축제",src:"img/news_1.jpg"},{name:"10월 축제",src:"img/news_2.jpg"}]; //뉴스피드에서 검색 키워드, 사진 src
	//조회되는 축제의 수가 5개 안될 경우를 대비하여 default값 삽입
	var keyword_array = []; //자동완성 검색어 기능에 데이터가 되는 배열
	var xFestival=$.ajax("festival.txt");
	xFestival.done(function(data,status){
		var count=0;
		xData=JSON.parse(data);
		var ditr=$("section").find("div.item-wrap");
		for(var j=0;j<xData.length;j++){
			//index page init
			keyword_array[j]=xData[j].title;
			var urls=xData[j].pic;
			ditr.eq(j).find("h2").append(xData[j].title);
			var fes_img=ditr.eq(j).find("div.slideshow").find('img');
			fes_img.eq(0).attr("src",urls[0]);
			fes_img.eq(1).attr("src",urls[1]);
			fes_img.eq(2).attr("src",urls[2]);

			//news page init
			var tmp="";
			var Now = new Date(); // Tue Oct 20 2015 10:48:49 GMT+0900 (대한민국 표준시) 라고 표시됩니다.
			tmp+=Now.getFullYear().toString(); //2018 ->18로 자름
			if(Now.getMonth()<10)
				tmp+="0";
			tmp+=Now.getMonth()+1;
			tmp+=Now.getDate(); //tmp 180000 형식의 오늘 날짜

			var fes_Date=xData[j].date; //축제 날짜
			var fes_DateArr=fes_Date.split("~"); //~을 기준으로 시작날짜 끝나는 날짜
			var fes_splitArr=fes_DateArr[0].split("-");//시작날짜 
			fes_DateArr[0]=fes_splitArr.join(""); //2018-00-00 -> 20180000

			var fes_splitArr=fes_DateArr[1].split("-"); //끝나는 날짜
			fes_DateArr[1]=fes_splitArr.join(""); //2018-00-00 -> 20180000
			if(fes_DateArr[0]<=tmp && tmp<=fes_DateArr[1]){
				if(count<5){
					festival_name[count++]={name:xData[j].title,src: xData[j].pic[0]};
				}
				else{
					count=Math.floor(Math.random()*4) + 1;
					festival_name[count]={name:xData[j].title,src: xData[j].pic[0]};
				}
			}
		}

		var news_wrap=$("section").find("div.news-wrap");
		var news_count=$(".news").length;
	for(var i=0;i<news_count;i++){ //display: none 넣기
		$.ajax({
			url: "news_test.php?keyword="+festival_name[i].name,
			type : "GET", 
			dataType : 'html',
			async: false,
			success: function(result){
				var news=news_wrap.eq(i).find(".news");
				var news_img=news_wrap.eq(i).find('img');
				news.html(result);
				var items=news.find("item");
				if(items.length > 0){
					items=items.slice(0,3);
					var uTag=$("<ul/>");
					items.each(function(){
						var item=$(this);
						var lk=item.find("originallink").text();
						var title=item.find("title").text();
						var aTag=$("<a />").attr({
							"href":lk,
							"target":"_blank"
						}).text(title);
						var liTag=$("<li />").append(aTag);
						uTag.append(liTag);
						uTag.append('<br>');
					});
					news.empty();
					news.append('<div class="news-title">'+festival_name[i].name+'</div>');
					news.append(uTag);
				}
				else{
					news.empty();
					news.append('<div class="news-title">'+festival_name[i].name+'</div>');
					news.append('<li>정보가 없습니다.</li>');
				}
				news_img.attr("src",festival_name[i].src);
			}
		})
	}
});

	//mainPage : 이미지 슬라이드
	var interval=2000;
	var timer;
	$('.slideshow').each(function(){
		var container =$(this);
		function switchImg(){
			var imgs=container.find('img');
			var first=imgs.eq(0);
			var second=imgs.eq(1);
			first.appendTo(container).fadeOut(800);
			second.fadeIn();
			
		}
		function startTimer(){
			timer=setInterval(switchImg,interval);
		}
		function stopTimer(){
			clearInterval(timer);
		}
		
		container.find('img').hover(startTimer,stopTimer);
		
	});



//자동완성 기능
$("#search").autocomplete({source: keyword_array});
//검색버튼 눌렀을 때
$("#search").keyup(function(e){
	if(e.keyCode==13){
		var search_key=$("#search").val();
		$("#search").val('');
		var i;
		for(i=0;i<keyword_array.length;i++){
			if(search_key==keyword_array[i])
				break;

		}
		if(i==keyword_array.length){
			alert('찾으시는 축제가 없습니다');
			return;
		}
		$("#content-wrap").css("display","none");
		$("#event-wrap").css("display","flex");
        $("section.rg-gr-wrapper").css("display","none");

		var ditr=$("#event-wrap");
		$("#event-title").text('');
		ditr.find("h1").append(xData[i].title);
		console.log(ditr.find("h1").val());
		var fes_img=ditr.find("div.slideshow2").find('img');
		for(var t=0;t<3;t++){
			fes_img.eq(t).attr("src",xData[i].pic[t]);
		}
		$("#content2-detail").text('');
		$("#con").text('');
		$("#etc").text('');
		ditr.find("div#event-content").find("#content2-detail").append("이름 : "+
			xData[i].title+"<br>일시 : "+xData[i].date+"<br>장소 : "
			+xData[i].place+"<br>");
		ditr.find("div#event-content").find("dl").find("dd#con").append(xData[i].content);
		ditr.find("div#event-content").find("dl").find("dd#etc").append(xData[i].etc);


	}
})
$("#search-input").click(function(){
	var search_key=$("#search").val();
	$("#search").val('');
	var i;
	for(i=0;i<keyword_array.length;i++){
		if(search_key==keyword_array[i])
			break;

	}
	if(i==keyword_array.length){
		alert('찾으시는 축제가 없습니다');
		return;
	}
	$("#content-wrap").css("display","none");
	$("#event-wrap").css("display","flex");

	var ditr=$("#event-wrap");
	$("#event-title").text('');
	ditr.empty();
	ditr.find("h1").append(xData[i].title);
	var fes_img=ditr.find("div.slideshow2").find('img');
	for(var t=0;t<3;t++){
		fes_img.eq(t).attr("src",xData[i].pic[t]);
	}
	$("#content2-detail").text('');
	$("#con").text('');
	$("#etc").text('');
	ditr.find("div#event-content").find("#content2-detail").append("이름 : "+
		xData[i].title+"<br>일시 : "+xData[i].date+"<br>장소 : "
		+xData[i].place+"<br>");
	ditr.find("div#event-content").find("dl").find("dd#con").append(xData[i].content);
	ditr.find("div#event-content").find("dl").find("dd#etc").append(xData[i].etc);
})

// event 추가
var slideIndex=1;
showImg(slideIndex);
$(".left").click(function(){
	showImg(--slideIndex);
});
$(".right").click(function(){
	showImg(++slideIndex);
});

function showImg(s_index){
	var imgs=$('.slideshow2').find('.con2-img');
	imgs.css({display:'none'});
	if(s_index>3)
		slideIndex=1;
	if(s_index<1)
		slideIndex=3;
	imgs.eq(slideIndex-1).css({display:'block'});
}

$(".accordion").each(function(){
	var dl=$(this);
	var allDt=dl.find("dt");
	var allDd=dl.find("dd");
	function closeAll(){
		allDd.addClass("closed");
		allDt.addClass("closed");
	}
	function open(dt,dd){
		dt.removeClass("closed");
		dd.removeClass("closed");
	}
	closeAll();
	allDt.click(function(){
		var dt=$(this);
		var dd=dt.next();
		if(dt.hasClass("closed")){
			open(dt,dd);
		}
		else{
			dt.addClass("closed");
			dd.addClass("closed");
		}
	});

});

$("#menu1").click(function(){
	$("#region").show();
});
var previous_url;
$("img.exit").each(function(){
	$(this).click(function(){
		$("#region").hide();
		$("#category").hide();
	});
});
$("#menu2").click(function(){
	$("#category").show();
});
$("#menu2").click(function(){
	previous_url=location.href;
	location.href='theme.html';
});

$("#cart").click(function(){
	$("#content-wrap").css("display","none");
	$("#bookmark").css("display","grid");
	for(var i=0;i<xData.length;i++){
		var checkid="#marking"+(i+1);
		if($(checkid).prop("checked")){
			$("#bookmark").append("<div class='item-wrap'>"+"<div class='bookimage'>"
				+"<img src='"+xData[i].pic[0]+"'/></div>"+
				"<h2>"+xData[i].title+"</h2>"+"</div>");
		}
		else
			continue;
	}
});

$(".slideshow").click(function(){
	$("#content-wrap").css("display","none");
	$("#event-wrap").css("display","flex");
	var index=$(".slideshow").index(this);
	var ditr=$("#event-wrap");
	ditr.find("h1").append(xData[index].title);
	var fes_img=ditr.find("div.slideshow2").find('img');
	for(var t=0;t<3;t++){
		fes_img.eq(t).attr("src",xData[index].pic[t]);
	}
	ditr.find("div#event-content").find("#content2-detail").append("이름 : "+
		xData[index].title+"<br>일시 : "+xData[index].date+"<br>장소 : "
		+xData[index].place+"<br>");
	ditr.find("div#event-content").find("dl").find("dd#con").append(xData[index].content);
	ditr.find("div#event-content").find("dl").find("dd#etc").append(xData[index].etc);
});


// genre

var seashowindex=0;
$("#next").click(function(){
		seashowindex++;
		if(seashowindex==1){
			$("#pre").css("display","inline-block");
		}
		else if(seashowindex==3){
			$(this).css("display","none");
		}
		$("img.sea").each(function(){
			$(this).css("display","none");
		});
		var wholeseaimgs=$("#slide1").find('img.sea');
		for(var i=seashowindex;i<seashowindex+4;i++){
			wholeseaimgs.eq(i).css("display","inline-block");
		}
});
$("#pre").click(function(){
	seashowindex--;
	if(seashowindex==2){
		$("#next").css("display","inline-block");
	}
	else if(seashowindex==0){
		$(this).css("display","none");
	}
	$("img.sea").each(function(){
		$(this).css("display","none");
	});
	var wholeseaimgs=$("#slide1").find('img.sea');
	for(var i=seashowindex;i<seashowindex+4;i++){
		wholeseaimgs.eq(i).css("display","inline-block");
	}
});



var cultureshowindex=0;
$("#next2").click(function(){
	cultureshowindex++;
	if(cultureshowindex==1){
		$("#pre2").css("display","inline-block");
	}
	else if(cultureshowindex==2){
		$(this).css("display","none");
	}
	$("img.culture").each(function(){
		$(this).css("display","none");
	});
	var wholecultureimgs=$("#slide2").find('img.culture');
	for(var i=cultureshowindex;i<cultureshowindex+4;i++){
		wholecultureimgs.eq(i).css("display","inline-block");
	}
});

$("#pre2").click(function(){
	cultureshowindex--;
	if(cultureshowindex==1){
		$("#next2").css("display","inline-block");
	}
	else if(cultureshowindex==0){
		$(this).css("display","none");
	}
	$("img.culture").each(function(){
		$(this).css("display","none");
	});
	var wholecultureimgs=$("#slide2").find('img.culture');
	for(var i=cultureshowindex;i<cultureshowindex+4;i++){
		wholecultureimgs.eq(i).css("display","inline-block");
	}
});

var flowershowindex=0;
$("#next3").click(function(){
	flowershowindex++;
	if(flowershowindex==1){
		$("#pre3").css("display","inline-block");
	}
	else if(flowershowindex==2){
		$(this).css("display","none");
	}
	$("img.flower").each(function(){
		$(this).css("display","none");
	});
	var wholeflowerimgs=$("#slide3").find('img.flower');
	for(var i=flowershowindex;i<flowershowindex+4;i++){
		wholeflowerimgs.eq(i).css("display","inline-block");
	}
});

$("#pre3").click(function(){
	flowershowindex--;
	if(flowershowindex==1){
		$("#next3").css("display","inline-block");
	}
	else if(flowershowindex==0){
		$(this).css("display","none");
	}
	$("img.flower").each(function(){
		$(this).css("display","none");
	});
	var wholeflowerimgs=$("#slide3").find('img.flower');
	for(var i=flowershowindex;i<flowershowindex+4;i++){
		wholeflowerimgs.eq(i).css("display","inline-block");
	}
});

var eatshowindex=0;
$("#next4").click(function(){
	eatshowindex++;
	if(eatshowindex==1){
		$("#pre4").css("display","inline-block");
	}
	else if(eatshowindex==2){
		$(this).css("display","none");
	}
	$("img.eat").each(function(){
		$(this).css("display","none");
	});
	var wholeeatimgs=$("#slide4").find('img.eat');
	for(var i=eatshowindex;i<eatshowindex+4;i++){
		wholeeatimgs.eq(i).css("display","inline-block");
	}
});

$("#pre4").click(function(){
	eatshowindex--;
	if(eatshowindex==1){
		$("#next4").css("display","inline-block");
	}
	else if(eatshowindex==0){
		$(this).css("display","none");
	}
	$("img.eat").each(function(){
		$(this).css("display","none");
	});
	var wholeeatimgs=$("#slide4").find('img.eat');
	for(var i=eatshowindex;i<eatshowindex+4;i++){
		wholeeatimgs.eq(i).css("display","inline-block");
	}
});
$("img.sea").click(function(){
	var tempindex=$(this).index();
	$("section.rg-gr-wrapper").css("display","none");
	$("#event-wrap").css("display","flex");
	var ditr=$("#event-wrap");
	ditr.find("h1").append(xData[tempindex].title);
	var fes_img=ditr.find("div.slideshow2").find('img');
	for(var t=0;t<3;t++){
		fes_img.eq(t).attr("src",xData[tempindex].pic[t]);
	}
	ditr.find("div#event-content").find("#content2-detail").append("이름 : "+
		xData[tempindex].title+"<br>일시 : "+xData[tempindex].date+"<br>장소 : "
		+xData[tempindex].place+"<br>");
	ditr.find("div#event-content").find("dl").find("dd#con").append(xData[tempindex].content);
	ditr.find("div#event-content").find("dl").find("dd#etc").append(xData[tempindex].etc);
});
$("img.culture").click(function(){
	var tempindex=$(this).index();
	tempindex+=7;
	$("section.rg-gr-wrapper").css("display","none");
	$("#event-wrap").css("display","flex");
	var ditr=$("#event-wrap");
	ditr.find("h1").append(xData[tempindex].title);
	var fes_img=ditr.find("div.slideshow2").find('img');
	for(var t=0;t<3;t++){
		fes_img.eq(t).attr("src",xData[tempindex].pic[t]);
	}
	ditr.find("div#event-content").find("#content2-detail").append("이름 : "+
		xData[tempindex].title+"<br>일시 : "+xData[tempindex].date+"<br>장소 : "
		+xData[tempindex].place+"<br>");
	ditr.find("div#event-content").find("dl").find("dd#con").append(xData[tempindex].content);
	ditr.find("div#event-content").find("dl").find("dd#etc").append(xData[tempindex].etc);
});
$("img.flower").click(function(){
	var tempindex=$(this).index();
	tempindex+=13;
	$("section.rg-gr-wrapper").css("display","none");
	$("#event-wrap").css("display","flex");
	var ditr=$("#event-wrap");
	ditr.find("h1").append(xData[tempindex].title);
	var fes_img=ditr.find("div.slideshow2").find('img');
	for(var t=0;t<3;t++){
		fes_img.eq(t).attr("src",xData[tempindex].pic[t]);
	}
	ditr.find("div#event-content").find("#content2-detail").append("이름 : "+
		xData[tempindex].title+"<br>일시 : "+xData[tempindex].date+"<br>장소 : "
		+xData[tempindex].place+"<br>");
	ditr.find("div#event-content").find("dl").find("dd#con").append(xData[tempindex].content);
	ditr.find("div#event-content").find("dl").find("dd#etc").append(xData[tempindex].etc);
});
$("img.eat").click(function(){
	var tempindex=$(this).index();
	tempindex+=19;
	$("section.rg-gr-wrapper").css("display","none");
	$("#event-wrap").css("display","flex");
	var ditr=$("#event-wrap");
	ditr.find("h1").append(xData[tempindex].title);
	var fes_img=ditr.find("div.slideshow2").find('img');
	for(var t=0;t<3;t++){
		fes_img.eq(t).attr("src",xData[tempindex].pic[t]);
	}
	ditr.find("div#event-content").find("#content2-detail").append("이름 : "+
		xData[tempindex].title+"<br>일시 : "+xData[tempindex].date+"<br>장소 : "
		+xData[tempindex].place+"<br>");
	ditr.find("div#event-content").find("dl").find("dd#con").append(xData[tempindex].content);
	ditr.find("div#event-content").find("dl").find("dd#etc").append(xData[tempindex].etc);
});


// region
var seoul=[0,1,7,9,11,14,17,19,20,21];
var gyung=[2,4,12,18,22,24];
var chung=[8,13,16,23];
var jeun_gang=[3,5,6,10,15];

	// pre&next button
var sshowindex=0;
$("#next5").click(function(){
		sshowindex++;
		if(sshowindex==1){
			$("#pre5").css("display","inline-block");
		}
		else if(sshowindex==6){
			$(this).css("display","none");
		}
		$("img.seoul").each(function(){
			$(this).css("display","none");
		});
		var wholesimgs=$("#slide5").find('img.seoul');
		for(var i=sshowindex;i<sshowindex+4;i++){
			wholesimgs.eq(i).css("display","inline-block");
		}
});
$("#pre5").click(function(){
	sshowindex--;
	if(sshowindex==2){
		$("#next5").css("display","inline-block");
	}
	else if(sshowindex==0){
		$(this).css("display","none");
	}
	$("img.seoul").each(function(){
		$(this).css("display","none");
	});
	var wholesimgs=$("#slide5").find('img.seoul');
	for(var i=sshowindex;i<sshowindex+4;i++){
		wholesimgs.eq(i).css("display","inline-block");
	}
});

var gshowindex=0;
$("#next6").click(function(){
		gshowindex++;
		if(gshowindex==1){
			$("#pre6").css("display","inline-block");
		}
		else if(gshowindex==2){
			$(this).css("display","none");
		}
		$("img.gyung").each(function(){
			$(this).css("display","none");
		});
		var wholegimgs=$("#slide6").find('img.gyung');
		for(var i=gshowindex;i<gshowindex+4;i++){
			wholegimgs.eq(i).css("display","inline-block");
		}
});
$("#pre6").click(function(){
	gshowindex--;
	if(gshowindex==2){
		$("#next6").css("display","inline-block");
	}
	else if(gshowindex==0){
		$(this).css("display","none");
	}
	$("img.gyung").each(function(){
		$(this).css("display","none");
	});
	var wholegimgs=$("#slide6").find('img.gyung');
	for(var i=gshowindex;i<gshowindex+4;i++){
		wholegimgs.eq(i).css("display","inline-block");
	}
});

var jshowindex=0;
$("#next8").click(function(){
		jshowindex++;
		if(jshowindex==1){
			$("#pre8").css("display","inline-block");
		}
		if(jshowindex==1){
			$(this).css("display","none");
		}
		$("img.jeun_gang").each(function(){
			$(this).css("display","none");
		});
		var wholejimgs=$("#slide8").find('img.jeun_gang');
		for(var i=jshowindex;i<jshowindex+4;i++){
			wholejimgs.eq(i).css("display","inline-block");
		}
});
$("#pre8").click(function(){
	jshowindex--;
	if(jshowindex==2){
		$("#next8").css("display","inline-block");
	}
	else if(jshowindex==0){
		$(this).css("display","none");
	}
	$("img.jeun_gang").each(function(){
		$(this).css("display","none");
	});
	var wholejimgs=$("#slide8").find('img.jeun_gang');
	for(var i=jshowindex;i<jshowindex+4;i++){
		wholejimgs.eq(i).css("display","inline-block");
	}
});
//when imgs're clicked
$("img.seoul").click(function(){
	var tempindex2=$(this).index();
	var tempindex=seoul[tempindex2];
	$("section.rg-gr-wrapper").css("display","none");
	$("#event-wrap").css("display","flex");
	var ditr=$("#event-wrap");
	ditr.find("h1").append(xData[tempindex].title);
	var fes_img=ditr.find("div.slideshow2").find('img');
	for(var t=0;t<3;t++){
		fes_img.eq(t).attr("src",xData[tempindex].pic[t]);
	}
	ditr.find("div#event-content").find("#content2-detail").append("이름 : "+
		xData[tempindex].title+"<br>일시 : "+xData[tempindex].date+"<br>장소 : "
		+xData[tempindex].place+"<br>");
	ditr.find("div#event-content").find("dl").find("dd#con").append(xData[tempindex].content);
	ditr.find("div#event-content").find("dl").find("dd#etc").append(xData[tempindex].etc);
});
$("img.gyung").click(function(){
	var tempindex2=$(this).index();
	var tempindex=gyung[tempindex2];
	$("section.rg-gr-wrapper").css("display","none");
	$("#event-wrap").css("display","flex");
	var ditr=$("#event-wrap");
	ditr.find("h1").append(xData[tempindex].title);
	var fes_img=ditr.find("div.slideshow2").find('img');
	for(var t=0;t<3;t++){
		fes_img.eq(t).attr("src",xData[tempindex].pic[t]);
	}
	ditr.find("div#event-content").find("#content2-detail").append("이름 : "+
		xData[tempindex].title+"<br>일시 : "+xData[tempindex].date+"<br>장소 : "
		+xData[tempindex].place+"<br>");
	ditr.find("div#event-content").find("dl").find("dd#con").append(xData[tempindex].content);
	ditr.find("div#event-content").find("dl").find("dd#etc").append(xData[tempindex].etc);
});
$("img.chung").click(function(){
	var tempindex2=$(this).index();
	var tempindex=chung[tempindex2];
	$("section.rg-gr-wrapper").css("display","none");
	$("#event-wrap").css("display","flex");
	var ditr=$("#event-wrap");
	ditr.find("h1").append(xData[tempindex].title);
	var fes_img=ditr.find("div.slideshow2").find('img');
	for(var t=0;t<3;t++){
		fes_img.eq(t).attr("src",xData[tempindex].pic[t]);
	}
	ditr.find("div#event-content").find("#content2-detail").append("이름 : "+
		xData[tempindex].title+"<br>일시 : "+xData[tempindex].date+"<br>장소 : "
		+xData[tempindex].place+"<br>");
	ditr.find("div#event-content").find("dl").find("dd#con").append(xData[tempindex].content);
	ditr.find("div#event-content").find("dl").find("dd#etc").append(xData[tempindex].etc);
});
$("img.jeun_gang").click(function(){
	var tempindex2=$(this).index();
	var tempindex=jeun_gang[tempindex2];
	$("section.rg-gr-wrapper").css("display","none");
	$("#event-wrap").css("display","flex");
	var ditr=$("#event-wrap");
	ditr.find("h1").append(xData[tempindex].title);
	var fes_img=ditr.find("div.slideshow2").find('img');
	for(var t=0;t<3;t++){
		fes_img.eq(t).attr("src",xData[tempindex].pic[t]);
	}
	ditr.find("div#event-content").find("#content2-detail").append("이름 : "+
		xData[tempindex].title+"<br>일시 : "+xData[tempindex].date+"<br>장소 : "
		+xData[tempindex].place+"<br>");
	ditr.find("div#event-content").find("dl").find("dd#con").append(xData[tempindex].content);
	ditr.find("div#event-content").find("dl").find("dd#etc").append(xData[tempindex].etc);
});

});
