//http://www.tuyimm.net/thread-12777-1-1.html


var cheerio = require('cheerio')
const axios = require('axios')
const os = require('os')
var url = "http://www.tuyim.com/thread-22247-1-1.html"
var fs = require('fs')
var request = require("request")
var imagePages = []
url =  encodeURI(url)



// fs.mkdirSync(__dirname + '/' + 'crawler_download' + '/' + 123)
function load(){


    axios.get(url).then(res=>{
        var $ = cheerio.load(res.data)
        let title = $('span#thread_subject')['0'].children[0].data
        let s  = Array.from($('img.lazy')).map(k=>{
            return k.attribs['zoomfile']
        })
        //console.log(s)
        // imagePages = s.map(k=>{
        //     return   k.attribs.href
        // })
        for(let u of s){
             downloadImg(title,u,url)
        }
        
    }).catch(err=>{
        console.log(err)
    })
}
load()
 
function downloadImg(name,url,origin_url){
    console.log(url)
    
    if(!fs.existsSync(__dirname + '\\' + 'crawler_download' + '\\' + name)){
        fs.mkdirSync(__dirname + '\\' + 'crawler_download' + '\\' + name)
    }
    if(!fs.existsSync(__dirname + '/' + 'crawler_download' + '/' + name + '/' + 'tuyyimm.txt')){
        fs.writeFileSync(__dirname + '/' + 'crawler_download' + '/' + name + '/' + 'tuyyimm.txt',origin_url)
    }
    let path = __dirname + '/' + 'crawler_download' + '/' + name + '/' + (new Date()).getTime() + '.jpg'
    request(url).pipe(fs.createWriteStream(path))
}