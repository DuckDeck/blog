const cheerio = require('cheerio')
const request = require('request')
const iconv = require('iconv-lite');

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

function getFive(letter){
    if(!/[\u4e00-\u9fa5]/gm.test(letter)){
        return Promise.reject("must use chinese")
    }
    let k = encode(letter,"gbk")
    let params = "hzname=" + k

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
              
             console.log(result)
        }
    }
    request(options,callback)
}
getFive("我")


