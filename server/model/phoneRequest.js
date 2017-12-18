
const db = require('../sqlhelp/mysql') 
const Tool = require('../tool/tool')

class PhoneRequest{
    constructor(id,phone_num,phone_type,imei,idfa,latitude,longtitude,version){
       this.id = id
       this.imei = imei
       this.phone_num = phone_num
       this.phone_type = phone_type
       this.idfa = idfa
       this.latitude = latitude
       this.longtitude = longtitude
       this.version = version
       this.address = ""
    }
    
   
    
    static savePhoneRequest(phone){
        console.log(phone)
        let time = new Date()
        return db.exec(`insert into easy_log values(?,?,?,?,?,?,?,?,?,?,?)`,
        [0,phone.phone_num,phone.phone_type,
            time.getTime(),
            time.toLocaleString(),
            phone.imei,
            phone.idfa,
            phone.latitude,
            phone.longtitude,
            phone.address,
            phone.version], 'temp')
    }    

}
module.exports = PhoneRequest