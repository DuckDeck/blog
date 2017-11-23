const axios = require('axios')

function searchAddress(address){
    return new Promise((resolve,reject)=>{
        axios.get('http://api.map.baidu.com/geocoder/v2/?&output=json&ak=GmgLlkoB8sqMU3HFHuztPezuo2Zpp1mi&address=%E5%8C%97%E4%BA%AC%E5%B8%82').then(function(res){
            console.log(res)
            if(res.status == 200){
                resolve(res)
            }
            else{
                reject(res)
            }

        })
    })
}

searchAddress("").then(res=>{
    console.log(res)
})