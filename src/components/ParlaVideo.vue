<template>
    <div id="video">
      <div id="player"></div>
      <drawing v-if="showDrawing" :disableEditing="disableEditing"></drawing>
    </div>
</template>

<script>
import YouTubePlayer from 'youtube-player';
import { mapState, mapGetters } from 'vuex';
import isMobile from 'ismobilejs';
import Drawing from 'components/Drawing';

export default {
  name: 'ParlaVideo',

  components: {
    Drawing,
  },

  props: {
    width: {
      type: Number,
      default: 560,
    },
    height: {
      type: Number,
      default: 349,
    },
    disableEditing: {
      type: Boolean,
      default: false,
    },
    showDrawing: {
      type: Boolean,
      default: true,
    },
    showControls: {
      type: Boolean,
      default: false,
    },
    isLive: {
      type: Boolean,
      default: true,
    },
    isMuted: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      timeCheckerId: null,
      seekToTODO: 0,
      currentX: null,
      currentY: null,
      oldCurrentTime: 0,
      player: null,
      loadedAndPlayingCounter: 0,
    };
  },

  methods: {
    updateVideoId(newVideoId) {
      this.player.cueVideoById(newVideoId);
    },
  },

  computed: {
    ...mapState({
      oldSeekTo: state => state.video.oldSeekTo,
      videoId: state => state.video.videoId,
      duration: state => state.video.duration,
      loopStart: state => state.video.loopStart,
      loopEnd: state => state.video.loopEnd,
      looping: state => state.video.looping,
      shouldIPause: state => state.video.shouldIPause,
      videoLoadedAndPlaying: state => state.video.loadedAndPlaying,
    }),

    ...mapGetters({
      seekTo: 'video/seekToGetter',
      drawingX: 'drawing/xGetter',
      drawingY: 'drawing/yGetter',
      drawingText: 'drawing/textGetter',
      fontSize: 'drawing/fontSizeGetter',
      color: 'drawing/colorGetter',
    }),
  },

  watch: {
    height(newHeight) {
      if (newHeight) {
        this.player.setSize(null, this.height);
          // .then(() => {
          // const rect = this.$el.getBoundingClientRect();
          // this.$store.commit('drawing/UPDATE_VIDEO_SIZE',
          // { width: rect.width, height: rect.height });
          // });
      }
    },

    seekTo(newSeekTo) {
      if (newSeekTo !== this.oldSeekTo) {
        this.$store.commit('video/UPDATE_OLD_SEEK_TO', newSeekTo);
        this.player.seekTo(newSeekTo);
      }
    },
    videoId(newVideoId) {
      if (this.player) {
        this.updateVideoId(newVideoId);
      }
    },
    shouldIPause(newShouldIPause) {
      this.player.getPlayerState().then((playerState) => {
        if (((playerState === 1) || (playerState === 3)) && (newShouldIPause === true)) {
          this.player.pauseVideo();
        } else if (((playerState !== 1) || (playerState !== 3)) && (newShouldIPause === false)) {
          this.player.playVideo();
        }
      });
    },
  },

  mounted() {
    this.player = YouTubePlayer('player', {
      width: `${this.width}px`,
      height: `${this.height}px`,
      playerVars: {
        controls: this.showControls ? 1 : 0,
        rel: 0,
        autoplay: 0,
        playsinline: 1,
      },
    });
    this.player.mute();
    if (!isMobile.any) {
      this.player.cueVideoById(this.videoId).then(() => {
        this.player.playVideo();
      });
    } else {
      this.player.cueVideoById(this.videoId);
    }
    this.timeCheckerId = setInterval(() => {
      // update player playing state
      this.player.getPlayerState().then((playerState) => {
        if (playerState) {
          if (playerState === -1) {
            this.player.playVideo();
          } else if (playerState === 1) {
            this.$store.commit('video/UPDATE_PLAYING', true);

            this.loadedAndPlayingCounter += 1;
            if ((this.loadedAndPlayingCounter === 3)) {
              this.player.getCurrentTime().then((currentTime) => {
                if (((currentTime > this.loopStart) && (currentTime < this.loopEnd)) ||
                  (this.$route.name === 'Home')) {
                  this.$store.commit('video/UPDATE_LOADED_AND_PLAYING', true);
                  if (!this.muted) {
                    this.player.unMute();
                  } else {
                    this.player.mute();
                  }
                }
              });
            }
          } else if (playerState === 3) {
            this.loadedAndPlayingCounter = 0;
            this.$store.commit('video/UPDATE_PLAYING', true);
          } else {
            this.$store.commit('video/UPDATE_PLAYING', false);
            this.loadedAndPlayingCounter = 0;
            this.$store.commit('video/UPDATE_LOADED_AND_PLAYING', false);
          }
        }
      });

      // update duration if needed
      this.player.getDuration().then((duration) => {
        // console.log(duration);
        if (this.duration !== duration) {
          this.$store.commit('video/UPDATE_DURATION', duration);
        }
      });

      // check if player out of bounds and update current time
      this.player.getCurrentTime().then((currentTime) => {
        // console.log(this.duration, currentTime);
        // console.log(currentTime);
        // return if currentTime didn't change or is undefined or duration is 0
        if ((currentTime === this.oldCurrentTime) || !currentTime || (this.duration === 0)) {
          return false;
        }

        // update old currentTime
        this.oldCurrentTime = currentTime;
        if (this.looping) {
          if ((currentTime > this.loopEnd) || (currentTime < this.loopStart)) {
            this.player.seekTo(this.loopStart);
            this.$store.commit('video/UPDATE_CURRENT_TIME', this.loopStart);
            return true;
          }
        }

        // if (this.isLive) {
        //   this.$store.commit('video/UPDATE_DURATION', currentTime + 1);
        //   this.$nextTick(() => {
        //     this.$store.commit('video/UPDATE_CURRENT_TIME', currentTime);
        //   });
        // } else {
        this.$store.commit('video/UPDATE_CURRENT_TIME', currentTime);
        // }
        return true;
      });
    }, 50);

    // this.player.setSize(null, this.height);
  },

  beforeDestroy() {
    clearInterval(this.timeCheckerId);
  },
};
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css?family=Anton&subset=latin-ext');
@import '../styles/colors';

#video {
  position: relative;
  overflow: hidden;

  padding-bottom: 56.25%; /* 16:9 */
  height: 0;
}
</style>

<style lang="scss">
#player {
  margin: auto;
  position: relative;

  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

iframe {
  .ytp-paus-overlay {
    display: none;
  }
}

// iframe .html5-video-player div {
//   display: none;
// }
// iframe .html5-video-player .html5-video-container {
//   display: block;
//   background: red;
// }
</style>