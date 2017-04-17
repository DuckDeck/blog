<template>
    <div style="margin-top: 20px; display: flex; justify-content: flex-start">
       <div class="leftUserInfo">
          <div class="manageUserHead">
           <img :src="userInfo.user_image_url" alt="">
           <div class="userRealName">
               {{userInfo.user_real_name}}
           </div>
          </div>
          <div class="userDetailContain">
              <div >
                <span class="leftTitle">用户名</span>
                <span class="rightValue">{{userInfo.user_name}}</span>  
              </div>
              <div >
                <span class="leftTitle">性别</span>
                <span class="rightValue">{{userInfo.user_gender}}</span>  
              </div>
              <div >
                <span class="leftTitle">手机号</span>
                <span class="rightValue">{{userInfo.user_phone}}</span>  
              </div>
              <div >
                <span class="leftTitle">邮箱</span>
                <span class="rightValue">{{userInfo.user_email}}</span>  
              </div>
              <div >
                <span class="leftTitle">QQ</span>
                <span class="rightValue">{{userInfo.user_qq}}</span>  
              </div>
              <div >
                <span class="leftTitle">生日</span>
                <span class="rightValue">{{userInfo.user_birthday}}</span>  
              </div>
              <div >
                <span class="leftTitle">住址</span>
                <span class="rightValue">{{userInfo.user_address}}</span>  
              </div>
          </div>
       </div>

       <div class="rightUserInfo">
         <div class="userDesc">
           <div class="userDescTitle">
             用户描述
           </div>
           <div class="userDescContent">
             {{userInfo.user_description}}
           </div>
         </div>
         <div class="userSays">
           <div class="userDescTitle" style="background: mediumseagreen">
             用户语录
           </div>
           <div class="userDescContent">
             {{userInfo.user_says}}
           </div>
         </div>
       </div>
    </div>
</template>
<script>
     export default {
        data() {
            return{}
        },
        props:{
            userInfo:{
               type: Object,
            }
        },
        computed:{
          year(){
              return formatTime(new Date())
          }
        }
      
    }
</script>
<style>
.leftUserInfo{
  margin: 5px;
  border: 1px solid #aaa;
  font-size: 16px;
  width: 300px;
  background: white;
  border-top: 5px slategrey solid;
  padding: 5px;

}
.manageUserHead{
  height: 260px;
  text-align: center;
}
.manageUserHead img{
  width: 180px;
  height: 180px;
  margin-top: 20px;
  margin-bottom: 10px;
}
.userRealName{
  font-size: 20px;
  font-weight: bold;
  color: #444;
}
.userDetailContain{
  margin: 10px;
}
.userDetailContain div{
  border-bottom: 1px solid #ddd;
  padding: 6px 0px;
  margin: 5px 0px;
}
.rightValue{
  float: right;
}
.rightUserInfo{
  margin: 5px;
  border: 1px solid #aaa;
  font-size: 16px;
  width: 300px;
  background: white;
  border-top: 5px seagreen solid;

  margin-left: 20px;
  
}
.userDesc{
  height: 50%;
}
.userDescTitle{
  background: darkviolet;
  color: white;
  padding: 8px;
  font-size: 20px;
  font-weight: bold;
}
.userDescContent{
  padding: 10px;
}
</style>