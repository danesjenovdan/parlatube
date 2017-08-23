<template>
    <div id="video">
      <div id="player"></div>
      <div id="slider-container">
        <slider
          v-model="sliderValues"
          :range="true"
          :min="0"
          :max="duration"
          :show-tooltip="true"
        ></slider>
      </div>
    </div>
</template>

<script>
import YouTubeIframeLoader from 'youtube-iframe';
import 'element-ui/lib/theme-default/index.css';
import { Slider } from 'element-ui';
import store from '../store';

export default {
  name: 'parlavideo',
  props: {
    videoId: String,
  },
  components: {
    slider: Slider,
  },
  data() {
    return {
      player: null,
      duration: 0,
      currentTime: 0,
      endTime: 0,
      timeCheckerId: null,
      sliderValues: [0, 0],
    };
  },
  computed: {
    // sliderValues() {
    //   return [this.currentTime, this.duration];
    // },
  },
  watched: {
    currentTime(newCurrentTime) {
      this.player.seekTo(newCurrentTime);
      this.sliderValues = [this.currentTime, this.duration];
    },
  },
  methods: {
    onPlayerReady() {
      console.log(store.commit('editor/toggleLooping'));
      this.duration = this.player.getDuration();
      this.player.playVideo();
      this.timeCheckerId = setInterval(() => {
        this.currentTime = this.player.getCurrentTime();
      }, 1000);
    },
    seekTo(miliseconds) {
      this.player.seekTo(miliseconds / 1000);
    },
  },
  mounted() {
    YouTubeIframeLoader.load((YT) => {
      this.player = new YT.Player('player', {
        height: '390',
        width: '100%',
        videoId: this.videoId,
        events: {
          onReady: this.onPlayerReady,
        },
      });
    });
  },
};
</script>

<style lang="scss" scoped>
  #video {
    display: flex;
    flex: 0 0 100%;
    flex-wrap: wrap;

    #player {
      display: flex;
      flex: 0 0 100%;
    }

    #slider-container {
      display: flex;
      flex: 0 0 100%;

      .el-slider {
        width: 80%;
        margin: auto;
      }

    }
  }
</style>
