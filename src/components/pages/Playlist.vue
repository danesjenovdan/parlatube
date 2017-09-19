<template>
  <div id="playlist">
    <parla-video></parla-video>
    <div class="fb-comments" data-href="http://parlatube.knedl.si/" data-numposts="20" data-width="100%"></div>
  </div>
</template>

<script>
import ParlaVideo from 'components/ParlaVideo';
import { mapState } from 'vuex';

export default {
  name: 'playlist',

  components: {
    ParlaVideo,
  },

  data() {
    return {
      snippets: [],
      currentSnippet: 0,
      videoLoaded: false,
    };
  },

  computed: {
    playlist() {
      return this.snippets.sort((a, b) => a.order - b.order);
    },

    ...mapState({
      currentTime: state => state.video.currentTime,
      videoPlaying: state => state.video.playing,
      videoId: state => state.video.videoId,
    }),
  },

  watch: {
    videoPlaying(newVideoPlaying) {
      if (newVideoPlaying) {
        // seek video to snippet
        this.$store.commit('video/UPDATE_SEEK_TO', this.playlist[this.currentSnippet].start_time / 1000);

        this.videoLoaded = true;
      }
    },

    currentTime(newCurrentTime) {
      if ((newCurrentTime > (this.playlist[this.currentSnippet].end_time / 1000)) &&
        (this.currentSnippet < (this.playlist.length - 1)) &&
        (this.videoLoaded)) {
        this.videoLoaded = false;
        this.$store.commit('video/TOGGLE_SHOULD_I_PAUSE');
        this.currentSnippet = this.currentSnippet + 1;
      } else if ((newCurrentTime > (this.playlist[this.currentSnippet].end_time / 1000)) &&
        (this.currentSnippet === (this.playlist.length - 1)) &&
        this.videoLoaded) {
        this.$store.commit('video/TOGGLE_SHOULD_I_PAUSE');
        this.videoLoaded = false;
      }
    },

    currentSnippet(newCurrentSnippet) {
      // set next snippet
      this.$http.get(`http://snippet.knedl.si/getVideo?id=${this.playlist[newCurrentSnippet].video_id}`, { emulateJSON: true }).then((videoSuccess) => {
        // set video ID (in store)
        this.$store.commit('video/UPDATE_VIDEOID', videoSuccess.data.videoid);

        // seek to place in new video
        this.$store.commit('video/UPDATE_SEEK_TO', this.playlist[this.currentSnippet].start_time / 1000);

        // tell video to play
        this.$store.commit('video/TOGGLE_SHOULD_I_PAUSE');
      }, () => {
        // an error occured with getting the video
      });
    },
  },

  mounted() {
    // on mount get data from API and set up
    this.$http.get(`http://snippet.knedl.si/getPlaylist?id=${this.$route.params.playlistId}`, { emulateJSON: true }).then((playlistSuccess) => {
      // set snippets
      this.snippets = playlistSuccess.data.snippets;

      // set first snippet
      this.$http.get(`http://snippet.knedl.si/getVideo?id=${this.playlist[this.currentSnippet].video_id}`, { emulateJSON: true }).then((videoSuccess) => {
        // set video ID (in store)
        this.$store.commit('video/UPDATE_VIDEOID', videoSuccess.data.videoid);
      }, () => {
        // an error occured with getting the video
      });
    }, () => {
      // an error occured when trying to get snippet info from server
    });
  },

  created() {
    this.$store.commit('editor/RESET_STATE');
    this.$store.commit('video/RESET_STATE');
    this.$store.commit('drawing/RESET_STATE');
  },
};
</script>

<style lang="scss" scoped>
#playlist {
  display: flex;
  flex: 0 0 100%;
  flex-wrap: wrap;
  overflow: hidden;
}
</style>

<style lang="scss">
.fb_iframe_widget,
.fb_iframe_widget span,
.fb_iframe_widget span iframe[style] {
  min-width: 100% !important;
  width: 100% !important;
}

#drawing-container {
  display: none;
}
</style>
