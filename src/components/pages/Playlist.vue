<template>
  <div id="playlist">
    <div class="container">
      <div class="video-and-playlist-container">
        <div class="video-container">
          <parla-video :disableEditing="true"></parla-video>
        </div>
        <div class="playlist-container">
          <div class="buffer">
            <div
              :class="['playlist-item', {current: playlist.indexOf(snippet) === currentSnippet}]"
              v-for="snippet in playlist"
              @click="updateSnippet(playlist.indexOf(snippet))"
            >
              <div class="snippet-title">{{ snippet.title || 'Brez naslova' }}</div>
              <a class="snippet-outlink" target="_blank" :href="`http://soocenje.24ur.com/#/snippet/${snippet.id}`"></a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <share></share>
      <div class="conversion">Odreži zanimiv del videa in ga deli s prijatelji!</div>
      <router-link
        :to="{ name: 'Soocenje', params: { 'videoId': 3, 'editing': true }}"
        class="conversion-button"
      ><span class="cutme"></span>PRIPRAVI IZSEK</router-link>
    </div>
    <div class="feed-container">
      <div class="fb-comments" :data-href="`http://soocenje.24ur.com/playlist/${$route.params.playlistId}`" data-numposts="20" data-width="100%"></div>
    </div>
  </div>
</template>

<script>
import ParlaVideo from 'components/ParlaVideo';
import { mapState } from 'vuex';

export default {
  name: 'Playlist',

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
      this.$http.get(`http://snippet.soocenje.24ur.com/getVideo?id=${this.playlist[newCurrentSnippet].video_id}`, { emulateJSON: true }).then((videoSuccess) => {
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
    this.$http.get(`http://snippet.soocenje.24ur.com/getPlaylist?id=${this.$route.params.playlistId}`, { emulateJSON: true }).then((playlistSuccess) => {
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
      this.$http.get(`http://snippet.soocenje.24ur.com/getVideo?id=${this.playlist[this.currentSnippet].video_id}`, { emulateJSON: true }).then((videoSuccess) => {
        // set video ID (in store)
        this.$store.commit('video/UPDATE_VIDEOID', videoSuccess.data.videoid);
      }, () => {
        // an error occured with getting the video
      });
    }, () => {
      // an error occured when trying to get snippet info from server
    });

    dataLayer.push({
      'event': 'pageview',
      'page': {
        'path': this.$route.path,
        'title': 'Playlist'
      }
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
@import '../../styles/colors';
@import '../../styles/scroller';

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
      flex: 2 1 100%;
      overflow: hidden;
    }

    .playlist-container {
      display: flex;
      flex: 1 2 100%;
      overflow: hidden;
      flex-wrap: wrap;
      // overflow-y: auto;
      align-content: flex-start; 
      background-color: $gray;
      padding: 5px 0 5px 0;
      border-left: none;
      max-height: 356px;

      .buffer {
        width: 100%;
        overflow-y: auto;
        @extend %scroller;
        border-right: 5px solid $gray;
      }

      .playlist-item {
        display: flex;
        flex: 1 1 100%;
        justify-content: space-between;
        position: relative;

        background: $white;

        height: 30px;
        line-height: 30px;

        cursor: pointer;

        padding: 5px 10px 5px 48px;

        font-family: 'Space Mono', monospace;
        font-weight: 400;

        &.current, {
          background: #F5DFDF;
          font-weight: 700;
        }

        &:hover {
          background: #FCF4F4;
        }

        .snippet-outlink {
          &::before {
            content: '';
            display: block;
            width: 30px;
            height: 30px;
            background-image: url('../../assets/icons/play-snippet.svg');
            position: absolute;
            top: 5px;
            left: 10px;
          }
          &::after {
            content: '';
            width: 30px;
            height: 30px;
            background-image: url('../../assets/icons/link.svg');
            display: block;
          }
        }

        &.current .snippet-outlink::after,
        &:hover .snippet-outlink::after  {
          background-image: url('../../assets/icons/link-hover.svg');
        }
      }
    }
  }

  .conversion {
    display: flex;
    justify-content: center;

    width: 100%;

    font-family: 'Poppins', sans-serif;
    font-size: 30px;
    line-height: 26px;

    text-align: center;

    margin-top: 76px;
    margin-bottom: 35px;
    font-weight: 300;

    // &:before,
    // &:after {
    //   display: block;
    //   content: '';
    //   width: 43px;
    //   height: 26px;

    //   margin-left: 12px;
    //   margin-right: 12px;

    //   background-image: url('../../assets/icons/cut.svg');
    //   background-position: center;
    //   background-repeat: no-repeat;
    //   transform: scale(-1, 1);
    // }
    // &:after {
    //   transform: scale(1, 1);
    // }
  }
  .conversion-button {
    width: 298px;
    height: 68px;
    border: 4px solid $red;
    color: $red;
    font-family: 'Space Mono', monospace;
    font-weight: 700;
    letter-spacing: 1.2px;
    text-align: center;
    font-size: 20px;
    line-height: 68px;
    position: relative;
    margin: auto;
    cursor: pointer;

    transition: all 0.2s ease-out;
    display: block;
    text-decoration: none;

    .cutme {
      background-image: url('../../assets/icons/cut-red.svg');
      background-position: center;
      background-repeat: no-repeat;
      width: 54px;
      height: 32px;
      display: inline-block;
      top: 9px;
      position: relative;
      transform: scale(-1, 1);
      margin-right: 17px;
      filter: color($red);
    }

    &:hover {
      background-color: $red;
      color: $white;

      .cutme {
        background-image: url('../../assets/icons/cut-white.svg');
      }
    }
  }

  .feed-container {
    display: flex;
    flex: 0 0 738px;
    position: relative;
    margin: auto;
    margin-top: 84px;
  }
}
</style>

<style lang="scss">
.fb_iframe_widget,
.fb_iframe_widget span,
.fb_iframe_widget span iframe[style] {
  min-width: 100%;
  width: 100%;
}

/* TODO */
// #drawing-container {
//   display: none;
// }
</style>
