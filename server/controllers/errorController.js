const APIError = require('../rest').APIError;
const Result = require('../model/result.js')
const Tool = require('../tool/tool')
const Check = require('../tool/check')
const DB = require('../sqlhelp/mysql')
module.exports = {
    'GET /api/manage/error/:mId/:token/:index/:size': async (ctx, next) => {
       let tokenResult = await Check.checkManageToken(ctx)
        if(tokenResult.code != 0){
            ctx.rest(tokenResult)
            return
        }
        let pageResult = Check.checkPage(ctx)
        if(pageResult){
            ctx.rest(pageResult)
            return
        }
        let index = parseInt(ctx.params.index)
        let size = parseInt(ctx.params.size)
        let sql = 'select * from blog_error order by error_time desc limit ?,?'
        let res = DB.exec(sql,[index * size,size])
        ctx.rest(res)
    },
  

}

