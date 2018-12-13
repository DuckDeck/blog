/**
 * 配置编译环境和线上环境之间的切换
 * 
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * imgBaseUrl: 图片所在域名地址
 * 
 */
let baseDomain;
let baseUrl; 
let routerMode;
let imgBaseUrl;

if (process.env.NODE_ENV == 'development') {
	baseDomain = 'http://localhost:3000';
	baseUrl = 'http://localhost:3000/api/';
	routerMode = 'hash'
	imgBaseUrl = 'http://localhost:3000/static/';
}else{
	baseDomain = 'http://api.bqbbq.com';
	baseUrl = 'http://api.bqbbq.com/api/';
	routerMode = 'hash'
	imgBaseUrl = 'http://api.bqbbq.com/static/';
}

export {
	baseDomain,
	baseUrl,
	routerMode,
	imgBaseUrl
}