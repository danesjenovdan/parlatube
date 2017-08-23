<template>
    <div id="video">
      <div id="player"></div>
    </div>
</template>

<script>
import YouTubeIframeLoader from 'youtube-iframe';

export default {
  name: 'parlavideo',
  data() {
    return {
      player: null,
      timeCheckerId: null,
    };
  },
  methods: {
    onPlayerReady() {
      this.$store.commit('video/UPDATE_DURATION', this.player.getDuration());
      this.timeCheckerId = setInterval(() => {
        if (!this.$store.state.editor.dragging) {
          this.$store.commit('video/UPDATE_CURRENT_TIME', this.player.getCurrentTime());
        } else {
          console.log('dragging');
        }
      }, 1000);
      this.player.playVideo();
    },
    seekTo(seconds) {
      this.player.seekTo(seconds);
    },
  },
  mounted() {
    YouTubeIframeLoader.load((YT) => {
      this.player = new YT.Player('player', {
        height: '390',
        width: '100%',
        videoId: this.$store.state.video.videoId,
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
