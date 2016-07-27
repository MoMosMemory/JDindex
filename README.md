# JDindex
模仿实现京东商城首页页面  HTML+CSS+原生Javascript+DOM  

#### 功能：  

1、使用面向对象思路封装轮播图方法，根据不同的需求进行显示  
2、实现标签页切换  

#### 实现思路

##### 功能模块一：轮播图


1. 根据需求将轮播方法使用构造函数进行封装，提供6个参数进行样式的定制
	
        var Carousel = function( img , imgList , numBar , LIWIDTH , isHasIdx , showIdxNum , isAutoPlay){  
     		//定义轮播图实现轮播图所需属性  
    	}  

###### 参数说明：

> img ： 轮播所需图片，数组格式；  
> imgList ：轮播图片所处的容器，`<ul></ul>`，根据传入图片设置其innerHTML  
> numBar ：轮播数字显示条容器，`<ul></ul>`，根据传入图片设置其innerHTML  
> LIWIDTH ：图片的宽度，或者每左右移动完成一次的距离  
> isHasIdx ：是否显示数字/圆点显示条。Boolean值，默认为true；   
> showIdxNum：是否显示数字显示条。Boolean值，默认为true；  
> isAutoPlay：是否自动播放。Boolean值，默认为true；  

###### 该项目中有三处涉及到轮播图的使用：
&emsp;第一处需有自动轮播、数字显示条、左右切换按钮；

    var bannerSlider = new Carousel( img , imgList , numBar , 730);
&emsp;第二处只需要左右切换按钮；

    var recommendList = new Carousel( img , imgList , numBar , 1000 , false , false , false);
&emsp;第三处需要自动轮播、圆点显示条、左右切换按钮；

    var bannerSlider = new Carousel( img , imgList , numBar , 440 , true , false);

2. 具体的轮播图实现方法由原型实现

        Carousel.prototype = {
      		init:function(){…}, //初始化，定义各个标签的作用并调用move函数启动轮播
      		updateView:function(){…},//页面实时更新
      		move:function(){…},//轮播移动方法，使用一次性定时器调用moveStep方法
      		moveStep:function(){…},//轮播移动方法，将移动总距离分解成若干步，使用一次//性定时器反复调用直至移动完成
      		autoPlay:function(){…},//设置自动播放，调用move方法
    	}
3.	轮播图的启用

    	bannerSlider.init() ; recommendList.init() ; bannerSlider.init();

##### 功能模块二：标签页切换

利用a标签的href属性，与要显示的模块id相关联。  
> 1、	利用事件冒泡机制，将mouseover事件添加在外层容器ul上，通过判断nodeName来触发；  
> 2、	利用数组forEach方法给每个ul添加事件：[].forEach.call( $(".m-tabs") , fn );  
> 3、	利用DOM方法，实现当前页卡显示时，parentNode下class=’show’的子节点display设置为none，当前节点添加className = ”show”  
> 4、	当前页卡显示时，id对应href属性的容器也相应显示   
