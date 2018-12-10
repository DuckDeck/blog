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


let s = {}
s['zzz'] = []
s['zzz'].push('111')
s['zzz'].push('222')
s['xxx'] = []
s['xxx'].push('333')
s['xxx'].push('444')
for(item in s){
    console.log(s[item])
    let j = s[item].findIndex(t=>{
        return t == '111'
    })
    if(j>=0){
        s[item].splice(j,1)
        console.log(s[item])
        break
    }
}