<template>
  <div id="playlist">
    <div class="video-and-playlist-container">
      <div class="video-container">
        <parla-video></parla-video>
      </div>
      <div class="playlist-container">
        <div
          :class="['playlist-item', {current: playlist.indexOf(snippet) === currentSnippet}]"
          v-for="snippet in playlist"
          @click="updateSnippet(playlist.indexOf(snippet))"
        >
          <div class="snippet-title">{{ snippet.title || 'Brez naslova' }}</div>
          <a class="snippet-outlink" target="_blank" :href="`http://parlatube.knedl.si/#/snippet/${snippet.id}`">Link</a>
        </div>
      </div>
    </div>
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
        this.$store.commit('video/PAUSE_VIDEO');
        this.currentSnippet = this.currentSnippet + 1;
      } else if ((newCurrentTime > (this.playlist[this.currentSnippet].end_time / 1000)) &&
        (this.currentSnippet === (this.playlist.length - 1)) &&
        this.videoLoaded) {
        this.$store.commit('video/PAUSE_VIDEO');
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
        this.$store.commit('video/PLAY_VIDEO');

        // update drawing
        if (this.playlist[this.currentSnippet].extras.length > 0) {
          const processedExtras = JSON.parse(this.playlist[this.currentSnippet].extras.replace(/&#34;/g, '"'));
          this.$store.commit('drawing/UPDATE_STATE', processedExtras);
        } else {
          this.$store.commit('drawing/UPDATE_STATE', {});
        }
      }, () => {
        // an error occured with getting the video
      });
    },
  },

  methods: {
    updateSnippet(snippetIndex) {
      this.videoLoaded = false;
      this.$store.commit('video/PAUSE_VIDEO');
      this.currentSnippet = snippetIndex;
    },
  },

  mounted() {
    // on mount get data from API and set up
    this.$http.get(`http://snippet.knedl.si/getPlaylist?id=${this.$route.params.playlistId}`, { emulateJSON: true }).then((playlistSuccess) => {
      // set snippets
      this.snippets = playlistSuccess.data.snippets;

      // update drawing
      if (this.playlist[this.currentSnippet].extras.length > 0) {
        const processedExtras = JSON.parse(this.playlist[this.currentSnippet].extras.replace(/&#34;/g, '"'));
        this.$store.commit('drawing/UPDATE_STATE', processedExtras);
      } else {
        this.$store.commit('drawing/UPDATE_STATE', {});
      }

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

  .video-and-playlist-container {
    display: flex;
    flex: 0 0 100%;
    flex-wrap: nowrap;
    overflow: hidden;

    .video-container {
      display: flex;
      flex: 1 1 100%;
      overflow: hidden;
    }

    .playlist-container {
      display: flex;
      flex: 1 1 100%;
      overflow: hidden;
      flex-wrap: wrap;
      overflow-y: auto;
      align-content: flex-start; 

      .playlist-item {
        display: flex;
        flex: 1 1 100%;
        justify-content: space-between;

        height: 30px;
        line-height: 30px;

        cursor: pointer;

        border-bottom: 1px solid #000000;

        padding: 0 10px 0 10px;

        &.current {
          background: rgba(0, 0, 0, 0.2);
        }

        &:hover {
          background: rgba(0, 0, 0, 0.3);
        }
      }
    }
  }
}
</style>

<style lang="scss">
.fb_iframe_widget,
.fb_iframe_widget span,
.fb_iframe_widget span iframe[style] {
  min-width: 100% !important;
  width: 100% !important;
}

/* TODO */
// #drawing-container {
//   display: none;
// }
</style>
