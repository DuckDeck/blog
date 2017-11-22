
const db = require('../sqlhelp/mysql') 
const Tool = require('../tool/tool')

class City{
    constructor(id,city_id,province_id,city_name){
       this.id = id
       this.city_id = city_id
       this.province_id = province_id
       this.city_name = city_name
    }
    
    static getCities(){
        return db.exec("select *,(select province from provinces where provinces.provinceid = cities.provinceid) as province from cities",null,'city')
    }
    
}
module.exports = City