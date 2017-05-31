
<template>
    <div class="blogLogo">
       <img src="static/img/zoe_logo.jpg" alt="">
        <div class="logoDess">
            <span>{{date}}</span> | <span>POWER BY NODE&VUE </span>
        </div>

    </div>
</template>

<script>
    export default {
        data() {
            return{
              
            }
        },
        methods:{
           
        },
        computed:{
            date(){
                let dt = new Date();
                let m=new Array("Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Spt","Oct","Nov","Dec");
                let w=new Array("Monday","Tuseday","Wednesday","Thursday","Friday","Saturday","Sunday");
                let d=new Array("st","nd","rd","th");
                let mn=dt.getMonth();
                let wn=dt.getDay();
                let dn=dt.getDate();
                var dns;
                if(((dn)<1) ||((dn)>3)){
                     dns=d[3];
                }
                else
                {
                    dns=d[(dn)-1];
                    if((dn==11)||(dn==12)){
                      dns=d[3];
                    }
                }
                return m[mn]+" "+dn+dns+" " +w[wn-1]+" "+dt.getFullYear()
            }
        }
    }
</script>
<style scoped>
.blogLogo{
    text-align: center;
    font-size: 20px;
}
.blogLogo img{
    max-width: 100%;
    height: auto;
    margin-top: 60px;
}
.logoDess{
    margin-top: 20px;
    color: white;
}
</style>
