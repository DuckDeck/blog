
const path = require('path')
const Tool = require('../tool/tool')
const fs = require('fs')
const filteredFormat = ['jpeg','jpg','png','gif','txt','rar','zip']
const imgPath = require('../../config/imgPathConfig')
const Result = require('./result')
class File{
    constructor(file_name,file_url,file_type){
       this.file_name = file_name
       this.file_url = file_url
       this.file_type = file_type

    }

    static allFile(){
        let p = path.join(__dirname,'../static/img' )
        let paths =  fs.readdirSync(p)
        paths = paths.filter(s=>{
            return s.indexOf('.') > 0 &&  filteredFormat.indexOf( s.split('.')[1]) >= 0
        })
        paths = paths.map(s=>{
            
            return new File(s,imgPath.imgPath+'static/img/' + s,s.split('.')[1] )
        })
        return paths
    }

    static deleteFile(fileName){
        let p = path.join(__dirname,"../static/img")
        let fullFileName = path.join(p,fileName)
        return new Promise((resolve,reject)=>{
            fs.unlink(fullFileName,(err)=>{
                if(err){
                    resolve(Result.create(550))
                    return
                }
                else{
                    resolve(Result.create(0))
                }

            })
        })
    }

}
module.exports = File