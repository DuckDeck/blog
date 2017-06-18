var db    = {};  
var mysql = require('mysql');  
const result = require('../model/result')
var pool  = mysql.createPool({  
  connectionLimit : 10,  
  host            : 'localhost',  
  user            : 'test',  
  password        : '123456',  
  database        : 'blog' ,
});  
//Issue Point there is a bug in the mysql pool system, it looks like it can cache some query when the sql is the some and the 
//request result will not change, this is not looks
//it's not a bug ,it's my issue
db.exec = function(sql,data){
     
    return new Promise(function(resolve,reject){
        if (!sql) {  
            reject(result.create(-100)) 
            return;  
        }
        if(!data){
           data = []
        }
       pool.query(sql,data, function(err, rows, fields) {  
          if (err) { 
              console.log(err)
              pool.query('insert into blog_error values(0,?,?,?,?,?,?)',
              [err.errno,err.name,err.code,err.message,err.toString(),new Date().getTime()],(err,rows,fields)=>{
              })
              reject(result.create(-50))
              return;    
            }
            let res = result.create(0,rows)
            if(sql.trim().substr(0,6) == 'insert' || sql.trim().substr(0,6) == 'replac'){
                if(rows.insertId){
                    res.data = {id:rows.insertId}
                }
            }
            if(sql.trim().substr(0,6) == 'delete'){          
                   res.data = {}
            }
            console.log('exec completed')
            resolve(res) 
          }); 
        
    }) 
}
module.exports = db; 