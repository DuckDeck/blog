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
            sortId:0           
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
            this.articles = res.data
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
          let  res = await articleListWithSort(this.selectedSort.sort_article_id)
          if(res.code == 0){
               this.articles = res.data
          }
          else{
            toast(this,res.sMsg)
          }
       },
       checkMore(){
            this.$router.push('/articleList')
        },
        
        
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
     background: #20a0ff;
    color: white;
}

.blogSortArticleList{
margin-top: 30px;
padding: 0px 20px;
}
</style>