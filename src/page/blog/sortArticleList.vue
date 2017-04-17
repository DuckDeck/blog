<template>
  <div class="container">      
        <div class="mainSortArticles">
            <div class="blogSortsList">
                <div>
                    <userHead :userInfo = "userInfo"></userHead>
                </div>
               <el-button   :class="[{selectedSortClass:selectedSort.sort_article_id == sort.sort_article_id},'sortCellClass']" v-for="sort in sorts"
                  @click="selectSort(sort)" >
                      {{sort.sort_article_name}}
               </el-button>
            </div>
            <div class="blogSortArticleList">

                
            </div>
        </div>
       <upToTop></upToTop>
       <blogFoot></blogFoot>
  </div>
</template>

<script>
import {articleListWithSort,getSorts} from '../../store/service'
import blogLogo from './com/blogLogo.vue'
import upToTop from './com/upToTop.vue'
import blogFoot from './com/blogFoot.vue'
import userHead from './com/userHeadInfo.vue'
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
        this.sortId = this.$route.params.sortId
        let res = await getSorts(this.userId)
        if(res.code == 0){
            this.sorts = res.data
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
        res = await getUserInfo(id)
        if(res.code == 0){
            this.userInfo = res.data
        }
        else{
            toast(this,res.cMsg)
        }

    },
    components:{
        blogLogo,upToTop,blogFoot,userHead
    },
    methods:{
       selectSort(){

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
}
.blogSortsList{
    margin: 10px;
    padding: 10px;
    font-size: 20px;
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
</style>