<template>
     <div class="container">    
            <div class="searchResult">   
                <div class="searchResultHint">
                    "{{keyword}}" 的搜索结果
                </div>       
                <el-tabs v-model="activeName" class="userInfoTab" type="border-card" @tab-click="handleClick">
                    <el-tab-pane   name="articles">
                        <span slot="label"><i class="fa fa-file-text"></i> 文章 </span>
                        
                        <articleCell v-for="art in articles.articles" :articleInfo = "art"></articleCell>
                        </el-tab-pane>
                    <el-tab-pane  name="users">
                        <span slot="label"><i class="el-icon-date"></i> 用户 </span>
                        
                    </el-tab-pane>
                    <el-tab-pane  name="sorts">
                        <span slot="label"><i class="fa fa-comment-o"></i> 分类 </span>
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
.searchResultHint{
    background: white;
    font-size: 20px;
    padding: 10px;
    color: #666;
}
</style>