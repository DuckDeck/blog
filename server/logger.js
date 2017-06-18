
let log4js = require('log4js')

log4js.configure({
    appenders: [{
        type: 'console' // 控制台输出
    }, {
        type: 'dateFile', // 文件输出
        filename: 'logs/log.log', // 需要手动创建此文件夹
        pattern: "yyyy-MM-dd.log",
        alwaysIncludePattern: true,
        maxLogSize: 1024,
        backups: 4, // 日志备份数量，大于该数则自动删除
        category: 'logInfo' // 记录器名  
    }],
    replaceConsole: true // 替换 console.log
});

let levels = {
    'trace': log4js.levels.TRACE,
    'debug': log4js.levels.DEBUG,
    'info': log4js.levels.INFO,
    'warn': log4js.levels.WARN,
    'error': log4js.levels.ERROR,
    'fatal': log4js.levels.FATAL
};


// this feature is for express so it will not work in koa2, abandon it
exports.use = function (app, level = 'debug') {
    app.use(log4js.connectLogger(log4js.getLogger('logInfo'), {
        level: levels[level],
        format: ':method :url :status'
    }));
};

exports.logger = function(name,level = 'debug'){
    var logger = log4js.getLogger(name);
    logger.setLevel(levels[level]);
    return logger;
}