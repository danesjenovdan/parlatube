<template>
    <div id="video">
      <div id="player"></div>
      <drawing :disableEditing="disableEditing"></drawing>
    </div>
</template>

<script>
import YouTubePlayer from 'youtube-player';
import { mapState, mapGetters } from 'vuex';
import Drawing from 'components/Drawing';

export default {
  name: 'ParlaVideo',

  components: {
    Drawing,
  },

  props: {
    height: {
      type: Number,
      default: 371,
    },
    disableEditing: {
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
    };
  },

  methods: {
    updateVideoId(newVideoId) {
      this.player.loadVideoById(newVideoId);
      this.player.playVideo();
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
    }),

    ...mapGetters({
      seekTo: 'video/seekToGetter',
      drawingX: 'drawing/xGetter',
      drawingY: 'drawing/yGetter',
      drawingText: 'drawing/textGetter',
      fontSize: 'drawing/fontSizeGetter',
      color: 'drawing/colorGetter',
    }),

    player: () => YouTubePlayer('player', {
      width: null,
      height: `${this.height}px`,
    }),
  },

  watch: {
    height(newHeight) {
      console.log(newHeight);
      if (newHeight) {
        this.player.setSize(null, this.height);
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
    this.player.loadVideoById(this.videoId);
    this.player.playVideo();
    this.player.mute(); // TODO unMute
    this.timeCheckerId = setInterval(() => {
      // update player playing state
      this.player.getPlayerState().then((playerState) => {
        if ((playerState === 1) || (playerState === 3)) {
          this.$store.commit('video/UPDATE_PLAYING', true);
        } else {
          this.$store.commit('video/UPDATE_PLAYING', false);
        }
      });

      // update duration if needed
      this.player.getDuration().then((duration) => {
        if (this.duration !== duration) {
          this.$store.commit('video/UPDATE_DURATION', duration);
        }
      });

      // check if player out of bounds and update current time
      this.player.getCurrentTime().then((currentTime) => {
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

        this.$store.commit('video/UPDATE_CURRENT_TIME', currentTime);
        return true;
      });
    }, 50);

    this.player.setSize(null, this.height);
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
  display: flex;
  flex: 0 0 100%;
  flex-wrap: wrap;
  position: relative;
  overflow: hidden;
}
</style>

<style lang="scss">
#player {
  display: flex;
  flex: 0 0 100%;

  margin: auto;
  position: relative;

  min-height: 300px;
}
</style>