<template>
    <div id="video">
      <div id="player"></div>
      <div id="drawing-container">
        <div
          id="drawing"
          :style="{transform: `translate(${drawingX}px, ${drawingY}px)`, 'font-size': `${fontSize}px`, color: color}"
          @mousedown.prevent="onDrawingMouseDown"
          @touchstart.prevent="onDrawingTouchStart"
        >{{ drawingText }}</div>
      </div>
    </div>
</template>

<script>
import YouTubePlayer from 'youtube-player';
import { mapState, mapGetters } from 'vuex';

export default {
  name: 'parlavideo',

  data() {
    return {
      timeCheckerId: null,
      seekToTODO: 0,
      currentX: null,
      currentY: null,
    };
  },

  methods: {
    onDrawingMouseDown(event) {
      this.currentX = event.clientX;
      this.currentY = event.clientY;
      window.addEventListener('mousemove', this.onDrawingDragging);
      window.addEventListener('mouseup', this.onDrawingDragEnd);
    },

    onDrawingDragging(event) {
      const diffX = (event.clientX - this.currentX);
      const diffY = (event.clientY - this.currentY);
      this.currentX = event.clientX;
      this.currentY = event.clientY;
      this.$store.commit('drawing/UPDATE_X', this.drawingX + diffX);
      this.$store.commit('drawing/UPDATE_Y', this.drawingY + diffY);
    },

    onDrawingDragEnd() {
      window.removeEventListener('mousemove', this.onDrawingDragging);
      window.removeEventListener('mouseup', this.onDrawingDragEnd);
    },

    onDrawingTouchStart(event) {
      this.currentX = event.targetTouches[0].clientX;
      this.currentY = event.targetTouches[0].clientY;
      window.addEventListener('touchmove', this.onDrawingTouchDragging);
      window.addEventListener('touchend', this.onDrawingTouchDragEnd);
    },

    onDrawingTouchDragging(event) {
      const diffX = (event.targetTouches[0].clientX - this.currentX);
      const diffY = (event.targetTouches[0].clientY - this.currentY);
      this.currentX = event.targetTouches[0].clientX;
      this.currentY = event.targetTouches[0].clientY;
      this.$store.commit('drawing/UPDATE_X', this.drawingX + diffX);
      this.$store.commit('drawing/UPDATE_Y', this.drawingY + diffY);
    },

    onDrawingTouchDragEnd() {
      window.removeEventListener('touchmove', this.onDrawingTouchDragging);
      window.removeEventListener('touchend', this.onDrawingTouchDragEnd);
    },

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
      height: null,
    }),
  },

  watch: {
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
  },

  mounted() {
    this.player.loadVideoById(this.videoId);
    this.player.playVideo();
    this.player.unMute();
    this.timeCheckerId = setInterval(() => {
      // update duration if needed
      this.player.getDuration().then((duration) => {
        if (this.duration !== duration) {
          this.$store.commit('video/UPDATE_DURATION', duration);
        }
      });

      // check if player out of bounds and update current time
      this.player.getCurrentTime().then((currentTime) => {
        if (this.looping) {
          if (currentTime > this.loopEnd) {
            this.player.seekTo(this.loopStart);
          }
        }

        this.$store.commit('video/UPDATE_CURRENT_TIME', currentTime);
      });
    }, 200);
  },

  beforeDestroy() {
    clearInterval(this.timeCheckerId);
  },
};
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css?family=Anton&subset=latin-ext');

#video {
  display: flex;
  flex: 0 0 100%;
  flex-wrap: wrap;
  position: relative;

  #drawing-container {
    width: 100%;
    height: 100%;
    position: absolute;

    #drawing {
      background: transparent;
      position: absolute;
      font-size: 40px;
      cursor: pointer;
      font-family: Anton, Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
      font-weight: 900;
      text-transform: uppercase;
      top: 45%;
      left: 45%;
      color: #ffffff;
    }
  }
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