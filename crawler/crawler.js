
const cheerio = require('cheerio')
const axios = require('axios')
var count = 0
var urls = []
const artical = require('../server/model/artical')

function getUrls(){
    return new Promise(function(resolve,reject){
        axios.get('http://www.jianshu.com/').then(function(res){
            var $ = cheerio.load(res.data)
            let articals = $('.content .meta')
            for(var i = 0;i<articals.length;i++){
                if(/^(\/p\/)[a-zA-Z0-9]{12}$/.test(articals[i].children[3].attribs.href)){
                    let l = 'http://www.jianshu.com' + articals[i].children[3].attribs.href
                    urls.push(l)
                }
                
            }
            resolve(urls)
        })
    })
}

function getActicals(urls){
   
   axios.get(urls[1]).then(function(res){
       var $ = cheerio.load(res.data)
       let title = $('.title').text()
       let lastEditTime = $('.publish-time').text()
       let content = $('.show-content').html()
       let arc =new artical(title,lastEditTime,content)
       artical.save(arc)
   })
}

getUrls().then(getActicals)