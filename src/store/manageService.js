import axios from 'axios'
import {getUrl} from  '../tool/urlTool'
import qs from 'qs'
import {tool} from '../tool/tool'
import {baseUrl} from '../config/env'
import {setpromisePost,setpromiseGet,setpromiseDelete,setpromisePut} from './conf'
const HostName = baseUrl


export const login = function(userName,password){
    const url =  HostName + 'manage/login'
    return setpromisePost(url,{userName:userName,password:password})
}

export const getMeter = ()=>{
    let url = HostName +   'manage/meter/'+ manageId() + '/' + createMtoken()
    return setpromiseGet(url)
}

export const allUser = (index,size)=>{
    let url = HostName +   'manage/user/'+ manageId() + '/' + createMtoken() + '/' + index + '/' + size
    return setpromiseGet(url)
}


export const userInfoById = (id)=>{
    let url = HostName +   'manage/userinfo/'+ id + '/' + manageId() + '/' + createMtoken() 
    return setpromiseGet(url)
}

export const allArticle = (index,size)=>{
    let url = HostName +   'manage/article/'+ manageId() + '/' + createMtoken() + '/' + index + '/' + size
    return setpromiseGet(url)
}

export const releaseArticle = function(status,ids){
    const url = HostName +  'manage/releaseArticle/' +   manageId() + '/' + createMtoken()
    return setpromisePost(url,{releaseIds:ids,setType:status})
}

export const articleById = (id)=>{
    let url = HostName +   'manage/articleinfo/'+ id + '/' + manageId() + '/' + createMtoken() 
    return setpromiseGet(url)
}


export const deleteAticleByManage = function(article){
     const url = HostName +  'manage/article/'  + article.article_id + '/' + manageId() + '/' + createMtoken()
     return setpromiseDelete(url)
}

export const articlesNewComment = (index = 0,size = 10)=>{
     let url = HostName +   'manage/articleslastcomment/'+ manageId() + '/' + createMtoken() + '/' + index + '/' + size
    return setpromiseGet(url)
}



export const getStoredFiles = ()=>{
    let   url = HostName +  'manage/file/' +  manageId() + '/' + createMtoken() 
    return setpromiseGet(url)
}

export const deleteFile = (fileName)=>{
    let url = HostName +  'manage/file/' +  fileName + '/' +  manageId() + '/' + createMtoken() 
    return setpromiseDelete(url)
}


export const getSysytemInfo = function(){
    const url = HostName +  'manage/system/' + manageId() + '/' + createMtoken()
    return setpromiseGet(url)
}
export const uploadSysytemInfo = function(system){
    const url = HostName +  'manage/system/' + manageId() + '/' + createMtoken()
    return setpromisePost(url,system)
}

export const managerList = function(){
    const url = HostName +  'manage/list/' + manageId() + '/' + createMtoken()
    return setpromiseGet(url)
}

export const managerInfoById = function(id){
    const url = HostName +  'manage/info/' + id + '/' + manageId() + '/' + createMtoken()
    return setpromiseGet(url)
}

export const updateManagerPass = function(oldPass,newPass){
    const url = HostName +  'manage/update/' + manageId() + '/' + createMtoken()
    return setpromisePost(url,{oldPassword:oldPass,newPassword:newPass})
}




