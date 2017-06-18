const DB = require('./sqlhelp/mysql')
module.exports = {
    APIError: function (code, message) {
        this.code = code || 'internal:unknown_error';
        this.message = message || '';
    },
    restify: (pathPrefix) => {
        pathPrefix = pathPrefix || '/api/';
        return async (ctx, next) => {
            if (ctx.request.path.startsWith(pathPrefix)) {
                console.log(`Process API ${ctx.request.method} ${ctx.request.url}...`);
                ctx.rest = (data) => {
                    ctx.response.type = 'application/json'; //明白为什么会在这里有问题了，因为所有的操作完成并且返回后才从数据库里找出数据，这样就会报错，方法没有同步
                    ctx.response.body = data;
                }
                try {
                    await next();
                } catch (e) {
                    console.log('Process API error...' + e);
                    console.log('Process API error...' + e.message);
                    DB.exec('insert into blog_error values(0,?,?,?,?,?,?)',
                        [e.code || 0,e.name || 'no name',e.msg || 'no message',
                        e.cMsg || 'no description',e.stack || e.toString(),new Date().getTime()])
                    ctx.response.status = 400;
                    ctx.response.type = 'application/json';
                    ctx.response.body = {
                        code: e.code || 'internal:unknown_error',
                        message: e.message || ''
                    };
                }
            } else {
                await next();
            }
        };
    }
};
