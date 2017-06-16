<template>
  <div class="calBgDiv" >
      <div class="calTitleDiv" >
          <button type="" @click="close">X</button>
          <!--<span>{{title}}</span>-->
      </div>
       <cal class="event-calendar" :value="value" :disabled-days-of-week="disabled" :format="format" :clear-button="clear" :placeholder="placeholder" :pane="1" :has-input="false" :change-pane="changePane"  :special-days="_dateMap" :on-day-click="onDayClick">
        <div class="event" v-for="evt in events" :slot="evt.date">
                ￥{{evt.price}}
            </div>
        </cal>
  </div>
</template>

<script>
 import cal from './Calendar.vue'
  export default {
    data() {
      return {
        imgs:[],
        index:0,
        msgs:[],
        disabled: [],
        format: 'yyyy-MM-dd',
        clear: true,
        placeholder: 'placeholder is displayed when value is null or empty',
        DATENAME: {
        'today': '今天',
        'yuandan': '元旦',
        'chuxi': '除夕',
        'chunjie': '春节',
        'yuanxiao': '元宵',
        'qingming': '清明',
        'wuyi': '劳动',
        'duanwu': '端午',
        'zhongqiu': '中秋',
        'guoqing': '国庆'
        },
        HOLIDAYS: {
            yuandan: ['2012-01-01', '2013-01-01', '2014-01-01', '2015-01-01', '2016-01-01', '2017-01-01', '2018-01-01', '2019-01-01', '2020-01-01'],
            chuxi: ['2012-01-22', '2013-02-09', '2014-01-30', '2015-02-18', '2016-02-07', '2017-01-27', '2018-02-15', '2019-02-04', '2020-01-24'],
            chunjie: ['2012-01-23', '2013-02-10', '2014-01-31', '2015-02-19', '2016-02-08', '2017-01-28', '2018-02-16', '2019-02-05', '2020-01-25'],
            yuanxiao: ['2012-02-06', '2013-02-24', '2014-02-14', '2015-03-05', '2016-02-22', '2017-02-11', '2018-03-02', '2019-02-19', '2020-02-08'],
            qingming: ['2012-04-04', '2013-04-04', '2014-04-05', '2015-04-05', '2016-04-04', '2017-04-04', '2018-04-05', '2019-04-05', '2020-04-04'],
            wuyi: ['2012-05-01', '2013-05-01', '2014-05-01', '2015-05-01', '2016-05-01', '2017-05-01', '2018-05-01', '2019-05-01', '2020-05-01'],
            duanwu: ['2012-06-23', '2013-06-12', '2014-06-02', '2015-06-20', '2016-06-09', '2017-05-30', '2018-06-18', '2019-06-07', '2020-06-25'],
            zhongqiu: ['2012-09-30', '2013-09-19', '2014-09-08', '2015-09-27', '2016-09-15', '2017-10-04', '2018-09-24', '2019-09-13', '2020-10-01'],
            guoqing: ['2012-10-01', '2013-10-01', '2014-10-01', '2015-10-01', '2016-10-01', '2017-10-01', '2018-10-01', '2019-10-01', '2020-10-01']
        }
      }
    },
    props: {
        value: {
          type: String,
        },
        events:{
            type:Array,
        },
        title:{
           type: String,
        }
    },
    mounted(){
       let bg = document.getElementsByClassName('calBgDiv')[0]
       bg.style.height = screen.height + 'px'
       let cal = document.getElementsByClassName('event-calendar')[0]
       cal.style.bottom = '0px'
    },
    components: {
        cal
    },
    computed: {
        _dateMap () {
          return this._createDateMap()
        },
        
    },
    methods:{
        back(){
            console.log('back')
        },
        show(){
            this.$refs.imgSwipers.show();
        },
        close(){
            this.$emit('close')
        },
        onDayClick (date, str,event) {
          this.value = str
          this.$emit('dateSelected',str)
          let ele = event.target
          
          while(ele.parentNode.tagName != 'SPAN'){
             ele = ele.parentNode
          }
          ele = ele.parentNode
          if(ele.classList.contains('datepicker-item-gray')){
             return
          }

          let s = findChildWithClass(ele,'event')
          if(s.length == 0){
              return
          }
        },
        changePane (year, month, pane) {
            // ajax data or ...
            console.log(this.value)
        },
    stringify (v) {
      if (!this.isDate(v)) return null
      return v.getFullYear() + '-' + this.filled(v.getMonth() * 1 + 1) + '-' + this.filled(v.getDate())
    },
    isDate (v) {
      if (v instanceof Date) {
        return true
      }
      return false
    },
    filled (v) {
      return String(v).replace(/^(\d)$/, '0$1')
    },
     _createDateMap () {
      var oTmp = {}
      for (var propety in this.HOLIDAYS) {
        var curHoliday = this.HOLIDAYS[propety]
        for (var i = 0; i < curHoliday.length; i++) {
          var sDate = curHoliday[i]
          var sName = this.DATENAME[propety]
          oTmp[sDate] = sName
        }
      }
      return oTmp
    },
    }
  }
</script>
<style lang="scss">
    .calBgDiv{
        background: rgba(50, 50, 50, 0.9);
        position: absolute;
        width: 100%;
        top:0px;
        
    }
    .calTitleDiv{

    }
    .calTitleDiv button{
        color: white;
        width: 2rem;
        margin-top: 0.5rem;
        font-size: 1.5rem;
        float: right;
        background: transparent;
    }
    .event-calendar {
        width: 100%;
        bottom: 0px;
        background: white;
        position: absolute !important;
    .datepicker-inner{
        width: 16rem;
        font-size:0.6rem;
    }
    .datepicker-body{
        font-size:0.8rem;
        span{
        width: 2.1rem;
        height: 2.2rem;
        vertical-align: top;
        
        }
        .event{
         color: #E56700;
         font-size: 0.5rem;
        }
        .low{
        color: red;
        font-weight: bold;
        }
        .datepicker-monthRange span{
        width: 100px;
        height: 100px;
        vertical-align: middle;
        line-height: 100px;
        // font-weight: 600;
        }
    }
}
</style>
