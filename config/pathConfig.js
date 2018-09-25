var env = process.env.NODE_ENV || 'production';
env = env.toLowerCase();
let isProduction = env === 'production'

export let imgPath = isProduction?"http://api.bqbbq.com/": "http://localhost:3000/"
export let emailPath = isProduction? "http://bqbbq.com":"http://localhost:8080/"