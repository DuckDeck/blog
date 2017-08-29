/**
 * 配置编译环境和线上环境之间的切换
 * 
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * imgBaseUrl: 图片所在域名地址
 * 
 */
let baseUrl; 
let routerMode;
let imgBaseUrl;

if (process.env.NODE_ENV == 'development') {
	baseUrl = 'http://localhost:3000/api/';
	routerMode = 'hash'
	imgBaseUrl = 'http://localhost:3000/static/';
}else{
	baseUrl = 'https://api.bqbbq.com/api/';
	routerMode = 'hash'
	imgBaseUrl = 'https://api.bqbbq.com/static/';
}

export {
	baseUrl,
	routerMode,
	imgBaseUrl
}