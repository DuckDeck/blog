<template>
      <div class="validating" >
          <div v-show="isValidating">
              正在验证中<i class="el-icon-loading"></i>
          </div>
          <div v-show="!isValidating">
              
          </div>
      </div>
</template>

<script>
import {validateUser} from '../../store/service'
    export default {
        data(){
            return {
                isValidating:true
            }
        },
        async mounted(){
            let code = this.$router.params.code
            //let res = await validateUser(code)

        },
        methods:{
        }

    }
</script>

<style scoped>

.validate{

}
</style>