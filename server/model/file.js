
const path = require('path')
const Tool = require('../tool/tool')
const fs = require('fs')
const filteredFormat = ['jpeg','jpg','png','gif','txt','rar','zip']
const imgPath = require('../../config/imgPathConfig')
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
            
            return new File(s,imgPath+'static/img/' + s,s.split('.')[1] )
        })
        return paths
    }

}
module.exports = File