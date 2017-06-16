
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
        m.category = parseInt(Math.random()*100%4) + 1
        Article.save(m)
   })
}

while(index < 3){
    getUrls(index).then(getActicals)
    index ++
}



 function createUser(name,pass){
    let test1 = new User(name,pass)
    test1.user_register_time = (new Date()).getTime()
    test1.user_register_ip = '127.0.0.1'    
    test1.token = '123'
    User.save(test1).then(res=>{
         let id = res.data.id
        let img_path =  "http://localhost:3000/static/system/tra.png"
        let sql = "insert into user_info (user_id,user_real_name,user_email,user_image_url) values (?,?,?,?)"
       DB.exec(sql,[id,test1.user_name,'youremail@qq.com',img_path]).then(res2=>{
            sql = 'update user set user_isValidate = 1 where user_id = ' + id
             DB.exec(sql)
             DB.exec('insert into article_sort values (0,?,?)',[id,'iOS'])
             DB.exec('insert into article_sort values (0,?,?)',[id,'Android'])
             DB.exec('insert into article_sort values (0,?,?)',[id,'Web'])
             DB.exec('insert into article_sort values (0,?,?)',[id,'Server'])
       })
        
    })
   
}

createUser('test1','123456')
createUser('test2','123456')