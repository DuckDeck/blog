
const cheerio = require('cheerio')
const axios = require('axios')
const Article = require('../server/model/article')
let index = 1
let itUrl = 'http://www.jianshu.com/u/ba6dc2f48796?order_by=shared_at&page='
function getUrls(index){
    return new Promise(function(resolve,reject){
        let urls = []
        axios.get(itUrl + index).then(function(res){
            var $ = cheerio.load(res.data,{decodeEntities: false})
            let articals = $('.title')
            for(var i = 0;i<articals.length;i++){
                if(articals[i].name == "a"){
                    urls.push("http://www.jianshu.com" + articals[i].attribs.href)
                }
            }
            console.log(urls)
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
       let img = ''
       if(imgTag && imgTag.length  > 0){
            let url = imgTag[0].match(/src=[\'\"]?([^\'\"]*)[\'\"]?/i)
            if(url && url.length > 0){
                img = url[0].replace("src=\"","").replace("\"","")
                if(img.indexOf('http://') < 0){
                    img  ="http://" + img
                }
            }
       }
       console.log(img)
        let article = {
            articalTitle:title,
            articalSort:0,
            articalContent:content,
            articleStatus:1,
            articleId:0,
            articelImage: img,
            articleBrief:filterContent,
        }

        let m =new Article(article.articalTitle,article.articalContent)
        m.ip = "127.0.0.1"
        m.category = article.articalSort
        m.userId = parseInt(Math.random()*100%3) + 1
        m.articalStatus = 1
        m.articleBrief = article.articleBrief
        m.articleMainImage =  article.articelImage
        Article.save(m)
   })
}

while(index < 3){
    getUrls(index).then(getActicals)
    index ++
}


