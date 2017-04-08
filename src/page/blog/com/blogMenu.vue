
<template>
    <div class="blogMenu">
       <span>首页</span>

    </div>
</template>

<script>
    export default {
        data() {
            return{
              
            }
        },
        props:{  
          
        },
        methods:{
           
        },
    }
</script>
<style scoped>
.blogMenu{
    border-top: 1px solid #aaa;
    border-bottom:  1px solid #aaa;
    display: flex;    
    justify-content: flex-start;
    padding: 6px 1rem;
    font-size: 20px;
    margin-top: 20px;
    color: white;
}
.blogMenu span:hover{
    cursor: pointer;
    color: navajowhite;
}
</style>
