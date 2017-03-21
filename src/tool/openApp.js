export const APPCommon = {
    iphoneSchema: 'wanjia://',
    iphoneDownUrl: 'https://itunes.apple.com/cn/app/id1176755755',
    androidSchema: 'scheme://wanjia/',
    androidDownUrl: 'https://itunes.apple.com/cn/app/id1176755755',
    openApp: function(){
        var this_  =  this;
        //微信
        if(this_.isWeixin()){
            location.href = 'wx8eb3461b50e5eba3://openwebview/?ret=0'
 
        }else{//非微信浏览器
            if (navigator.userAgent.match(/(iPhone|iPod|iPad);?/i)) {
                window.location = this.iphoneSchema;
                !window.document.webkitHidden && setTimeout(function () {
                    setTimeout(function () {
                        window.location = this_.iphoneDownUrl; //例如http://itunes.apple.com/..
                    }, 100);
                 }, 600);
                
            }else if (navigator.userAgent.match(/android/i)) {
                try {
                    window.location = this_.androidSchema;
                    setTimeout(function(){
                        window.location=this_.androidDownUrl; //android下载地址
                    },500);
                } catch(e) {}
            }
            else{
                window.location.href = this_.iphoneDownUrl
            }
        }
    },
    isWeixin: function(){ //判断是否是微信
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
            return true;
        } else {
            return false;
        }
    }
};




     