<template>
    <div id="video">
      <div id="player"></div>
    </div>
</template>

<script>
import YouTubeIframeLoader from 'youtube-iframe';
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'parlavideo',
  data() {
    return {
      player: null,
      timeCheckerId: null,
      seekToTODO: 0,
    };
  },
  methods: {
    onPlayerReady() {
      this.$store.commit('video/UPDATE_DURATION', this.player.getDuration());
      this.timeCheckerId = setInterval(() => {
        if (this.player.getCurrentTime() > this.$store.state.editor.sliderValues[1]) {
          if (this.$store.state.editor.looping && !this.$store.state.editor.sealed) {
            const newCurrentTime = this.$store.state.editor.sliderValues[0];
            console.log(newCurrentTime, this.player.getCurrentTime());
            this.player.seekTo(newCurrentTime);
          } else {
            this.player.pauseVideo();
          }
        } else {
          this.$store.commit('video/UPDATE_CURRENT_TIME', this.player.getCurrentTime());
        }
      }, 1000);
      this.player.playVideo();
    },
  },
  computed: {
    ...mapState({
      oldSeekTo: state => state.video.oldSeekTo,
    }),
    ...mapGetters({
      seekTo: 'video/seekToGetter',
    }),
  },
  watch: {
    seekTo(newSeekTo) {
      if (newSeekTo !== this.oldSeekTo) {
        this.player.seekTo(newSeekTo);
      }
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
        playerVars: {
          controls: 1,
        },
        autohide: 0,
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
