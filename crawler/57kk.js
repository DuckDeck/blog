
var cheerio = require('cheerio')
const axios = require('axios')
var url = "http://www.7kk.com/tagyun/2424.html"
var fs = require('fs')
var request = require("request")
var imgUrls = []

url =  encodeURI(url)

function load(){
    axios.get(url).then(res=>{
        var $ = cheerio.load(res.data)
        let s  = Array.from($('div.imgholder'))
        let imgUrls = s.map(k=>{
            console.log(k)
            return 'http://www.7kk.com' +  k.childNodes[1].attribs.href
        })
       downImg(imgUrls)
        
    }).catch(err=>{
        console.log(err)
    })
}
load()

 function downImg(urls){
   urls.map(s=>{
        axios.get(s).then(res=>{
            var $ = cheerio.load(res.data)
            let k  = $('div.imgbox')
            let imgUrl = k[0].childNodes[1].attribs.href
            downloadImg(imgUrl)
        })
   })
    
}


function downloadImg(url){
    console.log(url)
    let path = __dirname + '\\' + (new Date()).getTime() + '.jpg'
    request(url).pipe(fs.createWriteStream(path))
}