const APIError = require('../rest').APIError;
const Result = require('../model/result.js')
const path = require('path')
const fs = require('fs')
const Tool = require('../tool/tool')
const Check = require('../tool/check')
const DB = require('../sqlhelp/mysql')
module.exports = {
    //管理用户
    'GET /api/managelist/:mId/:token': async (ctx, next) => {
        let tokenResult = await Check.checkManageToken(ctx)
        if(tokenResult.code != 0){
            ctx.rest(tokenResult)
            return
        }
       let sql = 'select m_id,m_username,m_group,m_last_login_time,m_login_times,m_head from blog_manager'
       let res = await DB.exec(sql)
       ctx.rest(res)
    },

    'GET /api/manageinfo/:manageId/:mId/:token': async (ctx, next) => {
        let tokenResult = await Check.checkManageToken(ctx)
        if(tokenResult.code != 0){
            ctx.rest(tokenResult)
            return
        }
        let paraCheckResult = Check.checkNum(ctx.params,'manageId')
        if(paraCheckResult){
            ctx.rest(paraCheckResult)
            return
        }
       let sql = 'select m_id,m_username,m_group,m_last_login_time,m_login_times,m_head from blog_manager where m_id = ' + ctx.params.manageId
       let res = await DB.exec(sql)
       ctx.rest(Tool.convertResultData(res))
    },

    'Post /api/manageupdate/:mId/:token': async (ctx, next) => {
        let tokenResult = await Check.checkManageToken(ctx)
        if(tokenResult.code != 0){
            ctx.rest(tokenResult)
            return
        }
        let paraCheckResult = Check.checkString(ctx.request.body,'password')
        if(paraCheckResult){
            ctx.rest(paraCheckResult)
            return
        }
        let pass = ctx.request.body.password
        let md5Pass = Tool.md5(pass)
        let sqlUser = 'update blog_manager set m_password = ? where m_id = ?'
        let res = await DB.exec(sqlUser,[md5Pass,userId])
        ctx.rest(res)
    },

 
    'POST /api/managehead/:mId/:token': async (ctx, next) => {
       let tokenResult = await Check.checkManageToken(ctx)
       if(tokenResult.code != 0){
            ctx.rest(tokenResult)
            return
       }
       let id = ctx.params.mId
       let  t = ctx.request.body.files.file
       let oldPath = t.path
       if (!fs.existsSync(oldPath)){
           ctx.rest(Result.create(9))
       }
       let fileType = t.type
       let extension = fileType.split('/')[1]
       let newFileName = id + '-' + new Date().getTime()+ '.' + extension
       let newPath =  path.join(__dirname,'../static/myimg/' + newFileName)
       fs.renameSync(oldPath,newPath)
       let urlPath = "http://localhost:3000/static/myimg/" + newFileName
       let sql = 'update blog_manager set m_head = ? where m_id = ?'
       let res = await DB.exec(sql,[urlPath,id])
       res.data = {url:urlPath}
       ctx.rest(res)
    },
}




























