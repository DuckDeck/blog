import axios from 'axios'
import {getUrl} from  '../tool/urlTool'
import qs from 'qs'
import {tool} from '../tool/tool'
import {baseUrl} from '../config/env'
import {setpromisePost,setpromiseGet,setpromiseDelete,setpromisePut} from './conf'
const HostName = baseUrl


export const index = function(){
    const url =  HostName + 'index'
    return setpromiseGet(url)
}

export const indexMore  = function(index){
    const url =  HostName + 'index' + '/' + index + '/' + 10
    return setpromiseGet(url)
}

export const searchbase = function(keyword){
    const url =  HostName + 'searchinfo/' + keyword
    return setpromiseGet(url)
}

export const search = function(keyword,type,index = 0,size = 10){
    const url =  HostName + 'search/' + keyword + '/' + type + '/' + index + '/' + size
    return setpromiseGet(url)
}

