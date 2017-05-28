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
        if(isNaN(body[name])){
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

    static deleteManagerCache(){
        myCache.del('managerKey')
      }
 
    static deleteUserKey(){
         myCache.del('userKey')
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
                if(/^[1-9]\d{3,9}$/.test(str)){
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

    static  async checkManageToken(req){
      if(req == undefined){
            return Tool.setPromise(Result.create(9),false)
        }
        let id = req.params.mId
        let token = req.params.token
        if(id == undefined || token == undefined){
                return Tool.setPromise(Result.create(9),false)
       }
       if(!isNaN(token)){
           return Tool.setPromise(Result.create(9),false)
       }
       let t = Tool.decrypt(key,iv,token)
       let para = t.split('=')
        if(Date.parse(new Date()) - parseInt(para[1]) < 5000){
            return new Promise(function(resolve,reject){
               let value =  myCache.get('managerKey')
               if(value == undefined){
                   db.exec('select * from blog_manager where m_id = ?',[id]).then(function(data){
                        if(data.data.length == 1){
                            if( data.data[0].m_token == para[0]){
                                console.log('validateToken completed')
                                resolve(Result.create(0))
                                myCache.set("managerKey",data.data[0].m_token)
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
               }
               else  if(para[0] == value){
                   console.log('cache success')
                    resolve(Result.create(0))
                }
                else{
                    reject(Result.create(100))
                }
                               
            })
        }else{
            return new Promise(function(resolve,reject){
                reject(Result.create(9))
            })
        }
     }

    static async checkToken(req){ 
        if(req == undefined){
            return Tool.setPromise(Result.create(9),false)
        }
       let id = req.params.userId
       let token = req.params.token
       if(id == undefined || token == undefined){
            return Tool.setPromise(Result.create(9),false)
       }
       if(!isNaN(token)){
           return setPromise(Result.create(9),false)
       }
       return Tool.setPromise(Result.create(0),true) 
       let t = Tool.decrypt(key,iv,token)
       let para = t.split('=')
        
        if(Date.parse(new Date()) - parseInt(para[1]) < 5000){
            return new Promise(function(resolve,reject){
                 let value =  myCache.get('userKey')
                 if(value == undefined){
                     db.exec('select * from user_token_auth where user_id = ?',[id]).then(function(data){
                        if(data.data.length == 1){
                            if( data.data[0].user_token == para[0]){
                                console.log('validateToken completed')
                                resolve(Result.create(0))
                                myCache.set("userKey",data.data[0].user_token)
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
                 }
                  else if(value == para[0]){
                     resolve(Result.create(0))
                  }
                  else{
                       reject(Result.create(100))
                  }
            })
        }else{
            return new Promise(function(resolve,reject){
                reject(Result.create(9))
            })
        }
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


