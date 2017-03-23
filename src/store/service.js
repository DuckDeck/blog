import axios from 'axios'
import {getUrl} from  '../tool/urlTool'
import qs from 'qs'
import {tool} from '../tool/tool'
const HostName = 'http://localhost:3000/api/'



const setpromiseGet = (url,para) => {
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


const setpromiseDelete = (url,para) => {
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

const setpromisePost = (url,para) => {
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

const setpromisePut = (url,para) => {
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


 export const uploadImgUrl =  function(){
     let userId = 0
     if (getStore('token')){
         userId =  getStore('token').user_id
     }
    return HostName +  'uploadImg/' + userId  + '/' + createToken()
 }

export const manageLogin = function(userName,password){
    const url =  HostName + 'login'
    return setpromisePost(url,{userName:userName,password:password})
}

export const getUserInfo = function(){
    const url = HostName +  'user/' + getStore('token').user_id + '/' + createToken()
    return setpromiseGet(url)
}

export const getTags = function(){
    const url = HostName +  'tag/' + getStore('token').user_id + '/' + createToken()
    return setpromiseGet(url)
}

export const addTag = function(tag){
    const url = HostName +  'tag/' + getStore('token').user_id + '/' + createToken()
    return setpromisePost(url,{tag:tag})
}

export const deleteTag = function(tag){
    const url = HostName +  'tag/' + tag.tag_id + '/' + getStore('token').user_id + '/' + createToken() 
    return setpromiseDelete(url)
}

export const getSorts = function(){
    const url = HostName + 'sort/' + getStore('token').user_id + '/' + createToken()
    return setpromiseGet(url)
}


export const addSort = function(sort){
    const url = HostName +  'sort/' + getStore('token').user_id + '/' + createToken()
    return setpromisePost(url,{sort:sort})
}

export const deleteSort = function(sort){
    const url = HostName +  'sort/'  + sort.sort_article_id + '/' + getStore('token').user_id + '/' + createToken() 
    return setpromiseDelete(url)
}

export const saveArticle = function(article){
    if(article.articleId > 0){
        const url = HostName +  'article/'+ article.articleId + '/'+ getStore('token').user_id + '/' + createToken()
        return setpromisePut(url,article)
    }
    else{
        const url = HostName +  'article/' + getStore('token').user_id + '/' + createToken()
        return setpromisePost(url,article)
    }
    
}



export const deleteAticle = function(article){
     const url = HostName +  'article/'  + article.article_id + '/' + getStore('token').user_id + '/' + createToken()
     return setpromiseDelete(url)
}

export const articleList = function(){
    const url = HostName +  'article/' + getStore('token').user_id + '/' + createToken()
    return setpromiseGet(url)
}

export const articleById = function(article_id){
    const url = HostName +  'article/' + article_id + '/' + getStore('token').user_id + '/' + createToken()
    return setpromiseGet(url)
}

export const inxexArticle = function(){
    const url = HostName +  'article/'  + getStore('token').user_id 
    return setpromiseGet(url)
}




export const getSysytemInfo = function(){
    const url = HostName +  'system/' + getStore('token').user_id + '/' + createToken()
    return setpromiseGet(url)
}
export const uploadSysytemInfo = function(system){
    const url = HostName +  'system/' + getStore('token').user_id + '/' + createToken()
    return setpromisePost(url,system)
}

export const getUserLinks = function(){
    const url = HostName +  'link/' + getStore('token').user_id + '/' + createToken()
    return setpromiseGet(url)
}

export const updateUserLinks = function(links){
    const url = HostName +  'link/' + getStore('token').user_id + '/' + createToken()
    return setpromisePost(url,links)
}

export const updateFriendLinks = function(link){
    const url = HostName +  'link/'+ link.link_id +'/' + getStore('token').user_id + '/' + createToken()
    return setpromisePost(url,link)
}