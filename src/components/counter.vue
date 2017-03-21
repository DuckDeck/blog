<template>
  <div class="counterClass">
     <span v-bind:class="[{cartMinusActive:count>0},'cartMinus']" @click.stop.prevent="minus($event)"  style="font-weight: bold" >-</span>
     <span v-bind:class="[{cartCountActive:count>0},'cartCount']">
      {{count}}
    </span>
    <span style="font-weight: bold" v-bind:class="[{cartAddActive:count<maxCount || maxCount==0},'cartAdd']" @click.stop.prevent="add($event)">+</span>
  </div>
</template>

<script>
  import Vue from 'vue';
  export default {
    props: {
      count: {
        type: Number,
        default:0
      },
      maxCount:{
        type: Number,
        default:0
      },
      model:{
        type:Object
      }
    },
    methods: {
      add(event) {
        if(this.maxCount != 0){
          if(this.count >= this.maxCount){
            return
          }
        }    
         this.count ++
         this.$emit('increment', this.count,this.model); // 子组件通过 $emit触发父组件的方法 increment   还
      },
      minus(event) {
        if(this.count > 0){
          this.count --
          this.$emit('decrement', this.count,this.model); // 子组件通过 $emit触发父组件的方法 increment   还
        }
      }
    }
  };
</script>
<style>
  .counterClass{
    display: inline-flex;
    border: 1px solid #ccc;
    border-radius: 0.1rem;
    justify-content: space-around;
    text-align: center;
  }
  .cartMinus{
   
   width: 33%;
  }
  .cartMinusActive{
    color: green;
  }
  .cartAdd{
    
   width: 33%;
  }
  .cartAddActive{
    color: green;
  }
  .cartCount{
border-left: 1px solid #ccc;
 border-right: 1px solid #ccc;
    width: 33%;
  }
  .cartCountActive{
    background: green;
    color: white;
  }
</style>
