const APIError = require('../rest').APIError;
const Result = require('../model/result.js')
const path = require('path')
const fs = require('fs')
const Tool = require('../tool/tool')
const Check = require('../tool/check')
const DB = require('../sqlhelp/mysql')
const imgPath = require('../../config/imgPathConfig')
module.exports = {
    //管理用户
    'GET /api/manage/list/:mId/:token': async (ctx, next) => {
        let tokenResult = await Check.checkManageToken(ctx)
        if(tokenResult.code != 0){
            ctx.rest(tokenResult)
            return
        }
       let sql = 'select m_id,m_username,m_group,m_last_login_time,m_login_times,m_head from blog_manager'
       let res = await DB.exec(sql)
       ctx.rest(res)
    },

    'GET /api/manage/info/:manageId/:mId/:token': async (ctx, next) => {
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

    'POST /api/manage/update/:mId/:token': async (ctx, next) => {
        let tokenResult = await Check.checkManageToken(ctx)
        if(tokenResult.code != 0){
            ctx.rest(tokenResult)
            return
        }
        let paraCheckResult = Check.checkString(ctx.request.body,'oldPassword')
        if(paraCheckResult){
            ctx.rest(paraCheckResult)
            return
        }
        paraCheckResult = Check.checkString(ctx.request.body,'newPassword')
        if(paraCheckResult){
            ctx.rest(paraCheckResult)
            return
        }
        let oldPass =  Check.decryptyPass(ctx.request.body.oldPassword.trim())
        if(oldPass == ""){
            ctx.rest(Result.create(501))
            return
        }
        let newPass =  Check.decryptyPass(ctx.request.body.newPassword.trim())
        if(newPass == ""){
            ctx.rest(Result.create(501))
            return
        }

        let m_id = ctx.params.mId
        let md5OldPass = Tool.md5(oldPass)
        let sql = 'select m_id from blog_manager where m_id = ? and m_password = ?'
        let res = await DB.exec(sql,[m_id,md5OldPass])
        if(res.code != 0){
             ctx.rest(res)
             return
        }
        if(res.data.length == 0){
            ctx.rest(Result.create(501))
            return
        }
        sql = 'update blog_manager set m_password = ? where m_id = ?'
        
        res = await DB.exec(sql,[Tool.md5(newPass),m_id])
        if(res.code != 0){
             ctx.rest(res)
             return
        }
        res.data = {}
        ctx.rest(res)
    },
    //这是一个隐藏API
    'GET /api/manage/register/:manageName/:managePassword': async (ctx, next) => {
        let paraCheckResult = Check.checkString(ctx.params,'manageName')
        if(paraCheckResult){
            ctx.rest(paraCheckResult)
            return
        }
        paraCheckResult = Check.checkString(ctx.params,'managePassword')
        if(paraCheckResult){
            ctx.rest(paraCheckResult)
            return
        }
        let mName = ctx.params.manageName
        let mPass = Tool.md5(ctx.params.managePassword)
        let sql = 'insert into blog_manager values(0,?,?,?,?,?,?,?,0)'
        let res = await DB.exec(sql,[mName,mPass,'',0,0,0,''])
        ctx.rest(res)
    },

    'POST /api/manage/head/:mId/:token': async (ctx, next) => {
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
       let urlPath = imgPath.imgPath + "static/myimg/" + newFileName
       let sql = 'update blog_manager set m_head = ? where m_id = ?'
       let res = await DB.exec(sql,[urlPath,id])
       res.data = {url:urlPath}
       ctx.rest(res)
    },


}




























