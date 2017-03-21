const crypto = require('crypto')
const key = '751f621ea5c8f930'
const iv = '2624750004598718'
const Result = require('../model/result')
const db = require('../sqlhelp/mysql')
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


    static saveToken(user_id,token){
       return db.exec('replace into user_token_auth (user_id, user_token) values (?,?)',[user_id,token])
    }

    static decryptToken(token){
        return Tool.decrypt(key,iv,token)
    }

    static validateToken(promise_data){
        let t = Tool.decrypt(key,iv,promise_data.token)
        let para = t.split('=')
        return new Promise(function(resolve,reject){
            resolve(promise_data)
        })
        return
        console.log('thic code will not run')
        if(Date.parse(new Date()) - parseInt(para[1]) < 5000){
            return new Promise(function(resolve,reject){
                db.exec('select * from user_token_auth where user_id = ?',[promise_data.user_id]).then(function(data){
                    if(data.data.length == 1){
                        if( data.data[0].user_token == para[0]){
                            console.log('validateToken completed')
                            resolve(promise_data)
                        }
                        else{
                            reject(Result.create(100))
                        }
                    }
                    else{
                        reject(Result.create(100))
                    }
                },function(err){
                    reject(err)
                })
            })
        }else{
            return new Promise(function(resolve,reject){
                reject(Result.create(9))
            })
        }
    }

    static checkToken(req){
        if(req == undefined){
            return setPromise(Result.create(9),false)
        }
       let id = req.params.userId
       let token = req.params.token
       if(id == undefined || token == undefined){
            return setPromise(Result.create(9),false)
       }
       let t = Tool.decrypt(key,iv,token)
       let para = t.split('=')
       return setPromise(Result.create(0),true)  
        if(Date.parse(new Date()) - parseInt(para[1]) < 5000){
            return new Promise(function(resolve,reject){
                db.exec('select * from user_token_auth where user_id = ?',[id]).then(function(data){
                    if(data.data.length == 1){
                        if( data.data[0].user_token == para[0]){
                            console.log('validateToken completed')
                            resolve(Result.create(0))
                        }
                        else{
                            reject(Result.create(100))
                        }
                    }
                    else{
                        reject(Result.create(100))
                    }
                },function(err){
                    reject(err)
                })
            })
        }else{
            return new Promise(function(resolve,reject){
                reject(Result.create(9))
            })
        }



    }
}


function setPromise(result,ok){
    return new Promise((resolve,reject)=>{
        ok?resolve(result):reject(result)
    })
}

module.exports = Tool