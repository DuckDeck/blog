

const demo = r => require.ensure([], () => r(require('../page/demo')), 'demo')
const menu = r => require.ensure([], () => r(require('../page/menu')), 'menu')



const index = r => require.ensure([], () => r(require('../page/blog/index')), 'index')

const login = r => require.ensure([], () => r(require('../page/blog/login')), 'login')

const atricleInfo = r => require.ensure([], () => r(require('../page/blog/article')), 'atricleInfo')

const articleList = r => require.ensure([], () => r(require('../page/blog/articleList')), 'articleList')

const manage = r => require.ensure([], () => r(require('../page/backstage/com/home')), 'manage')
const manageLogin =  r => require.ensure([], () => r(require('../page/backstage/manageLogin')), 'manageLogin')
const blogSummary  = r => require.ensure([], () => r(require('../page/backstage/summary')), 'blogSummary')

const editArticle  = r => require.ensure([], () => r(require('../page/backstage/editArticle')), 'editArticle')
const manageUser =  r => require.ensure([], () => r(require('../page/backstage/manageUser')), 'manageUser')
const manageArticle =  r => require.ensure([], () => r(require('../page/backstage/manageArticle')), 'manageArticle')

const manageArticleDetail =  r => require.ensure([], () => r(require('../page/backstage/detailArticle')), 'manageArticleDetail')

const manageTag =  r => require.ensure([], () => r(require('../page/backstage/manageTag')), 'manageTag')


const manageComment =  r => require.ensure([], () => r(require('../page/backstage/manageComment')), 'manageComment')
const manageCommentInfo =  r => require.ensure([], () => r(require('../page/backstage/manageCommentInfo')), 'manageCommentInfo')
const manageFile =  r => require.ensure([], () => r(require('../page/backstage/manageFile')), 'manageFile')
const manageLink =  r => require.ensure([], () => r(require('../page/backstage/manageLink')), 'manageLink')
const userSetting =  r => require.ensure([], () => r(require('../page/backstage/userSetting')), 'userSetting')
const systemSetting =  r => require.ensure([], () => r(require('../page/backstage/systemSetting')), 'systemSetting')


export default [
    {
        path: '/',
        component: index, //顶层路由，对应index.html
      
    },
    {
        path: '/login',
        component: login, //顶层路由，对应index.html
      
    },
    {
        path: '/article/:articleId',
        component: atricleInfo, 
      
    },
    {
        path: '/articleList',
        component: articleList, 
      
    },

     {
        path:'/managelogin',
        component:manageLogin
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
                path:'tag',
                component:manageTag
            },
            {
                path:'userSetting',
                component:userSetting
            },
            {
                path:'systemSetting',
                component:systemSetting
            },
            {
                path:'manageLink',
                component:manageLink
            }
        ]
    },



    {
        path: '/demo',
        component: demo,
        name:'demo'
    },
    {
        path: '/menu',
        component: menu,
        name:'menu'
    },

]