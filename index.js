window.$=HTMLElement.prototype.$=function(selector){
	var r = (this===window?document:this).querySelectorAll(selector);
	return r.length===0?null:r.length===1?r[0]:r;
}
window.addEventListener("load",function(){
	prov.indexProv();
	hws.hotWord();
	login.init();
	//slider.init();
});

/*全局函数getElementTop,获取任意元素距页面顶部的总距离*/
function  getElementTop(elem){
	//获得当前元素距离父元素的top
	var  elemTop = elem.offsetTop;
	while((elem = elem.offsetParent) !== null){
		elemTop += elem.offsetTop;
	}
	return  elemTop;
}

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


function Slider(img,imgList,imgIndex,LIWIDTH){
	const DURATION=1000,	//完成动画总时间
		INTERVAL=0,		//步频，用于定时器的时间间隔
		WAIT=3000;
	var distance=0,	
			steps=100,		//完成动画总步数			
			distance=0,		//总距离
			step=0,			//步长，用于设置ul的left
			moved=0,
			timer=null,
			isAuto=true;
	
	function  init(){
		updateView();
		imgIndex.addEventListener("click",function(e){	//给每个数字指标添加点击事件
			if(e.target.nodeName==="LI"&&e.target.className!=="current"){
				var startI=img[0].i+1,
					endI=parseInt(e.target.innerHTML);
				move(endI-startI);
			}
		});
		/*自动播放条件设置*/
		imgList.addEventListener("mouseover",function(){isAuto=false;});
		imgList.addEventListener('mouseout',function(){isAuto=true;});
		autoMove();
		$('#slider-page>.slider-prev').addEventListener('click',move.bind(this,-1));
		$('#slider-page>.slider-next').addEventListener('click',move.bind(this,1));
	};

	function updateIndex(){
		for(var i=0,strIdx="",len=  img.length; i<len; i++ ){
			strIdx += '<li>'+(i+1)+'</li>';
		}
		return strIdx;
	};
	function updateView(){
		var len = img.length;
		imgList.style.width = LIWIDTH *  len + "px";
		for(var i=0, strImg=""; i<len; i++ ){
			strImg += '<li><a href="'+img[i].href+'"  target="blank"><img src="'+img[i].src+'"></a></li>';
		}
		imgList.innerHTML=strImg;
		imgIndex.innerHTML = updateIndex();
		imgIndex.$("li")[img[0].i].className="current";
	};
	function autoMove(){
		timer=setTimeout(function(){
				if(isAuto){
					move(1);
				}else{
					autoMove();
				}
			},WAIT);
	};
	function move(n){
		distance = LIWIDTH * n,
		step = distance / steps;
		INTERVAL=DURATION / steps;
		if(timer){
			clearTimeout(timer);
			timer=null;
			moved=0;
			imgList.style.left="";
		}
		if(n<0){
			var del=img.splice(n);
			Array.prototype.unshift.apply(img,del);
			imgList.style.left=n*LIWIDTH+"px";
			updateView();
		}
		timer=setTimeout(moveStep.bind(this,n),INTERVAL);
	};
	function moveStep(n){
		var left = parseFloat(getComputedStyle(imgList).left);
		imgList.style.left=left-step+"px";
		moved+=1;
		if(moved<steps){
			timer=setTimeout(moveStep.bind(this,n),INTERVAL);
		}else{
			clearTimeout(timer);
			timer=null;
			moved=0;
			if(n>0){
				var del = img.splice(0,n);
				Array.prototype.push.apply(img,del);
				updateView();
			}
			imgList.style.left = "";
			autoMove();
		}
	};

	this.init=init;
	this.updateIndex=updateIndex;
	return this;
}

var  bannerSlider = (function(){
	var img=[
			{i:0,href:"#",src:"Images/index/banner_slider_1.jpg"},	
			{i:1,href:"#",src:"Images/index/banner_slider_2.jpg"},	
			{i:2,href:"#",src:"Images/index/banner_slider_3.jpg"},	
			{i:3,href:"#",src:"Images/index/banner_slider_4.jpg"},	
			{i:4,href:"#",src:"Images/index/banner_slider_5.jpg"},	
			{i:5,href:"#",src:"Images/index/banner_slider_6.jpg"},	
		],
		imgList=$("#slider-Img-banner"),
		imgIndex=$(".main-banner  .slide-bar"),
		LIWIDTH=730;
	new Slider(img,imgList,imgIndex,LIWIDTH).init();
}())


var img=[
		{i:0,href:"#",src:"Images/index/floor_slider_1.jpg"},	
		{i:1,href:"#",src:"Images/index/floor_slider_2.jpg"},	
		{i:2,href:"#",src:"Images/index/floor_slider_3.jpg"},	
		{i:3,href:"#",src:"Images/index/floor_slider_4.jpg"},	
	];
var showSlider = new Slider(img,$("#slider-Img-1F"),$(".show-slider  .slide-bar"),439);
showSlider.init();



