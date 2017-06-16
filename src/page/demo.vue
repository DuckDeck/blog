<template>
  <div style="width: 300px;">
   
  </div>
</template>

<script>

  export default {
    data() {
      return {
        imgs:[],
        index:0,
        demoData: [2, 3,2, 3,2, 3,2, 3]
      }
    },
    mounted(){
        for(var i = 0;i<6;i++){
          setTimeout((function(n) {
          })(i), 2000);
        }

        // let test = `<div contenteditable="true" class="content" style="min-height: 300px;">asdfa<div><img src="http://localhost:3000/static/img/1-1490170777941.jpeg">
        // </div><div style="text-align: center;"><u>asfasfasdfasdfadfasd</u></div><div style="text-align: left;"><u>afa</u></div></div>`
        // let filter = test.replace(/<(?:.|\s)*?>/g,'').replace(/\s/g,'')
    },
    components: {
       
    }

  }
</script>
<style >
  .demo5-item{
    width: 100px;
  height: 26px;
  line-height: 26px;
  text-align: center;
  border-radius: 3px;
  border: 1px solid #ccc;
  background-color: #fff;
  margin-right: 6px;
  }
.demo5-item-selected {
  border-color: #ff4a00;
}
.imgBadge{
  background: red;
  width: 1rem;
  height: 1rem;
  border-radius: 0.5rem;
  position: absolute;
  text-align: center;
  color: white;
  margin: -0.5rem 0 0 -0.5rem;
 
}
</style>