const Result = require('../model/result.js')
const City = require('../model/city')
module.exports = {
    'GET /api/cities': async (ctx, next) => {
       let result = await City.getCities()
       ctx.rest(result)  
    },
  
}

