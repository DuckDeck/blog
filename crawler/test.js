const axios = require('axios')

console.log((new Date()).getTime())

function searchAddress(address){
    return new Promise((resolve,reject)=>{
        axios.get('http://api.map.baidu.com/geocoder/v2/?&output=json&ak=GmgLlkoB8sqMU3HFHuztPezuo2Zpp1mi&address=' + encodeURI(address)).then(function(res){
            if(res.status == 200){
                resolve(res)
            }
            else{
                reject(res)
            }

        })
    })
}

// searchAddress("北京市").then(res=>{
//     console.log(res.data)
// })