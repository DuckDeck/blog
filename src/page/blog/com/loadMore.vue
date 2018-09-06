<template>
    <div class="loadMore" @click="loadmore" v-loading="isLoading">
        加载更多...
	</div>
</template>


<script>
    export default {
        data() {
            return{
              
            }
        },
        props:{  
          isLoading:{
            type:Boolean
          }
        },
        methods:{
           loadmore(){
				this.$emit('loadmore')
			}
        },
    }
</script>
<style scoped>

</style>
