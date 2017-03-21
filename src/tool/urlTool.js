var urls = {
    uid:"http://wap.playnet.cc/html/wb.php"
}
export function getUrl(name,action){
    let url = urls[name]
    let index = url.indexOf('action') 
    if(index >=0){
        url.replace(/{action}/,action)
    }
    return url
}
