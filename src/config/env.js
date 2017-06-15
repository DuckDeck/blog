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
const imgBaseUrl = 'http://45.32.23.77:3000/static/';

if (process.env.NODE_ENV == 'development') {
	baseUrl = 'http://localhost:3000/api/';
	routerMode = 'hash'
}else{
	baseUrl = 'http://52stanhu.com:3000/api/';
	routerMode = 'hash'
}

export {
	baseUrl,
	routerMode,
	imgBaseUrl
}