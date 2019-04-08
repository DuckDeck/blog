const Result = require('../model/result.js')
const cheerio = require('cheerio')
const request = require('request')
const iconv = require('iconv-lite');
const fs = require("fs")
const path = require('path')
const City = require('../model/city')
const Phone = require('../model/phone')
const axios = require('axios')
const PhoneRequest = require('../model/phoneRequest')
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
     'GET /api/cities': async (ctx, next) => {
        let result = await City.getCities()
        ctx.rest(result)  
     },
     
     'GET /api/imei/:phone/:imei': async (ctx, next) => {
       let phone_num = ctx.params.phone
       let imei =  ctx.params.imei
       let s = new Phone(0,phone_num,imei,0,0,0.0,0.0,'0.0')
       let result = await Phone.savePhone(s)
       ctx.rest(result)
    },

    'GET /api/imei/:phone': async (ctx, next) => {
        let t = ctx.params.phone
        let phones = t.split(',')
        let result = await Phone.getPhoneInfo(phones)
        ctx.rest(result)
     },

     'POST /api/phoneinfo': async (ctx, next) => {
        let t = ctx.request.body
        let phone_num = t.phone || "0"
        let phone_type = t.phone_type || 0
        let phone_imei = t.imei || "0"
        let phone_idfa = t.idfa  || "0"
        let latitude = t.latitude || 0.0
        let longtitude = t.longtitude || 0.0
        let version = t.version || "0.0"
        let p = new Phone(0,phone_num,phone_imei,phone_type,phone_idfa,latitude,longtitude,version)
        let result = await Phone.savePhone(p)
        ctx.rest(result)
     },

      'POST /api/easylog': async (ctx, next) => {
        let t = ctx.request.body
        let phone_num = t.phone || "0"
        let phone_type = t.phone_type || 0
        let phone_imei = t.imei || "0"
        let phone_idfa = t.idfa  || "0"
        let latitude = t.latitude || 0.0
        let longtitude = t.longtitude || 0.0
        let version = t.version || "0.0"
        let url = t.url || ""
        let log = t.log || ""
        console.log(log)
        let logJs = JSON.parse(log)
        let logs = []
        for (let l of logJs){
            let p = new PhoneRequest(0,phone_num,phone_type,l.time,phone_imei,phone_idfa,latitude,longtitude,version,url,l.logText)
            let result = await PhoneRequest.savePhoneRequest(p)
            logs.push(result)
        }
        ctx.rest(Result.create(0))
      },

     'GET /api/imeis': async (ctx, next) => {
        let result = await Phone.phones()
        ctx.rest(result)
      },

      'GET /api/imei/phoneNum': async (ctx, next) => {
        let result = await Phone.phones()
        ctx.rest(result)
      },

     'GET /api/geocoder/:address': async (ctx, next) => {
        let address = ctx.params.address
        console.log(address)
        let city = await City.searchCity(address)
        if(city.code != 0){
            ctx.rest(city)
            return
        }
        if(city.data.count <= 0 || city.data.count > 1){
            ctx.rest(Result.create(8))
            return
        }
        let area =  city.data[0]
        if (area.latitude > 0){
            ctx.rest(Result.create(0,area))
            return
        }



        //这个地方会卡住？
        let result = await searchAddress(address)
        if(result.code != 0){
            ctx.rest(result)
            return
        }

        area.latitude = result.data.result.location.lat
        area.lontitude = result.data.result.location.lng
        
        await City.saveCityCoordinate(area)
        console.log(area)
        ctx.rest(Result.create(area))
      },
}

function searchFive(key){
    return new Promise((resolve,reject)=>{
        let params = "hzname=" + encode(key,"gbk")
        let options = {
            url:"https://www.52wubi.com/wbbmcx/search.php",
            header:{
                "Accept" : "text/html, application/xhtml+xml, image/jxr, */*",
                "Referer" : "https://www.52wubi.com/wbbmcx/search.php",
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

function searchAddress(address){
        //http://api.map.baidu.com/geocoder/v2/?address=北京市海淀区上地十街10号&output=json&ak=您的ak&callback=showLocation
    return new Promise((resolve,reject)=>{
        axios.get('http://api.map.baidu.com/geocoder/v2/?&output=json&ak=GmgLlkoB8sqMU3HFHuztPezuo2Zpp1mi&address=' + encodeURI(address)).then(function(res){
            if(res.status == 200){
                resolve(Result.create(0,res.data))
            }
            else{
                reject(Result.create(8))    
            }

        })
    })
}
//http://api.map.baidu.com/geocoder/v2/?output=json&pois=0&ak=GmgLlkoB8sqMU3HFHuztPezuo2Zpp1mi&location=39.934,116.329
function searchCoor(coor){
    return new Promise((resolve,reject)=>{
        axios.get('http://api.map.baidu.com/geocoder/v2/?output=json&pois=0&ak=GmgLlkoB8sqMU3HFHuztPezuo2Zpp1mi&location=' + coor.latitude+','+coor.longtitude).then(function(res){
            if(res.status == 200){
                resolve(Result.create(0,res.data))
            }
            else{
                reject(Result.create(8))    
            }

        })
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