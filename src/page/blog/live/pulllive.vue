<template>
     <div class="container">   
   
        <video-player class="video-player vjs-custom-skin videoPlayer" ref="videoPlayer" :playsinline="true" :options="videoOptions"></video-player>
     </div> 
</template>

<script>

import { videoPlayer } from 'vue-video-player'
import 'videojs-flash'


  export default {
    data() {
      return {
          videoOptions: {
            playbackRates: [0.7, 1.0, 1.5, 2.0],
            loop: false,
            autoplay: false,
            preload: 'auto',
            fluid: true,
            source: {
                type: "rtmp/mp4",
                src: 'rtmp://144.34.157.61:1935/mylive/44',
            },
            techOrder: ['flash'],
            controlBar: {
                timeDivider: true,
                durationDisplay: true,
                remainingTimeDisplay: false,
                fullscreenToggle: true  //全屏按钮
            },
            controls:true,
            notSupportedMessage: '此视频暂无法播放，请稍后再试',
            language: 'zh-CN',
            live: true,
            autoplay: true,
            height: 540
        }
    
      }
    },
    async mounted(){
       
    },
    methods:{

    },
    components:{
        videoPlayer
    }
   
  }
</script>
<style >
.videoPlayer{
    margin-top: 100px;
}
</style>