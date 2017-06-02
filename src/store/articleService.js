import axios from 'axios'
import {getUrl} from  '../tool/urlTool'
import qs from 'qs'
import {tool} from '../tool/tool'
import {baseUrl} from '../config/env'
import {setpromisePost,setpromiseGet,setpromiseDelete,setpromisePut} from './conf'
const HostName = baseUrl



export const articlesBySort = function(user_id,sort,tag,index = 0,size = 10){
    if(getType(tag) == "Array"){
        tag = tag.join('_')
    }
    const url = HostName +  'articles/'  + user_id + '/sort/' + sort + '/tag/' + tag +  '/' + index + '/' + size
    return setpromiseGet(url)
}

export const articlebroswer = function(id){
    const url = HostName +  'updatearticlecount/'  + id
    return setpromiseGet(url)
}


export const articlesByUser = function(user_id,index = 0,size = 10){
    const url = HostName +  'articlewithuser/'  + user_id  +  '/' + index + '/' + size
    return setpromiseGet(url)
}

export const saveArticle = function(article,isNew){
    if(!isNew){
        const url = HostName +  'article/'+ article.articleId + '/'+ userId() + '/' + createToken()
        return setpromisePut(url,article)
    }
    else{
        const url = HostName +  'article/' + userId() + '/' + createToken()
        return setpromisePost(url,article)
    }
    
}


export const deleteAticle = function(article){
     const url = HostName +  'article/'  + article.article_id + '/' + userId() + '/' + createToken()
     return setpromiseDelete(url)
}

export const articleList = function(index,size){
    const url = HostName +  'article/' + userId() + '/' + createToken() + '/' + index + '/' + size
    return setpromiseGet(url)
}

export const articleListWithSort = function(sortId,index = 0,size = 10){
    const url = HostName +  'articleswithsort/' + sortId + '/' + index + '/' + size
    return setpromiseGet(url)
}


export const articleById = function(article_id){
    const url = HostName +  'article/' + article_id
    return setpromiseGet(url)
}

export const saveTempArticle = function(article){
    const url = HostName +  'autosavearticle/' + userId() + '/' + createToken()
    return setpromisePost(url,article)
 }
export const tempArticle = function(){
    const url = HostName +  'temparticle/' +  userId() + '/' + createToken()
    return setpromiseGet(url)
}




