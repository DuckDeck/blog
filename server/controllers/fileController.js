const APIError = require('../rest').APIError;
const File = require('../model/file')
const Result = require('../model/result.js')
const Tool = require('../tool/tool')




module.exports = {
    'GET /api/file/:userId/:token': async (ctx, next) => {
        let tokenResult = await Tool.checkToken(ctx)
        if(tokenResult.code != 0){
            ctx.rest(tokenResult)
            return
        }
       let filePath = File.allFile()
       ctx.rest(Result.create(0,filePath))
    },

 


}









