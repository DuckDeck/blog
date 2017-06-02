import axios from 'axios'
import {getUrl} from  '../tool/urlTool'
import qs from 'qs'
import {tool} from '../tool/tool'
import {baseUrl} from '../config/env'
import {setpromisePost,setpromiseGet,setpromiseDelete,setpromisePut} from './conf'
const HostName = baseUrl


export const submitComment = (comment)=>{
    let url = HostName +  'comment'
    if(getStore('token')){
        url = HostName +  'comment/'+ userId() + '/' + createToken()
    }
    return setpromisePost(url,comment)
}

export const getComment =(commentId)=>{
    let url = HostName +  'comment/'+ commentId 
    return setpromiseGet(url)
}



export const commentsByArticleId = (id,index = 0,size = 10)=>{
    let url = HostName +   'articleComment/'+ id + '/' + index + '/' + size
    return setpromiseGet(url)
}