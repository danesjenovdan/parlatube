<template>
  <div id="embed">
    <div class="container">
      <parla-video :isMuted="isMuted" :disableEditing="true" :embedControls="true" :embedBackgroundImageUrl="`http://static.soocenje.24ur.com/frames/optimised/${snippetVideoId}/out${Math.floor(startTime / 5000)}.jpg`"></parla-video>
    </div>
  </div>
</template>

<script>
/* globals FB */

import ParlaVideo from 'components/ParlaVideo';
import Share from 'components/Share';
import Snippets from 'components/Snippets';
import LatestSnippets from 'components/LatestSnippets';

export default {
  name: 'Embed',

  data() {
    return {
      videoId: '',
      title: '',
      startTime: 0,
      snippetVideoId: 0,
      isMuted: false,
    };
  },

  components: {
    ParlaVideo,
    Share,
    Snippets,
    LatestSnippets,
  },

  methods: {
  },

  mounted() {
    // on mount get data from API and set up
    this.$http.get(`http://snippet.soocenje.24ur.com/getSnippet?id=${this.$route.params.snippetId}`, {
      emulateJSON: true,
    }).then((snippetSuccess) => {
      // set video to loop and set start and end times
      this.$store.commit('video/UPDATE_LOOP_START', (snippetSuccess.data.start_time / 1000));
      this.$store.commit('video/UPDATE_LOOP_END', (snippetSuccess.data.end_time / 1000));
      this.$store.commit('video/TURN_LOOPING_ON');

      // tell video where to seek to TODO refactor maybe
      this.$store.commit('video/UPDATE_SEEK_TO', (snippetSuccess.data.start_time / 1000));

      // update drawing
      const processedExtras = JSON.parse(snippetSuccess.data.extras.replace(/&#34;/g, '"').replace(/&#39;/g, '\''));
      console.log('processedExtras: ', processedExtras);
      this.$store.commit('drawing/UPDATE_STATE', processedExtras);
      this.title = snippetSuccess.data.name.replace(/&#34;/g, '"').replace(/&#39;/g, '\'');
      this.snippetVideoId = snippetSuccess.data.video_id;
      this.startTime = snippetSuccess.data.start_time;
      this.isMuted = snippetSuccess.data.muted === '1';
      this.$store.commit('video/UPDATE_IS_MUTED', this.isMuted);

      this.$http.get(`http://snippet.soocenje.24ur.com/getVideo?id=${this.snippetVideoId}`, {
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

    this.$http.get(`http://speeches.soocenje.24ur.com/analytics/collect/${this.$route.params.snippetId}`);
  },

  created() {
    this.$store.commit('editor/RESET_STATE');
    this.$store.commit('video/RESET_STATE');
    this.$store.commit('drawing/RESET_STATE');
  },
};
</script>

<style lang="scss">
.fb_iframe_widget,
.fb_iframe_widget span,
.fb_iframe_widget span iframe[style] {
  min-width: 100%;
  width: 100%;
}
</style>

<style lang="scss" scoped>
@import '../../styles/colors';

#embed {
  display: flex;
  flex: 0 0 100%;
  flex-wrap: wrap;
  overflow: hidden;
  justify-content: center;
}
</style>
