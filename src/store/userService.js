import axios from 'axios'
import {getUrl} from  '../tool/urlTool'
import qs from 'qs'
import {tool} from '../tool/tool'
import {baseUrl} from '../config/env'
import {setpromisePost,setpromiseGet,setpromiseDelete,setpromisePut} from './conf'
const HostName = baseUrl








export const uploadImgConfig =  function(){
    return  {image: {
        // 后端图片上传的地址，如果为空，默认转图片为base64
        // Url of the server-side,default null and convert image to base64
        server:HostName +  'uploadImg/' + userId()  + '/' + createToken(),
        // 请求时表单参数名
        // the name for file field in multipart request
        fieldName: "image",
        // 文件最大体积，单位字节  max file size
        sizeLimit: 512 * 1024,
        // 是否压缩，默认true，设置为true时会使用localResizeIMG进行压缩
        // default true,if set to true,the image will resize by localResizeIMG (https://github.com/think2011/localResizeIMG)
        compress: true,
        // 图片压缩选项
        // follows are options of localResizeIMG
        width: 1600,
        height: 1600,
        quality: 80,
        // 响应数据处理
        // handle response data，return image url
        uploadHandler(responseText){
            //default accept json data like  {ok:false,msg:"unexpected"} or {ok:true,data:"image url"}
            var json = JSON.parse(responseText)
            callBack(json)
        }
    }}
  
 }

export const login = function(userName,password){
    const url =  HostName + 'login'
    return setpromisePost(url,{userName:userName,password:password})
}

export const register = function(dict){
    const url =  HostName + 'register'
    return setpromisePost(url,dict)
}

export const checkEmail = function(email){
    const url =  HostName + 'checkemail'
    return setpromisePost(url,{email:email})
}

export const checkUserName = function(user_name){
    const url =  HostName + 'checkusername'
    return setpromisePost(url,{user_name:user_name})
}

export const validateUser = function(code){
    const url =  HostName + 'active/' + code
    return setpromiseGet(url)
}

export const ressendemail = function(user_id){
    const url =  HostName + 'resendemail/' + user_id
    return setpromiseGet(url)
}

export const resetPasswordCode = function(mail){
    const url =  HostName + 'resetcode'
    return setpromisePost(url,{email:mail})
}

export const resetPassword = function(dict){
    const url =  HostName + 'resetpassword'
    return setpromisePost(url,dict)
}

export const getUserInfo = function(user_id){
    const url = HostName +  'user/' + user_id 
    return setpromiseGet(url)
}


export const getDynamics = function(user_id,index=0,size=10){
    const url = HostName +  'userdynamic/' + user_id  +  '/' + index + '/' + size
    return setpromiseGet(url)
}

export const getUserComments = function(user_id,index=0,size=10){
    const url = HostName +  'usercomment/' + user_id +  '/' + index + '/' + size
    return setpromiseGet(url)
}



export const getTags = function(user_id){
    const url = HostName +  'tag/userid/' + user_id 
    return setpromiseGet(url)
}

export const addTag = function(tag){
    const url = HostName +  'tag/' + userId() + '/' + createToken()
    return setpromisePost(url,{tag:tag})
}

export const deleteTag = function(tag){
    const url = HostName +  'tag/' + tag.tag_id + '/' + userId() + '/' + createToken() 
    return setpromiseDelete(url)
}






export const getSorts = function(user_id){
    const url = HostName + 'sort/userid/' + user_id 
    return setpromiseGet(url)
}

export const addSort = function(sort){
    const url = HostName +  'sort/' + userId() + '/' + createToken()
    return setpromisePost(url,{sort:sort})
}

export const deleteSort = function(sort){
    const url = HostName +  'sort/'  + sort.sort_article_id + '/' + userId() + '/' + createToken() 
    return setpromiseDelete(url)
}

///api/articles/:userid/sort/:sortid/tag/:tagid/:index/:size': a





export const getUserLinks = function(id){
    const url = HostName +  'link/' + id
    return setpromiseGet(url)
}

export const updateUserLinks = function(links){
    const url = HostName +  'link/' + userId() + '/' + createToken()
    return setpromisePost(url,links)
}

export const updateFriendLinks = function(link){
    const url = HostName +  'link/'+ link.link_id +'/' + userId() + '/' + createToken()
    return setpromisePost(url,link)
}
export const deleteLink = function(link_id){
    const url = HostName +  'link/'+ link_id +'/' + userId() + '/' + createToken()
    return setpromiseDelete(url)
}



export const updateUserInfo = function(type,data){
    const url = HostName + 'user/' +   type
    return setpromisePost(url,data)
}
