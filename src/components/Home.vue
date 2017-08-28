<template>
  <div id="home">
    <parla-video></parla-video>
    <editor></editor>
    <div class="row feed-container">
      <a class="twitter-timeline" data-dnt="true" href="https://twitter.com/hashtag/soocenje" data-widget-id="900356004453519360">#soocenje Tweets</a>
    </div>
  </div>
</template>

<script>
import ParlaVideo from './ParlaVideo';
import Editor from './Editor';

export default {
  name: 'home',
  data() {
    return {
    };
  },
  components: {
    'parla-video': ParlaVideo,
    editor: Editor,
  },
  mounted() {
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

  .feed-container {
    display: flex;
    flex: 0 0 100%;
  }
}
</style>
