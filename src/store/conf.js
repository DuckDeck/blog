export const setpromiseGet = (url,para) => {
    console.log(url)
	return new Promise((resolve, reject) => {
            axios.get(url).then(response=>{
            var res = response.data;
            if(res.code == 0) {
                resolve(res)
            }
            else{
                reject(res)
            }
        }).catch(function(err){
            reject(err)
        })
	})
}


export const setpromiseDelete = (url,para) => {
    console.log(url)
	return new Promise((resolve, reject) => {
            axios.delete(url).then(response=>{
            var res = response.data;
            if(res.code == 0) {
                resolve(res)
            }
            else{
                reject(res)
            }
        }).catch(function(err){
            reject(err)
        })
	})
}

export const setpromisePost = (url,para) => {
    console.log(url)
	return new Promise((resolve, reject) => {
            axios.post(url,qs.stringify(para)).then(response=>{
            var res = response.data;
            if(res.code == 0) {
                resolve(res)
            }
            else{
                reject(res)
            }
        }).catch(function(err){
            reject(err)
        })
	})
}

export const setpromisePut = (url,para) => {
    console.log(url)
	return new Promise((resolve, reject) => {
            axios.put(url,qs.stringify(para)).then(response=>{
            var res = response.data;
            if(res.code == 0) {
                resolve(res)
            }
            else{
                reject(res)
            }
        }).catch(function(err){
            reject(err)
        })
	})
}