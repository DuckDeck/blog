<template>
     <div class="container">    
            <div class="searchResult">   
                <div class="searchResultHint">
                    "{{keyword}}" 的搜索结果
                </div>       
                <el-tabs v-model="activeName" class="userInfoTab" type="border-card" @tab-click="handleClick">
                    <el-tab-pane   name="articles">
                        <span slot="label"><i class="fa fa-file-text"></i> 文章 </span>
                        <div v-if="articles.users.length > 0 || articles.sorts.length > 0"  class="usersSearchResult">
                            <div v-if="articles.users.length > 0" >
                                <div class="usersSearchResultTitle">
                                    相关用户
                                </div>
                                <div v-for="user in articles.users" class="usersSearchResultLists" @click="gotoUser(user)">
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
                             <div v-if="articles.sorts.length > 0" >
                                <div>
                                    相关分类
                                </div>
                                <div v-for="user in articles.users">
                                    
                                </div>
                            </div>
                        </div>
                        <articleCell v-for="art in articles.articles" :articleInfo = "art"></articleCell>
                        </el-tab-pane>
                    <el-tab-pane  name="users">
                        <span slot="label"><i class="el-icon-date"></i> 用户 </span>
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
                    </el-tab-pane>
                    <el-tab-pane  name="sorts">
                        <span slot="label"><i class="fa fa-comment-o"></i> 分类 </span>
                        <div  class="searchResultSorts">
                            <el-button   v-for="sort in sorts"   @click="selectSort(sort)" >
                                 {{sort.sort_article_name}}
                            </el-button>      
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </div>
           <upToTop></upToTop>
           <blogFoot></blogFoot>
        </div> 
</template>

<script>
import {search} from '../../store/index'

import upToTop from './com/upToTop.vue'
import blogFoot from './com/blogFoot.vue'
import articleCell from './userInfo/com/articleCell.vue'
//todo comment sort feature
  export default {
    data() {
      return {
          activeName:'articles',
          articles:{},
          users:[],
          sorts:[],
          keyword:''
      }
    },
    mounted(){
        let keyword = this.$route.params.keyword
        this.keyword = keyword
        this.searchResult(keyword,'article',0,10)
    },
    methods:{
        async searchResult(keyword,type,index,size){
            let res = await search(keyword,type,index,size)
            if(res.code == 0){
               switch(type){
                   case 'article':
                        this.articles = res.data
                        this.articles.articles = this.articles.articles.map(s=>{
                            let k = s
                            k.article_name = k.article_name.replace(new RegExp(keyword,'gm'),'<em class="search-result-highlight">'+keyword +'</em>')
                            k.article_brief = k.article_brief.replace(new RegExp(keyword,'gm'),'<em class="search-result-highlight">'+keyword +'</em>')
                            return k
                        })
                   break
                   case 'user':
                        this.users = res.data
                   break
                   case 'sort':
                        this.sorts = res.data
                   break
                   default:
                   break
               }
            }
            else{
                toast(this,res.cMsg)
            }
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
    margin-top: 70px;
}
.userInfoTab{
    font-size: 20px;
}
.searchResultHint{
    background: white;
    font-size: 20px;
    padding: 10px;
    color: #666;
}
.usersSearchResult{
    font-size: 16px;
    background: #eee;
    margin-bottom: 40px;
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
}
.searchResultUsers{
    display: flex;
    font-size: 14px;
    border-bottom: 1px solid #999;
    padding-bottom: 8px;
    color: #555;
}
</style>