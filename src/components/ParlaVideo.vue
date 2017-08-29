<template>
    <div id="video">
      <div id="player"></div>
      <div id="drawing-container">
        <div
          id="drawing"
          :style="{transform: `translate(${drawingX}px, ${drawingY}px)`, 'font-size': `${fontSize}px`, color: color}"
          @mousedown="onDrawingMouseDown"
        >{{ drawingText }}</div>
      </div>
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
      currentX: null,
      currentY: null,
    };
  },

  methods: {
    onPlayerReady() {
      this.$store.commit('video/UPDATE_DURATION', this.player.getDuration());
      this.timeCheckerId = setInterval(() => {
        this.$store.commit('video/UPDATE_CURRENT_TIME', this.player.getCurrentTime());
      }, 200);
      this.player.playVideo();
    },

    onDrawingMouseDown(event) {
      event.preventDefault();
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
  },

  computed: {
    ...mapState({
      oldSeekTo: state => state.video.oldSeekTo,
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
    seekTo(newSeekTo) {
      if (newSeekTo !== this.oldSeekTo) {
        this.$store.commit('video/UPDATE_OLD_SEEK_TO', newSeekTo);
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

  #player {
    display: flex;
    flex: 0 0 100%;
  }

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
