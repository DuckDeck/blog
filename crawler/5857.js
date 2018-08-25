
var cheerio = require('cheerio')
const axios = require('axios')
var url = "http://www.5857.com/sjbz/68300.html"
var fs = require('fs')
var request = require("request")
var imagePages = []
url =  encodeURI(url)
// fs.mkdirSync(__dirname + '/' + 'crawler_download' + '/' + 123)
function load(){
    axios.get(url).then(res=>{
        var $ = cheerio.load(res.data)
        let s  = Array.from($('a.hot')['0'].parent.children).filter(s=>{
            return s.type == "tag"
         })
        imagePages = s.map(k=>{
            return   k.attribs.href
        })
        downImgPage(imagePages)
        
    }).catch(err=>{
        console.log(err)
    })
}
load()
 function downImgPage(urls){
   for(let url of urls){
    axios.get(url).then(res=>{
        var $ = cheerio.load(res.data)
        let s  = $('a.title_czky')['0'].attribs.href
        let name = $('h1.main_center_h2')['0'].children[0].data
        downloadImg(name,s,url)
    }).catch(err=>{
        console.log(err)
    })
   }
}
function downloadImg(name,url,origin_url){
    console.log(url)
    if(!fs.existsSync(__dirname + '/' + 'crawler_download' + '/' + name)){
        fs.mkdirSync(__dirname + '/' + 'crawler_download' + '/' + name)
    }
    if(!fs.existsSync(__dirname + '/' + 'crawler_download' + '/' + name + '/' + '5857.txt')){
        fs.writeFileSync(__dirname + '/' + 'crawler_download' + '/' + name + '/' + '5857.txt',origin_url)
    }
    let path = __dirname + '/' + 'crawler_download' + '/' + name + '/' + (new Date()).getTime() + '.jpg'
    request(url).pipe(fs.createWriteStream(path))
}