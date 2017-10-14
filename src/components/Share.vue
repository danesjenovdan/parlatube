<template>
  <div id="share">
    <div id="social" class="share-container">
      DELI!
      <a target="_blank" :href="`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`" class="social-button fb"></a>
      <a target="_blank" :href="`http://twitter.com/share?text=text goes here&url=${encodeURIComponent(currentUrl)}&hashtags=soocenje`" class="social-button tw"></a>
      <a target="_blank" :href="`mailto:?Subject=Ha%20ha%20ha&body=${encodeURIComponent(currentUrl)}`" class="social-button mail"></a>
    </div>
    <div id="linkshare" class="share-container">
      KOPIRAJ!
      <input class="social-input" type="url" :value="shortenedUrl">
    </div>
  </div>
</template>

<script>
export default {
  name: 'Share',

  data() {
    return {
      shortenedUrl: '',
    };
  },

  methods: {
    shortenUrl() {
      this.$http.get(`http://djnd.si/yomamasofat/?fatmama=${encodeURIComponent(this.currentUrl)}`).then((success) => {
        console.log(success);
        this.shortenedUrl = success.body;
      });
    },
  },

  computed: {
    currentUrl() {
      return document.location.href;
    },
  },

  watch: {
    currentUrl(newCurrentUrl) {
      this.shortenUrl(newCurrentUrl);
    },
  },

  mounted() {
    this.shortenUrl();
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/colors';
@import '../styles/scaffolding';

#share {
  width: 100%;
  display: flex;
  justify-content: space-between;

  @include respond-to(up-to-limbo) {
    justify-content: center;
    flex-wrap: wrap;
  }

  .share-container {
    background: $gray;
    min-height: 52px;
    display: flex;
    flex: 0 1 483px;
    flex-wrap: wrap;
    justify-content: center;

    font-family: 'Space Mono', monospace;
    font-size: 30px;
    letter-spacing: 1.8px;
    line-height: 52px;
    margin-top: 20px;
    padding-top: 20px;
    padding-bottom: 20px;
  }

  .social-button {
    display: flex;
    flex: 0 0 53px;
    background: $red;
    width: 53px;
    height: 53px;
    margin-left: 17px;
    border-radius: 50%;
    cursor: pointer;

    background-repeat: no-repeat;
    background-position: center;

    &:hover {
      background-color: $light-red;
    }

    &.fb {
      background-image: url('../assets/icons/facebook.png');
    }
    &.tw {
      background-image: url('../assets/icons/twitter.png');
    }
    &.mail {
      background-image: url('../assets/icons/mail.png');
    }
  }

  .social-input {
    height: 47px;
    line-height: 47px;
    margin-left: 27px;

    border: none;

    padding-left: 20px;
    padding-right: 20px;

    flex: 0 1 190px;
    max-width: 190px;

    font-size: 16px;
    font-family: 'Space Mono', monospace;
  }
}
</style>
