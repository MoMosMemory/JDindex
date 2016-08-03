/**
 * Created by Admin on 2016/8/3.
 */
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

//楼层elevator
/*全局函数getElementTop,获取任意元素距页面顶部的总距离*/
function  getElementTop(elem){
    //获得当前元素距离父元素的top
    var  elemTop = elem.offsetTop;
    while((elem = elem.offsetParent) !== null){
        elemTop += elem.offsetTop;
    }
    return  elemTop;
}
var elevator = {
    FLOORHEIGHT:0,
    UPPERLEVEL:0,
    DOWNLEVEL:0,
    distance:0,//保存本次移动的总距离
    DURATION:1000,//保存本次移动的总事件
    STEPS:50,//保存本次移动的总步数
    moved:0,//保存本次已经移动的步数，控制移动结束
    step:0,//保存每步移动的步长
    INTERVAL:0,//保存每步移动的时间间隔
    timer:null,//保存本次移动的序号
    init:function(){
        this.FLOORHEIGHT = parseFloat(getComputedStyle($("#f1")).height);
        this.UPPERLEVEL = Math.abs(innerHeight - this.FLOORHEIGHT)/2;
        this.DOWNLEVEL = Math.abs(innerHeight - this.FLOORHEIGHT)/2 + this.FLOORHEIGHT;
        this.INTERVAL = this.DURATION / this.STEPS;

        window.addEventListener("scroll",this.scroll.bind(this));
        $("#elevator").addEventListener("mouseover",this.eleToggle);
        $("#elevator").addEventListener("mouseout",this.eleState);
        $("#elevator").addEventListener("click",this.scrollPage.bind(this));
    },
    scroll:function(){
        var lights = $(".floor>.m-title>h2>i");
        for(var i = 0, len = lights.length ; i < len ; i++){
            var elemTop = getElementTop(lights[i]),
                scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
            if(scrollTop > (elemTop -this.UPPERLEVEL)){
                lights[i].className = "";
            }
            else if(scrollTop > (elemTop -this.DOWNLEVEL)){
                lights[i].className = "hover";
            }else{
                lights[i].className = "";
            }
        }
        var hoverLight = $(".floor>.m-title>h2>i.hover");
        $("#elevator").style.display = hoverLight !== null ? "block" : "none" ;
        this.eleState();
    },
    eleState:function(){
        var lights = $(".floor>.m-title>h2>i");
        var lis = $("#elevator > li");
        for(var i = 0, len = lights.length ; i < len ; i++){
            if(lights[i].className === "hover"){
                lis[i].$("a:first-child").style.display = "none";
                lis[i].$("a:nth-child(2)").style.display = "block";
            }else{
                lis[i].$("a:first-child").style.display = "block";
                lis[i].$("a:nth-child(2)").style.display = "none";
            }
        }
    },
    eleToggle:function(e){
        e = e || window.event;
        var target = e.srcElement || e.target;
        target.nodeName === "A" && (target = target.parentNode);
        if(target.nodeName === "LI"){
            target.$("a:first-child").style.display = "none";
            target.$("a:nth-child(2)").style.display = "block";
        }
    },
    scrollPage:function(e){
        e = e || window.event;
        var target = e.srcElement || e.target;
        if(target.nodeName === "A") {
            if (this.timer !== null) {//如果timer不是null
                //停止动画，timer置为null，moved归0
                clearTimeout(this.timer);
                this.timer = null;
                this.moved = 0;
            }
            var i = parseInt(target.previousElementSibling.innerHTML),
                light = $("#f" + i + ">.m-title>h2>i"),
                targetTop = getElementTop(light) - this.UPPERLEVEL,
                scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
            this.distance = targetTop - scrollTop;
            this.step = this.distance / this.STEPS;
            this.timer = setTimeout(this.scrollStep.bind(this), this.INTERVAL);
            console.log(this.timer);
            //window.scrollTo(0,elemTop - this.UPPERLEVEL );
        }
    },
    scrollStep:function(){
        window.scrollBy(0,this.step);
        this.moved++;
        if(this.moved < this.STEPS){
            this.timer = setTimeout(this.scrollStep.bind(this),this.INTERVAL);
            console.log(this);
        }else{
            clearTimeout(this.timer);
            this.timer = null;
            this.moved = 0;
        }
    },
}

window.addEventListener("load",function(){
    elevator.init();
});