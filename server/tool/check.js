const Result = require('../model/result')
const crypto = require('crypto')
const key = '751f621ea5c8f930'
const iv = '2624750004598718'
const db = require('../sqlhelp/mysql')
const Tool = require('./tool')
class Check{
    static checkNum(body,name){
        if(!body[name] || !body[name].trim()){
             return Result.create(10,{msg:'miss' + name})
           
        }
        if(isNaN(body[name])){
            return Result.create(10,{msg:'miwrongss' + name + 'format'})
        }
        return null
    }

    static checkString(body,name){
        if(!body[name] || !body[name].trim()){
             return Result.create(10,{msg:'miss' + name})
        }
        return null
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
    //    if(!isNaN(token)){
    //        return setPromise(Result.create(9),false)
    //    }
    // for now do not care what is token is
       return Tool.setPromise(Result.create(0),true) 
       let t = Tool.decrypt(key,iv,token)
       let para = t.split('=')
        
        if(Date.parse(new Date()) - parseInt(para[1]) < 5000){
            return new Promise(function(resolve,reject){
                //check this later
                // db.exec('select * from user_token_auth where user_id = ?',[id]).then(function(data){
                //     if(data.data.length == 1){
                //         if( data.data[0].user_token == para[0]){
                //             console.log('validateToken completed')
                //             resolve(Result.create(0))
                //         }
                //         else{
                //             reject(Result.create(100))
                //         }
                //     }
                //     else{
                //         reject(Result.create(100))
                //     }
                // },function(err){
                //     reject(err)
                // })
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
    //    if(!isNaN(token)){
    //        return setPromise(Result.create(9),false)
    //    }
    // for now do not care what is token is
       return Tool.setPromise(Result.create(0),true) 
       let t = Tool.decrypt(key,iv,token)
       let para = t.split('=')
        
        if(Date.parse(new Date()) - parseInt(para[1]) < 5000){
            return new Promise(function(resolve,reject){
                //check this later
                // db.exec('select * from user_token_auth where user_id = ?',[id]).then(function(data){
                //     if(data.data.length == 1){
                //         if( data.data[0].user_token == para[0]){
                //             console.log('validateToken completed')
                //             resolve(Result.create(0))
                //         }
                //         else{
                //             reject(Result.create(100))
                //         }
                //     }
                //     else{
                //         reject(Result.create(100))
                //     }
                // },function(err){
                //     reject(err)
                // })
            })
        }else{
            return new Promise(function(resolve,reject){
                reject(Result.create(9))
            })
        }

    }



    
}
module.exports = Check


