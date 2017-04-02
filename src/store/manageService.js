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