<template>
  <div id="home">
    <div class="container">
      <div class="intro">Odreži zanimiv del videa in ga deli s prijatelji!</div>
      <div class="video-and-transcripts-container">
        <div class="video-container">
          <parla-video :showDrawing="editing" :showControls="!editing"></parla-video>
        </div>
        <div class="transcripts-container">
          <transcripts></transcripts>
        </div>
      </div>
      <button @click="editing = true" v-if="!editing">odpri</button>
      <editor v-if="editing" v-on:disableEditing="editing = false"></editor>
      <div class="row feed-container">
        <a class="twitter-timeline" data-dnt="true" href="https://twitter.com/hashtag/soocenje" data-widget-id="910050625081286656" data-width="100%" data-height="802">#soocenje Tweets</a>
      </div>
    </div>
  </div>
</template>

<script>
/* globals twttr */
import isMobile from 'ismobilejs';
import ParlaVideo from 'components/ParlaVideo';
import Editor from 'components/Editor';
import Transcripts from 'components/Transcripts';

export default {
  name: 'Home',

  data() {
    return {
      editing: false,
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
    this.$store.commit('video/UPDATE_VIDEOID', 'wXE4_es0cCI');// -CLenqwC-Qw wXE4_es0cCI
  },

//   konami
// console error
// css spravi kvadrat v kvadrat v treh vrsticah
// cookie
// link do google forme

  mounted() {
    // Twitter embed thing
    twttr.widgets.load(this.$el);

    console.log(isMobile.any);
    if (isMobile.any) {
      this.editing = false;
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../../styles/colors';
@import '../../styles/scaffolding';

#home {
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

  .intro {
    display: flex;
    justify-content: center;

    width: 100%;

    font-family: 'Poppins', sans-serif;
    font-size: 30px;
    line-height: 26px;

    text-align: center;

    margin-bottom: 35px;

    &:before,
    &:after {
      display: block;
      content: '';
      width: 43px;
      height: 26px;

      margin-left: 12px;
      margin-right: 12px;

      background-image: url('../../assets/icons/cut.svg');
      background-position: center;
      background-repeat: no-repeat;
      transform: scale(-1, 1);
    }
    &:after {
      transform: scale(1, 1);
    }
  }

  .video-and-transcripts-container {
    display: flex;
    flex: 1 0 100%;
    flex-wrap: nowrap;
    overflow: hidden;
    max-height: 371px;

    .video-container {
      display: flex;
      flex: 1 1 100%;
      overflow: hidden;
    }

    .transcripts-container {
      display: flex;
      flex: 1 2 100%;
      overflow: hidden;
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
#twitter-widget-0 {
  width:100%;
}
</style>
