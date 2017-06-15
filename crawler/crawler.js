
const cheerio = require('cheerio')
const axios = require('axios')
var count = 0
var urls = []
const Article = require('../server/model/article')
const User = require('../server/model/user')
const DB = require('../server/sqlhelp/mysql')
function getUrls(){
    return new Promise(function(resolve,reject){
        axios.get('http://www.jianshu.com/').then(function(res){
            var $ = cheerio.load(res.data,{decodeEntities: false})
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
  for(let u of urls){
      saveArticle(u)
  }
}

function saveArticle(url){
     axios.get(url).then(function(res){
       var $ = cheerio.load(res.data,{decodeEntities: false})
       let title = $('.title').text()
       let lastEditTime = $('.publish-time').text()
       let content = $('.show-content').html()
       let filterContent  = content.replace(/<(?:.|\s)*?>/g,'').replace(/\s/g,'').substr(0,200)
       let imgTag = content.match(/<img.*?(?:>|\/>)/gi)
       let url = imgTag[0].match(/src=[\'\"]?([^\'\"]*)[\'\"]?/i)
        let article = {
            articalTitle:title,
            articalSort:0,
            articalContent:content,
            articleStatus:1,
            articleId:0,
            articelImage: "http:" + url[0].replace("src=\"","").replace("\"",""),
            articleBrief:filterContent,
        }

        let m =new Article(article.articalTitle,article.articalContent)
        m.ip = "127.0.0.1"
        m.category = article.articalSort
        m.userId = parseInt(Math.random()*100%2) + 1
        m.articalStatus = 1
        m.articleBrief = article.articleBrief
        m.articleMainImage =  article.articelImage
        m.category = parseInt(Math.random()*100%4) + 1
        Article.save(m)
   })
}


//getUrls().then(getActicals)
