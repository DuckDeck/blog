class Result{
    constructor(code,msg,cMsg,data){
        this.code = code
        this.msg = msg
        this.cMsg = cMsg
        this.data = data
    }

    static create(code,data){
        // if(code < 0){
        //     code = -1
        // }

         //debugger 下可以全部展示错误 

        return createResult(code,data)
    }
}
//对于返回的数据是对象，如果找不到，就返回
function createResult(code,data){
    switch (code) {
        case 0:
            return new Result(0,'success','成功',data||{})
            break;
         case -1:
            return new Result(-1,'server wrong','服务器错误',data||{})
            break;
        case 8:
            return new Result(8,'not found object','找不到数据',data||{})
            break;
        case 9:
            return new Result(9,'invalid request','非法请求',data||{})
            break;
        case 10:
            return new Result(10,'miss arguments','缺少参数',data||{})
            break;
        case 11:
            return new Result(11,'wrong arguments format','参数格式错误',data||{})
            break;
        
        case 100:
            return new Result(100,'invalid or expire token','无效或过期的token',data||{})
            break;
        case 101:
            return new Result(101,'invalid or expire active code','无效或过期的验证码',data||{})
            break;
        case 500:
            return new Result(500,'user not found','找不到用户',data||{})
            break;
        case 501:
            return new Result(501,'wrong password','密码错误',data||{})
            break;
        case 502:
            return new Result(502,'email already exist','邮箱已经存在',data||{})
            break;
        case 503:
            return new Result(503,'user is not validate','用户未验证',data||{})
            break;
        case -100:
            return new Result(-100,'sql language error','sql语句错误',data||{})
            break;
        case -50:
            return new Result(-50,'database error','数据库错误',data||{})
            break;
        default:
            break;
    }
}





module.exports = Result