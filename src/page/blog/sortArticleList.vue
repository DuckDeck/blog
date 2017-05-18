<template>
  <div class="container">      
        <div class="mainSortArticles">
            <div class="blogSortsList">
                <div>
                    <userHead class="sortArticleUserHead" :userInfo = "userInfo"></userHead>
                </div>
               <el-button   :class="[{selectedSortClass:selectedSort.sort_article_id == sort.sort_article_id},'sortCellClass']" v-for="sort in sorts"
                  @click="selectSort(sort)" >
                      {{sort.sort_article_name}}
               </el-button>
            </div>
            <div class="blogSortArticleList">
                 <articleCell v-for="art in articles" :articleInfo = "art"></articleCell>
                 <div v-show="articles.length < articleCount" class="loadMoreDiv">
                    <el-button :loading="isLoadingArticles" @click="loadMoreArticle(false)" class="loadmoreButton">加载更多文章...</el-button>
                </div>
            </div>
        </div>
       <upToTop></upToTop>
       <blogFoot></blogFoot>
  </div>
</template>

<script>
import {articleListWithSort,getSorts,getUserInfo} from '../../store/service'
import upToTop from './com/upToTop.vue'
import blogFoot from './com/blogFoot.vue'
import userHead from './com/userHeadInfo.vue'
import articleCell from './userInfo/com/articleCell.vue'
  export default {
    data() {
      return {
            userInfo:{},
            sorts:[],
            articles:[],
            selectedSort:{},
            userId:0,
            sortId:0,
            articleCount:0,   
            isLoadingArticles:false,       
      }
    },
   async mounted(){ 
        this.userId = this.$route.params.userId
        this.sortId = localStorage.sortId
        let res = await getSorts(this.userId)
        if(res.code == 0){
            this.sorts = res.data
            this.sorts.unshift({sort_article_id:0,sort_article_name:"全部"})
            this.selectedSort = this.sorts.find(s=>{
                return s.sort_article_id == this.sortId
            })
        }
        else{
            toast(this,res.sMsg)
        }
        res = await articleListWithSort(this.sortId)
        if(res.code == 0){
            this.articles = res.data.map(s=>{
                s.user_info = this.userInfo
                return s
            })
            this.articleCount = res.count
        }
        else{
            toast(this,res.sMsg)
        }
        res = await getUserInfo(this.userId)
        if(res.code == 0){
            this.userInfo = res.data
        }
        else{
            toast(this,res.cMsg)
        }

    },
    components:{
        upToTop,blogFoot,userHead,articleCell
    },
    methods:{
       async selectSort(sort){
           this.selectedSort = sort
           localStorage.sortId = this.selectedSort.sort_article_id
           this.loadMoreArticle(true)
       },
        checkMore(){
            this.$router.push('/articleList')
        },
        async loadMoreArticle(isNew){
            if(!isNew){
                this.isLoadingArticles = true
            }
            else{
                this.articles = []
            }
            let  res = await articleListWithSort(this.selectedSort.sort_article_id,this.articles.length / 10,10)
            this.isLoadingArticles = false
            if(res.code == 0){
                if(isNew){
                    this.articles = res.data.map(s=>{
                        s.user_info = this.userInfo
                        return s
                    })
                }
                else{
                    this.articles = this.articles.concat(res.data.map(s=>{
                        s.user_info = this.userInfo
                        return s
                    }))
                }
                this.articleCount = res.count
            }
            else{
                toast(this,res.sMsg)
            }
        }
        
    },
    computed:{
        loadMoreWord(){
           return  this.isCanLoadMore?'加载更多...':'已经全部加载完'
        }
    }
  }

</script>
<style >
.mainSortArticles{
    background: white;
    margin-top: 50px;
    border-top: 5px solid slateblue;
    margin-top: 60px;
}
.blogSortsList{
    margin: 10px;
    padding: 10px;
    font-size: 20px;
}
.sortArticleUserHead{
    margin-top: 20px;
    margin-bottom: 20px;
}
.sortCellClass{
    cursor: pointer;
    margin-right: 0.15rem;
    margin-top: 10px;
}
.selectedSortClass{
    background: lightslategray;
    color: white;
}

.blogSortArticleList{
margin-top: 30px;
padding: 0px 20px;
padding-bottom: 40px;
}
</style>