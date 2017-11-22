const APIError = require('../rest').APIError;
const Link = require('../model/link')
const Result = require('../model/result.js')
const Tool = require('../tool/tool')
const City = require('../model/city')
const DB = require('../sqlhelp/mysql')
module.exports = {
    'GET /api/cities': async (ctx, next) => {
       let result =await City.getCities()
       ctx.rest(Result.create(0,result))  
    },
  
}

