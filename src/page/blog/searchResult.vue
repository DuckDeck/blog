<template>
     <div class="container">    
            <div class="searchResult">   
                <div class="searchResultHint">
                    "{{keyword}}" 的搜索结果
                </div>       
                <el-tabs v-model="activeName" class="searchResultTab" type="border-card" @tab-click="handleClick">
                    <el-tab-pane   name="articles">
                        <span slot="label"><i class="fa fa-file-text"></i> 文章 </span>
                        <div v-if="briefUsers.length > 0 || briefSorts.length > 0"  class="usersSearchResult">
                            <div v-if="briefUsers.length > 0" >
                                <div class="usersSearchResultTitle">
                                    相关用户
                                </div>
                                <div v-for="user in briefUsers" class="usersSearchResultLists" @click="gotoUser(user)">
                                    <img class="usersSearchResultUserHead" :src="user.user_image_url" alt="">
                                    <div>
                                        <div>
                                            {{user.user_real_name}}
                                        </div>
                                        <div>
                                            文章 {{user.article_count}}
                                        </div>
                                    </div>
                                </div>
                            </div>
                             <div v-if="briefSorts.length > 0" >
                                <div>
                                    相关分类
                                </div>
                                <div v-for="sort in briefSorts">
                                    
                                </div>
                            </div>
                        </div>

                        <div class="searchCount">
                            共搜索出<span class="countResult">{{articleCount}}</span>篇文章
                        </div>

                        <articleCell @userHeadClick="userHeadClick" v-for="art in articles" :articleInfo = "art"></articleCell>

                        <div v-show="articles.length < articleCount" class="loadMoreDiv">
                            <el-button :loading="isLoadingArticle" @click="loadMoreArticle" class="loadmoreButton">加载更多文章...</el-button>
                        </div>
                        
                        </el-tab-pane>
                     <el-tab-pane  name="users">
                        <span slot="label"><i class="fa fa-user-circle"></i> 用户 </span>
                        <div class="searchCount">
                            共搜索出<span class="countResult">{{userCount}}</span>个用户
                        </div>
                        <div v-for="user in users" class="searchResultUsers" @click="gotoUser(user)">
                            <img class="usersSearchResultUserHead" :src="user.user_image_url" alt="">
                                    <div>
                                        <div>
                                            {{user.user_real_name}}
                                        </div>
                                        <div>
                                            文章 {{user.article_count}}
                                        </div>
                                    </div>
                        </div>

                        <div v-show="users.length < userCount" class="loadMoreDiv">
                            <el-button :loading="isLoadingArticle" @click="loadMoreUser" class="loadmoreButton">加载更多用户...</el-button>
                        </div>

                    </el-tab-pane>
                    <el-tab-pane  name="sorts">
                        <span slot="label"><i class="el-icon-menu"></i> 分类 </span>
                        <div class="searchCount">
                            共搜索出<span class="countResult">{{sortCount}}</span>个分类
                        </div>
                        <div  class="searchResultSorts">
                            <el-button   v-for="sort in sorts"   @click="selectSort(sort)" >
                                 {{sort.sort_article_name}}
                            </el-button>      
                        </div>
                        <div v-show="sorts.length < sortCount" class="loadMoreDiv">
                            <el-button :loading="isLoadingArticle" @click="loadMoreSort" class="loadmoreButton">加载更多分类...</el-button>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
           <upToTop></upToTop>
           <blogFoot></blogFoot>
        </div> 
</template>

<script>
import {search,searchbase} from '../../store/service'
import upToTop from './com/upToTop.vue'
import blogFoot from './com/blogFoot.vue'
import articleCell from './userInfo/com/articleCell.vue'
//todo comment sort feature
  export default {
    data() {
      return {
          activeName:'articles',
          briefUsers:[],
          briefSorts:[],
          articles:[],
          articleCount:0,
          users:[],
          userCount:0,
          sorts:[],
          sortCount:0,
          keyword:'',
          isLoadingArticle:false,
          isLoadingUser:false,
          isLoadingSort:false,
      }
    },
    mounted(){
        let keyword = this.$route.params.keyword
        this.keyword = keyword
        this.searchBaseResult(keyword)
        this.searchResult(keyword,'article',0,10)
        
    },
    methods:{
        async searchBaseResult(keyword){
            let res = await searchbase(keyword)
            if(res.code == 0){
                this.briefUsers = res.data.users
                this.briefSorts = res.data.sorts
            }
        },
        async searchResult(keyword,type,index,size){
            this.isLoadingArticle = true,
            this.isLoadingUser = true,
            this.isLoadingSort = true
            let res = await search(keyword,type,index,size)
            this.isLoadingArticle = false,
            this.isLoadingUser = false,
            this.isLoadingSort = false
            if(res.code == 0){
               switch(type){
                   case 'article':
                        this.articleCount = res.count
                        this.articles = this.articles.concat(res.data)
                        this.articles = this.articles.map(s=>{
                            let k = s
                            k.article_name = k.article_name.replace(new RegExp(keyword,'gm'),'<em class="search-result-highlight">'+keyword +'</em>')
                            k.article_brief = k.article_brief.replace(new RegExp(keyword,'gm'),'<em class="search-result-highlight">'+keyword +'</em>')
                            return k
                        })
                   break
                   case 'user':
                        this.userCount = res.count
                        this.users = this.users.concat(res.data)
                   break
                   case 'sort':
                        this.sortCount = res.count
                        this.sorts = this.sorts.concat(res.data)
                   break
                   default:
                   break
               }
            }
            else{
                toast(this,res.cMsg)
            }
        },
        loadMoreArticle(){
            this.searchResult(this.keyword,'article',this.articles.length / 10,10)
        },
        loadMoreUser(){
            this.searchResult(this.keyword,'user',this.users.length / 10,10)
        },
        loadMoreSort(){
            this.searchResult(this.keyword,'sort',this.sorts.length / 50,50)
        },
        handleClick(tab,event){
            switch (this.activeName) {
                case 'articles':         
                    break;
                case 'users':
                 if(this.users.length <= 0){
                     this.searchResult(this.keyword,'user',0,10)
                 }
                break
                case 'sorts':
                 if(this.sorts.length <= 0){
                     this.searchResult(this.keyword,'sort',0,10)
                 }
                break
                default:
                    break;
            }
        },
        gotoUser(user){
            this.$router.push('/userInfo/' + user.user_id)
        },
        selectSort(sort){
            localStorage.sortId = sort.sort_article_id
            this.$router.push('/sortArticleList/' + sort.user_info.user_id)
        },
        userHeadClick(user){
            this.$router.push('/userInfo/' + user.user_id)
        }
    },
    components:{
        upToTop,blogFoot,articleCell
    },
    computed:{
        releaseDate(){
            
        },
    }

  }
</script>
<style >
.searchResult{
    margin-top: 60px;
    border-top: 5px solid	#CD00CD;
}
.searchResultTab{
    font-size: 20px;
    min-height: 400px
}
.searchResultHint{
    background: white;
    font-size: 20px;
    padding: 10px;
    color: #666;
}
.searchCount{
    font-size: 16px;
    color: #888;
    margin-bottom: 15px;
}
.countResult{
    color: mediumvioletred;
}
.usersSearchResult{
    font-size: 16px;
    background: #eee;
    margin-bottom: 30px;
    padding: 8px;
}
.usersSearchResultTitle{
    padding: 5px;
}
.usersSearchResultLists{
    display: flex;
    font-size: 14px;
    padding:5px;
    max-width: 120px;
}
.usersSearchResultLists:hover{
    cursor: pointer
}
.usersSearchResultUserHead{
    width: 40px;
    height: 40px;
    margin-right: 8px;
    border-radius: 20px;
}
.searchResultUsers{
    display: flex;
    font-size: 14px;
    border-bottom: 1px solid #999;
    padding-bottom: 8px;
    color: #555;
    margin-bottom: 20px;
}
.searchResultUsers:hover{
    cursor: pointer;
}
</style>