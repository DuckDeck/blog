const APIError = require('../rest').APIError;
const BlogManager = require('../model/blogManager')
const Result = require('../model/result.js')
const Tool = require('../tool/tool')
const path = require('path')
const fs = require('fs')
const DB = require('../sqlhelp/mysql')
const Check = require('../tool/check')
const imgPath = require('../../config/imgPathConfig')
module.exports = {
    'POST /api/manage/login': async (ctx, next) => {
       var
            t = ctx.request.body,
            m;
        if (!t.userName || !t.userName.trim()) {
            ctx.rest(Result.create(10,{msg:'miss userName'})) 
            return
        }
        if (!t.password || !t.password.trim()) {
            ctx.rest(Result.create(10,{msg:'miss password'})) 
            return
        }
        let password =  Check.decryptyPass(t.password.trim())
        if(password == ""){
            ctx.rest(Result.create(501))
            return
        }
        m = {
            userName: t.userName.trim(),
            password: password
        };
        let resManage = await BlogManager.checkLogin(m.userName)
        if(resManage.code != 0){
            ctx.rest(resManage)
            return
        }
        if(resManage.data.length <= 0){
            ctx.rest(Result.create(500))
            return
        }
        let manage = resManage.data[0]
        let pass = manage.m_password    
        let mdPass = Tool.md5(m.password)
        if(mdPass != pass){
            ctx.rest(Result.create(501))
            return
        }
        Check.deleteManagerCache(manage.m_id)
        let token = Tool.md5(Math.random().toString())
        await BlogManager.saveToken(token,manage.m_id)
        manage.m_token = token
        let time = Date.parse(new Date())
        let sql = 'update blog_manager set m_last_login_time = ? ,m_login_times = m_login_times + 1  where m_id = ?'
        await DB.exec(sql,[time,manage.m_id])
        ctx.rest(Result.create(0,manage))
    },
    'POST /api/manage/uploadHead/:userId/:token': async (ctx, next) => {
       let result0 = await Check.checkToken(ctx)
        if(result0.code != 0){
            ctx.rest(result0)
            return
        }
       let id = ctx.params.userId
       let token = ctx.params.token
       let  t = ctx.request.body.files.file
       let oldPath = t.path
       if (!fs.existsSync(oldPath)){
           ctx.rest(Result.create(9))
       }
       let fileType = t.type
       let extension = fileType.split('/')[1]
       let newFileName ='manage' +  id + '-' + new Date().getTime()+ '.' + extension
       let newPath =  path.join(__dirname,'../static/myimg/' + newFileName)
       fs.renameSync(oldPath,newPath)
       let urlPath = imgPath.imgPath + "static/myimg/" + newFileName
       let userInsert = {
           user_id:id,
           user_image_url:urlPath
       }
       let res = await user.updateUserHead(userInsert)
       res.data = {url:urlPath}
       ctx.rest(res)
    },
    
}




























