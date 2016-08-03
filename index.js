window.$=HTMLElement.prototype.$=function(selector){
	var r = (this === window ? document:this).querySelectorAll(selector);
	return r.length===0?null:r.length===1?r[0]:r;
}
HTMLElement.prototype.hasClass = function(className){
	if(this === window){
		throw new Error('this must be elem!');
	}else if(this.classList){
		return this.classList.contains(className);
	}else{
		return new RegExp('(^|)' + className + '( |$)', 'gi').test(this.className);
	}
}
window.addEventListener("load",function(){
	prov.indexProv();
	hws.hotWord();
	login.init();
	tabToggle();
});

/*省份*/
var prov=(function(prov){
	var init=['北京','上海','天津','重庆','河北','山西','河南','辽宁','吉林','黑龙江','内蒙古','江苏','山东','安徽','浙江','福建','湖北','湖南','广东','广西','江西','四川','海南','贵州','云南','西藏','陕西','甘肃','青海','宁夏','新疆','台湾','香港','澳门','钓鱼岛','海外'];
	function indexProv(){
		var ul=$("#top-content>.address>ul");
		for(var i=0,str="",len=init.length;i<len;i++){
			str+='<li><a href="#">'+init[i]+"</a></li>";
		}
		ul.innerHTML=str;
		ul.$("li:first-child").className="current";
		ul.addEventListener("click",function(e){
			if(e.target.nodeName==="A"&&e.target.className!="current"){
				this.$("li[class='current']").className="";
				e.target.parentNode.className="current";
				this.previousElementSibling.$("span").innerHTML=e.target.innerHTML;
			}
		});
	}
	prov.indexProv=indexProv;
	return prov;
}(prov||{}));

/*热词*/
var hws=(function(hws){
	var init=["599减120","相机降300","多肉植物","iphoneSE","1元秒","小白鞋","晨光","1元专享","瑜伽垫"];
	function hotWord(){
		var p=$(".search>.hot-words");
		for(var i=0,len=init.length;i<len;i++){
			p.innerHTML+='<a href="#"> '+init[i]+ '</a>';
		}
		p.$("a:first-child").className="current";
	}
	hws.hotWord=hotWord;
	return hws;
}(hws||{}))


/*登录框*/
var login=(function(my){
	var uname=$('#uname'),
		 pwd=$("#pwd"),
		txt=$("#alertText");

	function init(){
		$('.modal').addEventListener('click',function(e){//在黑色蒙版上单击时，关闭登录对话框
			if(e.target.className==='modal'){
				this.style.display='none';
				document.body.className="";
			}
		});
		$('[href="#login"]').addEventListener('click',function(){//点击登录时
			$('#login').style.display="block";
			document.body.className="modal-open";
		});
		uname.addEventListener('blur',checkInput);		//检查输入
		pwd.addEventListener('blur',checkInput);
		$('#btnLogin').addEventListener('click',function(e){
			e.preventDefault();
			if(uname.value&&pwd.value){	//用户名和密码不为空，异步请求
				var xhr=new XMLHttpRequest();
				xhr.onreadystatechange=function(){
					if(xhr.readyState===4&&xhr.status===200){
						xhr.doResponse(xhr.responseText);
					}
				}
				xhr.open('POST', 'data/login.php', true);
				xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
				xhr.send( 'uname='+uname.value+'&pwd='+pwd.value );		
			}else{
				if(!uname.value){
					uname.className+=" input-error";
				}
				if(!pwd.value){
					pwd.className+=" input-error";
				}
				txt.className+=" alert-error";
				txt.innerHTML="登录名和密码不可为空";
			}
		});

	}
	function checkInput(){	//检查输入
		if(!this.value){
			this.className+=" input-error";
		}else{
			this.className="form-control";
		}
		console.log(this);
	};
	function doResponse(){
		txt.className="alert";
		txt.innerHTML="公共场所不建议自动登录，以防账号丢失";

	}
	my.init=init;
	return my;
}(login||{}));

//轮播图
var Carousel = function(img , imgList , imgIndex , LIWIDTH , isHasIdx , showIdxNum , isAutoPlay){
	this.img = img;
	this.imgList = imgList;
	this.imgIndex = imgIndex;
	this.LIWIDTH = LIWIDTH;
	this.isHasIdx = isHasIdx === undefined?true : isHasIdx;
	this.showIdxNum = showIdxNum === undefined?true : showIdxNum;
	this.isAutoPlay = isAutoPlay === undefined?true : isAutoPlay;
	this.DURATION = 1000;	//完成动画总时间
	this.INTERVAL = 0;		//步频，用于定时器的时间间隔
	this.WAIT = 3000;
	this.distance = 0;
	this.steps = 100;		//完成动画总步数
	this.distance = 0;		//总距离
	this.step = 0;			//步长，用于设置ul的left
	this.moved = 0;
	this.timer = null;
	this.isAuto = true;
}
Carousel.prototype = {
	init : function(){
		this.updateView();
		var me = this;
		if(this.isHasIdx){
			this.imgIndex.addEventListener("mouseover",function(e){	//给每个数字指标添加点击事件
				if(e.target.nodeName==="LI" && !e.target.hasClass("current")){
					var startI = me.img[0].i + 1,
						endI = parseInt(e.target.innerHTML) || parseInt(e.target.dataset.num);
					me.move(endI-startI);
				}
			});
		}
		/*自动播放条件设置*/
		if(this.isAutoPlay){
			this.autoMove();
			this.imgList.addEventListener("mouseover",function(){
				me.isAuto=false;
			});
			this.imgList.addEventListener('mouseout',function(){
				me.isAuto=true;
			});
		}
		var parent = this.imgList.parentNode;
		if(parent.$(".slider-page")){
			var arr = parent.$(".slider-page > a");
			parent.onmouseover=function(){
				[].forEach.call(arr , function(val , i , arr){
					arr[i].style.display = "block";
				})
			}
			parent.onmouseout=function(){
				[].forEach.call(arr , function(val , i , arr){
					arr[i].style.display = "none";
				})
			};
			parent.$('.slider-page>.slider-prev').addEventListener('click',this.move.bind(this,-1));
			parent.$('.slider-page>.slider-next').addEventListener('click',this.move.bind(this,1));
		}
	},
	updateView : function(){
		var len = this.img.length;
		this.imgList.style.width = this.LIWIDTH *  len + "px";
		for(var i=0, strImg="" ; i < len ; i++ ){
				strImg += '<li><a href="'+this.img[i].href+'"  target="blank">'+
					'<img src="'+this.img[i].src+'"></a></li>';
			}
		this.imgList.innerHTML = strImg;
		if(this.isHasIdx){
			if(this.showIdxNum){
				for(var i = 0, strIdx = ''; i<len; i++ ){
					strIdx += '<li class="num-list">' + (i+1) + '</li>';
				}
			}else{
				for(var i = 0, strIdx = ''; i<len; i++ ){
					strIdx += '<li class="round-list" data-num = "'+ (i+1) +'"></li>';
				}
			}
			this.imgIndex.innerHTML = strIdx;
			this.imgIndex.$("li")[this.img[0].i].className += " current";
		}
	},
	autoMove : function(){
		var me = this;
		this.timer=setTimeout(function(){
			if(me.isAuto){
				me.move(1);
			}else{
				me.autoMove();
			}
		},this.WAIT);
	},
	move : function(n){
		this.distance = this.LIWIDTH * n;
		this.step = this.distance / this.steps;
		this.INTERVAL = this.DURATION / this.steps;
		if(this.timer !== null){
			clearTimeout(this.timer);
			this.timer = null;
			this.moved = 0;
			this.imgList.style.left = "";
		}
		if( n < 0 ){
			var del = this.img.splice(this.img.length+n ,-n);
			Array.prototype.unshift.apply(this.img , del);
			this.imgList.style.left = n * this.LIWIDTH + "px";
			this.updateView();
		}
		this.timer = setTimeout(this.moveStep.bind(this,n),this.INTERVAL);
	},
	moveStep : function(n){
		var left = parseFloat(getComputedStyle(this.imgList).left);
		this.imgList.style.left = left - this.step + "px";
		this.moved += 1;
		if(this.moved < this.steps){
			this.timer=setTimeout(this.moveStep.bind(this,n),this.INTERVAL);
		}else{
			clearTimeout(this.timer);
			this.timer = null;
			this.moved = 0;
			if( n > 0 ){
				var del = this.img.splice(0,n);
				[].push.apply(this.img,del);
				this.updateView();
			}
			this.imgList.style.left = "";
			this.isAutoPlay && this.autoMove();
		}
	},
};

var bannerSlider = new Carousel([
	{i:0,href:"#",src:"Images/index/banner_slider_1.jpg"},
	{i:1,href:"#",src:"Images/index/banner_slider_2.jpg"},
	{i:2,href:"#",src:"Images/index/banner_slider_3.jpg"},
	{i:3,href:"#",src:"Images/index/banner_slider_4.jpg"},
	{i:4,href:"#",src:"Images/index/banner_slider_5.jpg"},
	{i:5,href:"#",src:"Images/index/banner_slider_6.jpg"},
],$("#slider-Img-banner"),$(".main-banner  .slide-bar"),730);
bannerSlider.init();

var floorSlider1 = new Carousel([
	{i:0,href:"#",src:"Images/index/floor_slider_1.jpg"},
	{i:1,href:"#",src:"Images/index/floor_slider_2.jpg"},
	{i:2,href:"#",src:"Images/index/floor_slider_3.jpg"},
	{i:3,href:"#",src:"Images/index/floor_slider_4.jpg"},
],$("#slider-Img-1F"),$("#slider-Img-1F+.slide-bar"),440,true,false);
floorSlider1.init();
var floorSlider2 = new Carousel([
	{i:0,href:"#",src:"Images/index/floor_slider_1.jpg"},
	{i:1,href:"#",src:"Images/index/floor_slider_2.jpg"},
	{i:2,href:"#",src:"Images/index/floor_slider_3.jpg"},
	{i:3,href:"#",src:"Images/index/floor_slider_4.jpg"},
],$("#slider-Img-2F"),$("#slider-Img-2F+.slide-bar"),440,true,false);
floorSlider2.init();
var recommendList = new Carousel([
	{i:0,href:"#",src:"Images/index/recommend_1.jpg"},
	{i:1,href:"#",src:"Images/index/recommend_2.jpg"},
	{i:2,href:"#",src:"Images/index/recommend_3.jpg"},
	{i:3,href:"#",src:"Images/index/recommend_4.jpg"},
	{i:4,href:"#",src:"Images/index/recommend_5.png"},
	{i:5,href:"#",src:"Images/index/recommend_6.png"},
	{i:6,href:"#",src:"Images/index/recommend_7.png"},
	{i:7,href:"#",src:"Images/index/recommend_8.png"},
	{i:8,href:"#",src:"Images/index/recommend_9.jpg"},
	{i:9,href:"#",src:"Images/index/recommend_10.jpg"},
	{i:10,href:"#",src:"Images/index/recommend_11.jpg"},
	{i:11,href:"#",src:"Images/index/recommend_12.jpg"},
],$("#recommend-list"),undefined,1000,false,false,false);
recommendList.DURATION = 500;
recommendList.init();

//页签切换
function tabToggle(){
	Array.prototype.forEach.call($(".m-tabs"), function(el){
		el.addEventListener("mouseover",function(e){
			e.preventDefault();
			if(e.target.nodeName === "A" && !e.target.parentNode.hasClass("current")){
				e.target.parentNode.parentNode.$('li[class="current"]').removeAttribute('class');
				e.target.parentNode.className = "current";

				var t = $(e.target.getAttribute("href"));
				t.parentNode.$('div[class=show]').className = "tab-content";
				t.className = "show";
			}
		});
	});
}







