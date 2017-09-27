<template>
  <div id="snippet">
    <div class="container">
      <parla-video height="552" :disableEditing="true"></parla-video>
    </div>
    <div class="feed-container">
      <div class="fb-comments" data-href="http://parlatube.knedl.si/" data-numposts="20" data-width="100%"></div>
    </div>
  </div>
</template>

<script>
/* globals FB */

import ParlaVideo from 'components/ParlaVideo';

export default {
  name: 'Snippet',
  data() {
    return {
      videoId: '',
    };
  },

  components: {
    ParlaVideo,
  },

  methods: {
  },

  mounted() {
    // on mount get data from API and set up
    this.$http.get(`http://snippet.knedl.si/getSnippet?id=${this.$route.params.snippetId}`, {
      emulateJSON: true,
    }).then((snippetSuccess) => {
      // set video to loop and set start and end times
      this.$store.commit('video/UPDATE_LOOP_START', (snippetSuccess.data.start_time / 1000));
      this.$store.commit('video/UPDATE_LOOP_END', (snippetSuccess.data.end_time / 1000));
      this.$store.commit('video/TURN_LOOPING_ON');

      // tell video where to seek to TODO refactor maybe
      this.$store.commit('video/UPDATE_SEEK_TO', (snippetSuccess.data.start_time / 1000));

      // update drawing
      const processedExtras = JSON.parse(snippetSuccess.data.extras.replace(/&#34;/g, '"'));
      this.$store.commit('drawing/UPDATE_STATE', processedExtras);

      this.$http.get(`http://snippet.knedl.si/getVideo?id=${snippetSuccess.data.video_id}`, {
        emulateJSON: true,
      }).then((videoSuccess) => {
        // set video ID (locally and in store)
        this.videoId = videoSuccess.data.videoid;
        this.$store.commit('video/UPDATE_VIDEOID', this.videoId);
      }, () => {
        // an error occured when trying to get video info from server
      });
    }, () => {
      // an error occured when trying to get snippet info from server
    });

    if (FB) {
      FB.XFBML.parse(this.$el);
    }
  },

  created() {
    this.$store.commit('editor/RESET_STATE');
    this.$store.commit('video/RESET_STATE');
    this.$store.commit('drawing/RESET_STATE');
  },
};
</script>

<style lang="scss" scoped>
#snippet {
  display: flex;
  flex: 0 0 100%;
  flex-wrap: wrap;
  overflow: hidden;
  justify-content: center;

  /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#eaeaea+0,eaeaea+50,ffffff+51,ffffff+100 */
  background: #eaeaea; /* Old browsers */
  background: -moz-linear-gradient(top, #eaeaea 0%, #eaeaea 17%, #ffffff 17%, #ffffff 100%); /* FF3.6-15 */
  background: -webkit-linear-gradient(top, #eaeaea 0%,#eaeaea 17%,#ffffff 17%,#ffffff 100%); /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(to bottom, #eaeaea 0%,#eaeaea 17%,#ffffff 17%,#ffffff 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#eaeaea', endColorstr='#ffffff',GradientType=0 ); /* IE6-9 */

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
  min-width: 100% !important;
  width: 100% !important;
}
</style>
