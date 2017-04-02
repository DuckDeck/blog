const crypto = require('crypto')
const key = '751f621ea5c8f930'
const iv = '2624750004598718'
const Result = require('../model/result')
const db = require('../sqlhelp/mysql')
class Tool{
    static getType(data){
        return Object.prototype.toString.call(data).slice(8, -1);
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


    static setPromise(result,ok){
        return new Promise((resolve,reject)=>{
            ok?resolve(result):reject(result)
        })
    }

    static decryptToken(token){
        return Tool.decrypt(key,iv,token)
    }

   
}




module.exports = Tool