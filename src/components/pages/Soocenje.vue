<template>
  <div id="home">
    <div class="container">
      <div class="video-and-transcripts-container">
        <div class="video-container">
          <parla-video :showDrawing="editing" :showControls="!editing"></parla-video>
        </div>
        <div class="transcripts-container" v-if="$route.params.videoId === '1'">
          <transcripts></transcripts>
        </div>
      </div>
      <div
        v-if="(!editing && !isMobile)"
        class="conversion"
      >Odreži zanimiv del videa in ga deli s prijatelji!</div>
      <div
        v-if="(!editing && !isMobile)"
        @click="editing = true"
        class="conversion-button"
      ><span class="cutme"></span>PRIPRAVI IZSEK</div>
      <editor
        v-if="editing"
        v-on:disableEditing="disableEditing"
        :live="live"
        :videoId="parseInt($route.params.videoId, 10)"
      ></editor>
    </div>
    <div class="snippets-container">
      <snippets :number-of-snippets="6"></snippets>
    </div>
    <div class="snippets-container white">
      <latest-snippets :number-of-snippets="6"></latest-snippets>
    </div>
    <div class="container">
      <div class="row feed-container">
        <a class="twitter-timeline" data-dnt="true" href="https://twitter.com/hashtag/volitve" data-widget-id="919190509414993921" data-width="100%" data-height="802">#volitve</a>
      </div>
    </div>
  </div>
</template>

<script>
/* globals twttr */
import isMobile from 'ismobilejs';
import ParlaVideo from 'components/ParlaVideo';
import Editor from 'components/Editor';
import Snippets from 'components/Snippets';
import LatestSnippets from 'components/LatestSnippets';
import Transcripts from 'components/Transcripts';

export default {
  name: 'Home',

  data() {
    return {
      editing: false,
      live: false,
      isMobile: false,
    };
  },

  components: {
    ParlaVideo,
    Editor,
    Snippets,
    LatestSnippets,
    Transcripts,
  },

  methods: {
    disableEditing() {
      this.editing = false;
      this.$store.commit('video/TURN_LOOPING_OFF');
      if (this.live) {
        this.$store.commit('video/UPDATE_SEEK_TO', this.$store.state.video.duration);
      }
    },
  },

  created() {
    this.$store.commit('editor/RESET_STATE');
    this.$store.commit('video/RESET_STATE');
    this.$store.commit('drawing/RESET_STATE');
    this.$http.get(`http://snippet.soocenje.24ur.com/getVideo?id=${this.$route.params.videoId}`, {
      emulateJSON: true,
    }).then((videoSuccess) => {
      this.$store.commit('video/UPDATE_VIDEOID', videoSuccess.data.videoid);
    });

    if (this.$route.params.editing) {
      this.editing = this.$route.params.editing;
    }
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
      this.isMobile = true;
      this.editing = false;
    }

    this.$store.commit('video/UPDATE_IS_MUTED', false);
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
  background: -moz-linear-gradient(top, #eaeaea 0, #eaeaea 150px, #ffffff 150px, #ffffff 100%); /* FF3.6-15 */
  background: -webkit-linear-gradient(top, #eaeaea 0,#eaeaea 150px,#ffffff 150px,#ffffff 100%); /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(to bottom, #eaeaea 0,#eaeaea 150px,#ffffff 150px,#ffffff 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#eaeaea', endColorstr='#ffffff',GradientType=0 ); /* IE6-9 */

  // .intro {
  //   display: flex;
  //   justify-content: center;

  //   width: 100%;

  //   font-family: 'Poppins', sans-serif;
  //   font-size: 30px;
  //   line-height: 26px;

  //   text-align: center;

  //   margin-bottom: 35px;

  //   &:before,
  //   &:after {
  //     display: block;
  //     content: '';
  //     width: 43px;
  //     height: 26px;

  //     margin-left: 12px;
  //     margin-right: 12px;

  //     background-image: url('../../assets/icons/cut.svg');
  //     background-position: center;
  //     background-repeat: no-repeat;
  //     transform: scale(-1, 1);
  //   }
  //   &:after {
  //     transform: scale(1, 1);
  //   }
  // }

  .video-and-transcripts-container {
    overflow: hidden;
    display: flex;
    flex-wrap: nowrap;

    @include respond-to(mobile) {
      flex-wrap: wrap;
    }

    .video-container {
      overflow: hidden;
      flex: 1 1 100%;
    }

    .transcripts-container {
      display: flex;
      flex: 1 2 100%;
      overflow: hidden;

      // @include respond-to(mobile) {
      //   height: 300px;
      // }
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

    margin-top: 35px;
    margin-bottom: 30px;
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
    // display: flex;
    // flex: 0 0 538px;
    width: 100%;
    max-width: 538px;
    position: relative;
    margin: auto;
    margin-top: 84px;
  }

  .snippets-container {
    margin-top: 60px;
    background: $gray;
    padding: 20px;
    width: 100%;

    &.white {
      background: $white;
    }
  }
}
</style>

<style lang="scss">
#twitter-widget-0 {
  width:100%;
}
</style>
