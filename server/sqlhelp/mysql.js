var db    = {};  
var mysql = require('mysql');  
const result = require('../model/result')
var sqlConfig = require('../../config/sqlConn')
var pool  = mysql.createPool(sqlConfig.blog);

var poolCity  = mysql.createPool(sqlConfig.city);
  //host            : 'bqbbq.com',  
//Issue Point there is a bug in the mysql pool system, it looks like it can cache some query when the sql is the some and the 
//request result will not change, this is not looks
//it's not a bug ,it's my issue
db.exec = function(sql,data,db_name='blog'){
    return new Promise(function(resolve,reject){
        if (!sql) {  
            reject(result.create(-100)) 
            return;  
        }
        if(!data){
           data = []
        }
        if(db_name == 'blog'){
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
        }
        else if (db_name == 'city'){
            poolCity.query(sql,data, function(err, rows, fields) {  
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
        }
    }) 
}
module.exports = db; 