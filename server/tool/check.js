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
}
module.exports = Check