<template>
  <div id="collections">
    <all-snippets :number-of-snippets="500"></all-snippets>
  </div>  
</template>

<script>
/* global dataLayer */

import AllSnippets from 'components/AllSnippets';

export default {
  name: 'Collections',

  components: {
    AllSnippets,
  },

  mounted() {
    dataLayer.push({
      event: 'pageview',
      page: {
        path: this.$route.path,
        title: 'Collections',
      },
    });
  },
};
</script>

<style lang="scss" scoped>
@import '../../styles/colors';
@import '../../styles/scaffolding';

#collections {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 10px;
  padding-bottom: 0;
  width: 100%;
  background-color: $gray;

  .snippets-container-container {
    background-color: $white;
    width: calc(100% + 20px);
    margin-left: -10px;
    margin-right: -10px;
    position: relative;

    &.empty {
      background-color: $gray;
    }
  }

  h1 {
    display: block;
    width: 100%;
    text-align: center;
    width: 100%;
    font-family: 'Poppins', sans-serif;
    font-size: 30px;
    font-weight: 700;
  }

  .playlists,
  .snippets {
    display: block;
    width: 100%;
    margin: auto;
    position: relative;
    &.empty {
      background-color: $gray;
    }
  }
  .snippets {
    background-color: #ffffff;
  }
  .snippets-empty {
    background-image: url('../../assets/brez-izsekov.png');
    background-size: contain;
    display: block;
    position: relative;
    margin: auto;
    width: 358px;
    height: 134px;
    margin-top: 50px;
    margin-bottom: 50px;
  }
  .playlist,
  .snippet {
    display: block;
    cursor: pointer;

    max-width: 310px;
    height: 222px;

    position: relative;
    
    float: left;
    margin-right: 25px;

    text-decoration: none;

    margin-bottom: 52px;

    &:nth-child(3n) {
      margin-right: 0;
    }

    @include respond-to(parlatube-limbo) {
      &:nth-child(3n) {
        margin-right: 25px;
      }
      &:nth-child(2n) {
        margin-right: 0;
      }
      left: calc(50% - 322.5px);
    }

    @include respond-to(mobile) {
      margin: auto;
      margin-bottom: 52px;
      float: none;
      height: auto;

      &:nth-child(3n) {
        margin-right: auto;
      }
    }

    .playlist-img,
    .snippet-img {
      background: $blue;
      max-width: 310px;
      height: 174px;
      position: relative;

      background-size: cover;
      background-position: 0 0;
      background-repeat: no-repeat;

      @include respond-to(desktop) {
        width: 310px;
      }

      &::after {
        content: '';
        display: block;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-color: rgba(188, 42, 42, 0.7);
        opacity: 0;
        background-image: url('../../assets/icons/play-snippet.svg');
        background-position: center;
        background-repeat: no-repeat;
        background-size: 59px 59px;
        transition: all 0.2s ease-out;
      }
    }

    .playlist-title,
    .snippet-title {
      color: $black;
      font-size: 16px;
      font-family: 'Space Mono', monospace;
      font-weight: 700;
      text-decoration: none;
    }

    &:hover .playlist-img::after,
    &:hover .snippet-img::after {
      opacity: 0.7;
    }
  }
}
</style>
