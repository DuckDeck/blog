const cheerio = require('cheerio')
const request = require('request')
const gbk = require('gbk')
const iconv = require('iconv-lite');

function getFive(letter){
    if(!/[\u4e00-\u9fa5]/gm.test(letter)){
        return Promise.reject("must use chinese")
    }
    let params = {"hzname":iconv.encode(letter,'gbk').toString('binary')}
    console.log(params)
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
             console.log(h)
        }
    }
    request(options,callback)
    // request.post({url:'http://www.52wubi.com/wbbmcx/search.php',form:params,encoding: null},function(err,response,body){
    //     let h = iconv.decode(body,"gb2312")
    //     let $ = cheerio.load(h,{decodeEntities: false})
    //     console.log(h)
    // })


    
}
getFive("我")
