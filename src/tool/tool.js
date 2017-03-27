
const realNameRegex = /\S+/
const phoneRegex = /(13|14|15|17|18)\d{9}$/
let globalVue = {}
export function validate(type,value){
    switch (type) {
        case 'realName':
           if(!realNameRegex.test(value)){
               return "姓名不能为空或者空白"
           }
           else{
               return null;
           }
            break;
       case 'phone':
           if(!phoneRegex.test(value)){
               return "手机号为空或者格式错误"
           }
           else{
               return null;
           }
            break;
        default:
        return null;
            break;
    }
}


global.isEpmty = function(obj){
    for (var key in obj) {
        return false;
    }
    return true;
}


global.formatTime = function(date,format){
        if(!(date instanceof Date)){
            return date
        }
        if (format == undefined){
            format = "yyyy-MM-dd hh:mm"
        }
        var dt = {
              "M+": date.getMonth() + 1,
              "d+": date.getDate(),
              "h+": date.getHours(),
              "m+": date.getMinutes(),
              "s+": date.getSeconds(),
              "q+": Math.floor((date.getMonth() + 3) / 3),
              "S+": date.getMilliseconds()
       };
       if (/(y+)/i.test(format)) {
              format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
       }
       for (var k in dt) {
              if (new RegExp("(" + k + ")").test(format)) {
                     format = format.replace(RegExp.$1, RegExp.$1.length == 1
                            ? dt[k] : ("00" + dt[k]).substr(("" + dt[k]).length));
              }
       }
       return format;
}
global.isEmpty = function(obj){
    for (var key in obj) {
        if(key == 'isEmpty'){
            continue
        }
        return false;
    }
    return true;
}
global.findChildWithClass = function(ele,name){
            let result = []
            function childWithClass(element,className){
            if(element.nodeType == 1 && element.className == className){
                result.push(element)
            }
            else{
                for(var i = 0;i<element.childNodes.length;i++){
                    childWithClass(element.childNodes[i],className)
                }
            }

          }
          childWithClass(ele,name)
          return result
}
global.setStore = (name, content) => {
	if (!name) return;
	if (typeof content !== 'string') {
		content = JSON.stringify(content);
	}
	window.localStorage.setItem(name, content);
}
global.getStore = name => {
	if (!name) return;
    let content = window.localStorage.getItem(name);
    if(content){
        try {
            return JSON.parse(content)
        } catch (error) {
            return content
        }
          
    }
	return null
}
global.removeStore = name => {
	if (!name) return;
	window.localStorage.removeItem(name);
}

global.userId = getStore('token') == null ?  1 : getStore('token').user_id


global.getStyle = (element, attr, NumberMode = 'int') => {
    let target;
    // scrollTop 获取方式不同，没有它不属于style，而且只有document.body才能用
    if (attr === 'scrollTop') { 
        target = element.scrollTop;
    }else if(element.currentStyle){
        target = element.currentStyle[attr]; 
    }else{ 
        target = document.defaultView.getComputedStyle(element,null)[attr]; 
    }
    //在获取 opactiy 时需要获取小数 parseFloat
    return  NumberMode == 'float'? parseFloat(target) : parseInt(target);
} 



const crypto = require('crypto')
const key = '751f621ea5c8f930'
const iv = '2624750004598718'
class Tool{
    static getType(data){
        return Object.prototype.toString.call(data).slice(8, -1);
    }

    static md5(str){
        var md5sum = crypto.createHash('md5');
        md5sum.update(str);
        str = md5sum.digest('hex');
        return str;
    }

     /**
     * 加密方法
     * @param key 加密key
     * @param iv       向量
     * @param data     需要加密的数据
     * @returns string
     */
    static encrypt (key, iv, data) {
        var cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
        var crypted = cipher.update(data, 'utf8', 'binary');
        crypted += cipher.final('binary');
        crypted = new Buffer(crypted, 'binary').toString('base64');
        return crypted;
    };

    /**
     * 解密方法
     * @param key      解密的key
     * @param iv       向量
     * @param crypted  密文
     * @returns string
     */
    static decrypt (key, iv, crypted) {
        crypted = new Buffer(crypted, 'base64').toString('binary');
        var decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
        var decoded = decipher.update(crypted, 'binary', 'utf8');
        decoded += decipher.final('utf8');
        return decoded;
    };



}

global.createToken = function(){
    let date = Date.parse(new Date())
    if(getStore('token') == null){
        return '0'
    }
    let to = getStore('token').token
    let criptDa = Tool.encrypt(key,iv,to + '=' + date)
    criptDa = encodeURIComponent(criptDa)
    return criptDa
}

global.toast = function(vue,message){
    if(globalVue != vue){
        globalVue = vue
    }
    vue.$vux.toast.show({
        text: message,
        position:"bottom",
        type:'text'
    })
}

global.callBack = function(result){
    globalVue.imgCallBack(result)
}

global.setGlobalVue = function(vue){
    if(globalVue != vue){
        globalVue = vue
    }
}


global.clone = function(obj) {
  // Handle the 3 simple types, and null or undefined
  if (null == obj || "object" != typeof obj) return obj;
 
  // Handle Date
  if (obj instanceof Date) {
    var copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }
 
  // Handle Array
  if (obj instanceof Array) {
    var copy = [];
    let len = obj.length
    for (let i = 0;  i < len; ++i) {
      copy[i] = clone(obj[i]);
    }
    return copy;
  }
 
  // Handle Object
  if (obj instanceof Object) {
    var copy = {};
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
    }
    return copy;
  }
 
  throw new Error("Unable to copy obj! Its type isn't supported.");
}