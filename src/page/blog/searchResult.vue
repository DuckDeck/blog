<template>
     <div class="container">    
            <div class="searchResult">          
                <el-tabs v-model="activeName" class="userInfoTab" type="border-card" @tab-click="handleClick">
                    <el-tab-pane   name="articles">
                        <span slot="label"><i class="fa fa-file-text"></i> 文章 </span>
                        <articleCell v-for="art in articles" :articleInfo = "art"></articleCell>
                        </el-tab-pane>
                    <el-tab-pane  name="dynamic">
                        <span slot="label"><i class="el-icon-date"></i> 用户 </span>
                        
                    </el-tab-pane>
                    <el-tab-pane  name="comment">
                        <span slot="label"><i class="fa fa-comment-o"></i> 分类 </span>
                    </el-tab-pane>
                </el-tabs>
            </div>
           <upToTop></upToTop>
           <blogFoot></blogFoot>
        </div> 
</template>

<script>
import {} from '../../store/service'

import upToTop from './com/upToTop.vue'
import blogFoot from './com/blogFoot.vue'
import articleCell from './userInfo/com/articleCell.vue'
//todo comment sort feature
  export default {
    data() {
      return {
          articles:[],
          users:[],
          sorts:[],
      }
    },
    mounted(){
        let keyword = this.$route.params.keyword

    },
    methods:{

     
        
        
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

</style>