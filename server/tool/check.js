const Result = require('../model/result')
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
       let index = req.params.pageIndex
       let size = req.params.pageSize
       if(index == undefined || size == undefined){
            return Result.create(9)
       }
       if(isNaN(index) || isNaN (size)){
            return Result.create(9)
       }
       if(index <= 0 || size <= 0){
           return Result.create(9)
       }
       return null
    }
}
module.exports = Check