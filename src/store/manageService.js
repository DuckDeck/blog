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
    let url = HostName +   'manage/meter/'+ manageId + '/' + createMtoken()
    return setpromiseGet(url)
}

export const allUser = (index,size)=>{
    let url = HostName +   'manage/user/'+ manageId + '/' + createMtoken() + '/' + index + '/' + size
    return setpromiseGet(url)
}

export const allArticle = (index,size)=>{
    let url = HostName +   'manage/article/'+ manageId + '/' + createMtoken() + '/' + index + '/' + size
    return setpromiseGet(url)
}

export const releaseArticle = function(status,ids){
    const url = HostName +  'manage/releaseArticle/' +   manageId + '/' + createMtoken()
    return setpromisePost(url,{releaseIds:ids,setType:status})
}
