
const db = require('../sqlhelp/mysql') 
const Tool = require('../tool/tool')

class City{
    constructor(id,phone_num,imei,phone_type,idfa,latitude,longtitude,version){
       this.id = id
       this.imei = imei
       this.phone_num = phone_num
       this.phone_type = phone_type
       this.idfa = idfa
       this.latitude = latitude
       this.longtitude = longtitude
       this.version = version
    }
    
    static phones(){
        return db.exec(`select * from phone_info`,null,'temp')
    }
    
    static getPhoneInfo(phone_nums){
        let s = phone_nums.join(",")
        return db.exec(`select * from phone_info where phone in ( ` + s + `)`,'temp')
    }

    static savePhone(phone){
        console.log(phone)
        let time = (new Date()).getTime()
        time = time - 4 * 60 * 60 * 1000  //服务器在日本,要少四个小时
        time = new Date(time)
        return db.exec(`insert into phone_info values(?,?,?,?,?,?,?,?,?,?)`,
        [0,phone.phone_num,phone.imei,time.getTime(),time.toString(),phone.phone_type,phone.idfa,phone.latitude,phone.longtitude,phone.version], 'temp')
    }    

}
module.exports = City