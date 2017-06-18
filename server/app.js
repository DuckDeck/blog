const Koa = require('koa');

const controller = require('./controller');

const rest = require('./rest');

const app = new Koa();

var cors = require('koa-cors');

const isProduction = process.env.NODE_ENV === 'production';

const actions = require('./sqlhelp/createTable')



//actions.createDB()
actions.createTbs()
// const tool = require('./tool/tool')
// let crt = tool.encrypt('751f621ea5c8f930','2624750004598718','123456')
// console.log(crt)
// let cr = tool.decrypt('751f621ea5c8f930','2624750004598718',crt)
// console.log(cr)


//  function test1(){
//     return new Promise((resolve,reject)=>{
//         setTimeout(function() {
//           resolve('1')
//         }, 3000);
//     })
// }

// async function test2(){
//   test1().then(s=>{
//     console.log(s)
//   })
//   console.log('4')
//   let res =   await test1()
//   console.log(res)
//   console.log('2')
// }

// test2()
// console.log('3')

//answer 是 
//43112

// var fs = require('fs')
// fs.createReadStream(__filename+'/stat')


// log request URL:

app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`);
    var
        start = new Date().getTime(),
        execTime;
    await next();
    execTime = new Date().getTime() - start;
    ctx.response.set('X-Response-Time', `${execTime}ms`);
});

// static file support:
let staticFiles = require('./static-files');
app.use(staticFiles('/static/', __dirname + '/static'));

app.use(cors());

// parse request body:

// bind .rest() for ctx:
app.use(rest.restify());

// add controllers:
app.use(controller());

app.listen(3000);
console.log('app started at port 3000...');
