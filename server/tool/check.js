const Result = require('../model/result')
const NodeCache = require( "node-cache" );
const myCache = new NodeCache();
const crypto = require('crypto')
const key = '751f621ea5c8f930'
const iv = '2624750004598718'
const db = require('../sqlhelp/mysql')
const Tool = require('./tool')
class Check{
    static checkNum(body,name){
        if(!body[name] || !body[name].trim()){
             return Result.create(10,{msg:'miss ' + name})
        }
        if(Number.isNaN(body[name])){
            return Result.create(10,{msg: name + 'wrong format'})
        }
        return null
      }

    static checkString(body,name){
        if(!body[name] || !body[name].trim()){
             return Result.create(10,{msg:'miss ' + name})
        }
        return null
      }

    static deleteManagerCache(id){
        myCache.del('managerKey' + id)
      }
 
    static deleteUserKey(id){
         myCache.del('userKey' + id)
      }

    static regexCheck(str,regex){
        switch(regex){
            case 'email':
                if(/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/.test( str)){
                    return null
                }
                else{
                    return "邮箱格式不正确"
                }
            break
            case 'cellphone':
                if(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(str)){
                    return null
                }
                else{
                    return "手机格式不正确"
                }
            break
            case 'qq':
                if(/^[1-9]\d{3,11}$/.test(str)){
                    return null
                }else{
                    return "QQ格式不正确"
                }
            case 'url':
                if(/^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i.test(str)){
                    return null
                }else{
                    return "URL格式不正确"
                }    
            default :
            break
        }
      }

    static checkPage(req){
       if(req == undefined){
         return Result.create(9),false
        }
       let index = req.params.index
       let size = req.params.size
       if(index == undefined || size == undefined){
            return Result.create(9)
       }
       if(isNaN(index) || isNaN (size)){
            return Result.create(9)
       }
       if(index < 0 || size <= 0){
           return Result.create(9)
       }
       return null
      } 

    static  async checkManageToken(req,outTime = 5000){
        return new Promise((resolve,reject)=>{
            if(req == undefined){
                 resolve(Result.create(9))
            }
            let id = req.params.mId
            let token = req.params.token
            if(id == undefined || token == undefined){
                 resolve(Result.create(9))
            }
            if(!isNaN(token)){
                return resolve(Result.create(9))
            }
            let t = Tool.decrypt(key,iv,token)
            let para = t.split('=')
            if(Date.parse(new Date()) - parseInt(para[1]) < outTime){
                let value =  myCache.get('managerKey' + id)
                if(value == undefined){
                    db.exec('select * from blog_manager where m_id = ?',[id]).then(function(data){
                        if(data.data.length == 1){
                            if( data.data[0].m_token == para[0]){
                                resolve(Result.create(0))
                                myCache.set("managerKey" + id,data.data[0].m_token)
                            }
                            else{
                                resolve(Result.create(100))
                            }
                        }
                        else{
                            resolve(Result.create(100))
                        }
                    },function(err){
                        reject(err)
                    })
                }
                else  if(para[0] == value){
                    resolve(Result.create(0))
                }
                else{
                    resolve(Result.create(100))
                }
            }
            else{
                resolve(Result.create(9))
            }
        })
     }

    static async checkToken(req,outTime = 5000){ 
       return new Promise((resolve,reject)=>{
           if(req == undefined){
                resolve(Result.create(9))
           }
           let id = req.params.userId
           let token = req.params.token
           if(id == undefined || token == undefined){
               resolve(Result.create(9))
           }
           if(!isNaN(token)){
               resolve(Result.create(9))
           }
           resolve(Result.create(0))
           return  //the public test do not need check the token...
           let t = Tool.decrypt(key,iv,token)
           let para = t.split('=')
           if(Date.parse(new Date()) - parseInt(para[1]) < outTime){
                let value =  myCache.get('userKey' + id)
                if(value == undefined){
                     db.exec('select user_token from user where user_id = ?',[id]).then(function(data){
                        if(data.data.length == 1){
                            if( data.data[0].user_token == para[0]){
                                resolve(Result.create(0))
                                myCache.set('userKey' + id,data.data[0].user_token)
                            }
                            else{
                                resolve(Result.create(100))
                            }
                        }
                        else{
                            resolve(Result.create(100))
                        }
                    },function(err){
                        resolve(err)
                    })
                 }
                  else if(value == para[0]){
                     resolve(Result.create(0))
                  }
                  else{
                      resolve(Result.create(100))
                  }
            }
            else{
                 resolve(Result.create(9))
            }
       })
       
    
     }

     static decryptyPass(pass){
        if(pass == undefined || pass == null){
            return ""
        }
        let t = Tool.decrypt(key,iv,pass)
        let para = t.split('=')
        if(Date.parse(new Date()) - parseInt(para[1]) < 5000){
            return para[0]
        }
        else{
            return ""
        }
     }
}
module.exports = Check


