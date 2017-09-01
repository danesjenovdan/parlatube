<template>
  <div id="home">
    <div class="video-and-transcripts-container">
      <div class="video-container">
        <parla-video></parla-video>
      </div>
      <div class="transcripts-container">
        <transcripts></transcripts>
      </div>
    </div>
    <editor></editor>
    <div class="row feed-container">
      <a class="twitter-timeline" data-dnt="true" href="https://twitter.com/hashtag/soocenje" data-widget-id="900356004453519360">#soocenje Tweets</a>
    </div>
  </div>
</template>

<script>
import ParlaVideo from 'components/ParlaVideo';
import Editor from 'components/Editor';
import Transcripts from 'components/Transcripts';

export default {
  name: 'home',

  data() {
    return {
    };
  },

  components: {
    ParlaVideo,
    Editor,
    Transcripts,
  },

  created() {
    this.$store.commit('editor/RESET_STATE');
    this.$store.commit('video/RESET_STATE');
    this.$store.commit('drawing/RESET_STATE');
    this.$store.commit('video/UPDATE_VIDEOID', 'wXE4_es0cCI');
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
#home {
  display: flex;
  flex: 0 0 100%;
  flex-wrap: wrap;
  overflow: hidden;

  .video-and-transcripts-container {
    display: flex;
    flex: 0 0 100%;
    flex-wrap: nowrap;
    overflow: hidden;

    .video-container {
      display: flex;
      flex: 1 1 100%;
      overflow: hidden;
    }

    .transcripts-container {
      display: flex;
      flex: 1 1 100%;
      overflow: hidden;
    }
  }

  .feed-container {
    display: flex;
    flex: 0 0 100%;
  }
}
</style>
