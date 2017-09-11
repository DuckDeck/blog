const Result = require('../model/result.js')
const cheerio = require('cheerio')
const request = require('request')
const iconv = require('iconv-lite');
const NodeCache = require( "node-cache" );
const myCache = new NodeCache();
const fs = require("fs")
const path = require('path')

module.exports = {
    'GET /api/tool/five/:key': async (ctx, next) => {
        let key = ctx.params.key
        console.log(key)
        if(!/[\u4e00-\u9fa5]/gm.test(key)){
           ctx.rest( Result.create(11,"五笔查询必须为中文"))
           return
        }
        let result = await searchFive(key)
        ctx.rest(result)
     },
     'GET /api/tool/fiveqrcode': async (ctx, next) => {
        let p = path.join(__dirname,'../../static/img/qrcode.png' )
        let data = fs.readFileSync(p)
        ctx.renderData('image/png',data)
     },
}

function searchFive(key){
    return new Promise((resolve,reject)=>{
        let params = "hzname=" + encode(key,"gbk")
        let options = {
            url:"http://www.52wubi.com/wbbmcx/search.php",
            header:{
                "Accept" : "text/html, application/xhtml+xml, image/jxr, */*",
                "Referer" : "http://www.52wubi.com/wbbmcx/search.php",
                "Accept-Language" : "zh-Hans-CN,zh-Hans;q=0.8,en-US;q=0.5,en;q=0.3",
                "User-Agent" : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36 Edge/15.15063",
                "Content-Type" : "application/x-www-form-urlencoded",
                "Content-Length" : 10,
                "Proxy-Connection" : " Keep-Alive",
                "Pragma" : "no-cache"
            },
            method:"POST",
            form:params,
            encoding:null
         }

        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                let h = iconv.decode(body,"gb2312")
                var $ = cheerio.load(h,{decodeEntities: false})
                let s = $('.tbhover')
                let result = []
                for(let i = 0;i<s.length;i++){
                    let t = s[i].children
                    let text = t[1].children[0].children[0].data
                    let spell = t[3].children[0].data
                    let code = t[5].children[0].data
                    let imgDecodeUrl = 'http://www.52wubi.com/wbbmcx/'+ t[7].children[0].attribs.src
                    result.push({
                        "text":text,"spell":spell
                        ,"code":code,"imgDecodeUrl":imgDecodeUrl
                    })
                }
                resolve(Result.create(0,result))
            }
            else{
               reject(Result.create(-1))     
            }
        }
        request(options,callback)
    })
}


function encode(str, charset) {
  var buf = iconv.encode(str, charset);
  var encodeStr = '';
  var ch = '';
  for (var i = 0; i < buf.length; i++) {
    ch = buf[i].toString('16');
    if (ch.length === 1) {
      ch = '0' + ch;
    }
    encodeStr += '%' + ch;
  }
  encodeStr = encodeStr.toUpperCase();
  return encodeStr;
}