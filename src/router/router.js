

const demo = r => require.ensure([], () => r(require('../page/demo')), 'demo')



const index = r => require.ensure([], () => r(require('../page/blog/index')), 'index')

const search = r => require.ensure([], () => r(require('../page/blog/searchResult')), 'search')

const login = r => require.ensure([], () => r(require('../page/blog/login')), 'login')

const register = r => require.ensure([], () => r(require('../page/blog/register')), 'register')
const resetPassword = r => require.ensure([], () => r(require('../page/blog/resetPassword')), 'resetPassword')
const active = r => require.ensure([], () => r(require('../page/blog/active')), 'active')
const atricleInfo = r => require.ensure([], () => r(require('../page/blog/article')), 'atricleInfo')
const userInfo = r => require.ensure([], () => r(require('../page/blog/userInfo/userInfo')), 'userInfo')

const myTag = r => require.ensure([], () => r(require('../page/blog/userInfo/myTag')), 'myTag')
const mySetting = r => require.ensure([], () => r(require('../page/blog/userInfo/myInfoSetting')), 'mySetting')
const sortArticleList = r => require.ensure([], () => r(require('../page/blog/sortArticleList')), 'sortArticleList')

const writeArticle =  r => require.ensure([], () => r(require('../page/blog/writeArticle')), 'writeArticle')

const aboutVue =  r => require.ensure([], () => r(require('../page/blog/aboutVue')), 'aboutVue')


const notFoundPage =  r => require.ensure([], () => r(require('../page/blog/404')), 'notFoundPage')


const manage = r => require.ensure([], () => r(require('../page/backstage/com/home')), 'manage')
const manageLogin =  r => require.ensure([], () => r(require('../page/backstage/manageLogin')), 'manageLogin')
const blogSummary  = r => require.ensure([], () => r(require('../page/backstage/summary')), 'blogSummary')

const editArticle  = r => require.ensure([], () => r(require('../page/backstage/editArticle')), 'editArticle')
const manageUser =  r => require.ensure([], () => r(require('../page/backstage/manageUser')), 'manageUser')
const manageUserInfo =  r => require.ensure([], () => r(require('../page/backstage/manageUserInfo')), 'manageUserInfo')
const manageArticle =  r => require.ensure([], () => r(require('../page/backstage/manageArticle')), 'manageArticle')

const manageArticleDetail =  r => require.ensure([], () => r(require('../page/backstage/detailArticle')), 'manageArticleDetail')



const manageComment =  r => require.ensure([], () => r(require('../page/backstage/manageComment')), 'manageComment')
const manageCommentInfo =  r => require.ensure([], () => r(require('../page/backstage/manageCommentInfo')), 'manageCommentInfo')
const manageFile =  r => require.ensure([], () => r(require('../page/backstage/manageFile')), 'manageFile')

const systemSetting =  r => require.ensure([], () => r(require('../page/backstage/systemSetting')), 'systemSetting')

const managerSetting =  r => require.ensure([], () => r(require('../page/backstage/managerSetting')), 'managerSetting')
const managerSettingInfo =  r => require.ensure([], () => r(require('../page/backstage/managerSettingInfo')), 'managerSettingInfo')
export default [
    {
        path: '/',
        component: index, //顶层路由，对应index.html
      
    },
    {
        path: '/login',
        component: login, //顶层路由，对应index.html
        name:'login'
    },
    {
        path: '/register',
        component: register,
    },
    {
        path: '/resetpassword',
        component: resetPassword,
    },
    {
        path: '/search/:keyword',
        component: search, 
    },
    {
        path: '/active/:userid/:code',
        component: active, 
    },
    
    {
        path: '/article/:articleId',
        component: atricleInfo, 
      
    },
    {
        path: '/userInfo/:userId',
        component: userInfo, 
    },
    {
        path: '/mytag/:userId',
        component: myTag, 
    },
    
    {
        path: '/mysetting/:userId',
        component: mySetting, 
    },
    {
        path: '/sortArticleList/:userId',
        component: sortArticleList, 
    },
    {
        path: '/writeArticle/:id',
        component: writeArticle, 
    },

    {
        path:'/managelogin',
        component:manageLogin
    },
    {
        path:'/aboutVue',
        component:aboutVue
    },   
  
   {
        path:'*',
        component: notFoundPage,
        name:'notfound'
    },   
     {
        path: '/manage',
        component: manage,
        children:[
            {
                path:'/',
                component:blogSummary
            },
            {
                path:'summary',
                component:blogSummary
            },
            {
                path:'editArticle/:id',
                component:editArticle
            },
            {
                path:'manageUser',
                component:manageUser
            },
            {
                path:'manageUserInfo/:id',
                component:manageUserInfo
            }, 
            {
                path:'manageArticle',
                component:manageArticle
            },
            {
                path:'article/:id',
                component:manageArticleDetail
            },
            {
                path:'manageComment',
                component:manageComment
            },
            {
                path:'manageCommentInfo/:articleId',
                component:manageCommentInfo
            },
            {
                path:'manageFile',
                component:manageFile
            },
            {
                path:'systemSetting',
                component:systemSetting
            },
            {
                path:'managerSetting',
                component:managerSetting
            },
            {
                path:'managerSettingInfo/:id',
                component:managerSettingInfo
            },
        ]
    },



    {
        path: '/demo',
        component: demo,
        name:'demo'
    },


]