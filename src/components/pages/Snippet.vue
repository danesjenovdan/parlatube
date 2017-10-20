<template>
  <div id="snippet">
    <div class="container">
      <h1>{{ title }}</h1>
    </div>
    <div class="container">
      <parla-video :disableEditing="true" :isMuted="isMuted"></parla-video>
    </div>
    <div class="container overflowy">
      <router-link :to="{name: 'Snippet', params: {snippetId: `${parseInt($route.params.snippetId, 10) - 1}`}, meta: { scrollTop: 200 }}" class="arrow left"></router-link>
      <router-link :to="{name: 'Snippet', params: {snippetId: `${parseInt($route.params.snippetId, 10) + 1}`}, meta: { scrollTop: 200 }}" class="arrow right"></router-link>
    </div>
    <div class="container">
      <share></share>
      <div
        v-if="!localIsMobile"
        class="conversion"
      >Odreži zanimiv del videa in ga deli s prijatelji!</div>
      <router-link
        v-if="!localIsMobile"
        :to="{ name: 'Soocenje', params: { 'videoId': 3, 'editing': true }}"
        class="conversion-button"
      ><span class="cutme"></span>PRIPRAVI IZSEK</router-link>
    </div>
    <div class="feed-container">
      <div class="fb-comments" :data-href="`http://soocenje.24ur.com/playlist/${$route.params.snippetId}`" data-numposts="20" data-width="100%"></div>
    </div>
    <div class="snippets-container">
      <snippets :number-of-snippets="6" :background-color="'#eaeaea'"></snippets>
    </div>
    <div class="snippets-container white">
      <latest-snippets :number-of-snippets="6"></latest-snippets>
    </div>
  </div>
</template>

<script>
/* globals FB */

import isMobile from 'ismobilejs';
import ParlaVideo from 'components/ParlaVideo';
import Share from 'components/Share';
import Snippets from 'components/Snippets';
import LatestSnippets from 'components/LatestSnippets';

export default {
  name: 'Snippet',
  data() {
    return {
      videoId: '',
      title: '',
      localIsMobile: false,
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
    if (isMobile.any) {
      this.localIsMobile = true;
    }

    // on mount get data from API and set up
    this.$http.get(`http://snippet.soocenje.24ur.com/getSnippet?id=${this.$route.params.snippetId}`, {
      emulateJSON: true,
    }).then((snippetSuccess) => {
      console.log(snippetSuccess.data.id);
      if (snippetSuccess.data.id === 0) {
        this.$router.push({ name: 'Collections' });
      } else {
        // set video to loop and set start and end times
        this.$store.commit('video/UPDATE_LOOP_START', (snippetSuccess.data.start_time / 1000));
        this.$store.commit('video/UPDATE_LOOP_END', (snippetSuccess.data.end_time / 1000));
        this.$store.commit('video/TURN_LOOPING_ON');

        // tell video where to seek to TODO refactor maybe
        this.$store.commit('video/UPDATE_SEEK_TO', (snippetSuccess.data.start_time / 1000));

        // update drawing
        const processedExtras = JSON.parse(snippetSuccess.data.extras.replace(/&#34;/g, '"').replace(/&#39;/g, '\''));
        console.log('processedExtras: ', processedExtras);
        console.log(snippetSuccess.data);
        this.$store.commit('drawing/UPDATE_STATE', processedExtras);
        this.title = snippetSuccess.data.name.replace(/&#34;/g, '"').replace(/&#39;/g, '\'');
        this.isMuted = snippetSuccess.data.muted === '1';
        this.$store.commit('video/UPDATE_IS_MUTED', this.isMuted);

        this.$http.get(`http://snippet.soocenje.24ur.com/getVideo?id=${snippetSuccess.data.video_id}`, {
          emulateJSON: true,
        }).then((videoSuccess) => {
          // set video ID (locally and in store)
          this.videoId = videoSuccess.data.videoid;
          this.$store.commit('video/UPDATE_VIDEOID', this.videoId);
        }, () => {
          // an error occured when trying to get video info from server
        });
      }
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
@import '../../styles/scaffolding';

.overflowy {
  overflow: visible;
  position: relative;

  .arrow {
    width: 105px;
    height: 77px;
    position: absolute;
    top: -300px;
    left: -100px;
    z-index: 5;
    cursor: pointer;
    transition: transform 0.2s ease-out;
    display: block;

    background-image: url('../../assets/puscica.png');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    transform: scale(0.6);

    &:hover {
      transform: scale(0.7);
    }

    &.right {
      right: -100px;
      left: auto;
      transform: scale(-0.6);

      &:hover {
        transform: scale(-0.7);
      }
    }
  }
  @include respond-to(mobile-arrows) {
    overflow: hidden;
    height: 80px;
    margin-bottom: -20px;

    .arrow {
      position: absolute;
      top: 0;
      left: 0;

      &.right {
        right: 0;
      }
    }
  }
}

#snippet {
  display: block;
  width: 100%;
  overflow: hidden;
  justify-content: center;
  position: relative;

  /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#eaeaea+0,eaeaea+50,ffffff+51,ffffff+100 */
  background: #eaeaea; /* Old browsers */
  background: -moz-linear-gradient(top, #eaeaea 0, #eaeaea 150px, #ffffff 150px, #ffffff 100%); /* FF3.6-15 */
  background: -webkit-linear-gradient(top, #eaeaea 0,#eaeaea 150px,#ffffff 150px,#ffffff 100%); /* Chrome10-25,Safari5.1-6 */
  background: linear-gradient(to bottom, #eaeaea 0,#eaeaea 150px,#ffffff 150px,#ffffff 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
  filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#eaeaea', endColorstr='#ffffff',GradientType=0 ); /* IE6-9 */

  h1 {
    color: $black;
    font-size: 30px;
    font-family: 'Space Mono', monospace;
    font-weight: 900;
    text-decoration: none;
    text-align: center;
    margin: 0;
    margin-bottom: 20px;
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
