const crypto = require('crypto')
const key = '751f621ea5c8f930'
const iv = '2624750004598718'
const Result = require('../model/result')
const db = require('../sqlhelp/mysql')
const Mailer  = require('nodemailer');
const cheerio = require('cheerio')
// var mailTransport = Mailer.createTransport({
//     host : 'smtp.qq.com',
//     secureConnection: true, // 使用SSL方式（安全方式，防止被窃取信息）
//     auth : {
//         user : '3421902@qq.com',
//         pass : '+ak6269347'
//     },
// })
var mailTransport = Mailer.createTransport('smtps://zoe_blog%40163.com:zoe1234@smtp.163.com');
// var qiniuKey = require('../../config/qiniuKey')
// var qiniu = require('qiniu')
//smtps://username%40163.com:password@smtp.163.com
class Tool{
    static getType(data){
        return Object.prototype.toString.call(data).slice(8, -1);
     }
     /*
    static qiniuToken(){
        var mac = new qiniu.auth.digest.Mac(qiniuKey.ak, qiniuKey.sk);
        var options = {
            scope: 'zoeblog',
        };
        var putPolicy = new qiniu.rs.PutPolicy(options);
        var uploadToken=putPolicy.uploadToken(mac);
        return uploadToken
    }
    */
    static formatTime(date,format){
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

    static convertResultData(result){
        if(result.data.length > 0){
           result.data = result.data[0]
       }
       else{
           result.data = {}
       }
       return result
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


    static decryptToken(token){
        return Tool.decrypt(key,iv,token)
     }

     static sendEmailToActive(user_real_name,mail,link){
        var options = {
            from           : '"ZOE" <zoe_blog@163.com>',
            to             : '"' +user_real_name + '" <'+mail+'>',
            // cc          : ''    //抄送
            // bcc         : ''    //密送
            subject        : 'ZOE Blog',
            text           : 'ZOE Blog',
            html           : '<h1>你好，' + user_real_name + ',你点下面链接激活ZOE Blog</h1>'+link+'',
        
        }
        return new Promise((resolve,reject)=>{
            mailTransport.sendMail(options, function(err, msg){
            if(err){
                reject(err)
            }
            else {
                resolve(msg)
            }
        })})
     }

     static sendEmailToReset(user_real_name,reset_code,mail){
        var options = {
            from           : '"ZOE" <zoe_blog@163.com>',
            to             : '"' +user_real_name + '" <'+mail+'>',
            // cc          : ''    //抄送
            // bcc         : ''    //密送
            subject        : 'ZOE Blog',
            text           : 'ZOE Blog',
            html           : '<h1>你好，' + user_real_name + ',你的重设码是'+reset_code + '</h1>',
        
        }
        return new Promise((resolve,reject)=>{
            mailTransport.sendMail(options, function(err, msg){
            if(err){
                reject(err)
            }
            else {
                resolve(msg)
            }
        })})
     }

   static handleHtmlImg(html){
       return html.replace(/<img.*?(?:>|\/>)/gi,(img)=>{
         return  "<div class='articleImage'>" + img + "</div>"
       })
   }

}




module.exports = Tool