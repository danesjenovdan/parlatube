<template>
    <div id="video">
      <div id="player"></div>
    </div>
</template>

<script>
export default {
  name: 'parlavideo',
  props: {
    videoId: String,
  },
  data() {
    return {
      player: null,
    };
  },
  methods: {
    onPlayerReady() {
      this.player.playVideo();
    },
    seekTo(miliseconds) {
      this.player.seekTo(miliseconds / 1000);
    },
  },
  mounted() {
    // This code creates the <iframe> and instantiates the player.
    // It also calls a function when the "onReady" event fires.
    this.player = new YT.Player('player', { // eslint-disable-line no-undef
      height: '390',
      width: '100%',
      videoId: this.videoId,
      startSeconds: 0,
      events: {
        onReady: this.onPlayerReady,
      },
    });
  },
};
</script>

<style lang="scss" scoped>
  #video {
    display: flex;
    flex: 0 0 100%;

    #player {
      display: flex;
      flex: 0 0 100%;
    }
  }
</style>
