<template>
  <div id="cookies" v-if="!cookiesSet">
    <div class="container">
      <span>Z uporabo tega spletnega mesta sprejemaš piškotke.</span>
      <span class="cookie-button" @click="acceptCookies">V REDU</span>
      <a target="_blank" href="http://www.24ur.com/static/slo/shared/registration2/cookie-static/index.html" class="cookie-button info">INFO</a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Cookies',

  data() {
    return {
      cookiesSet: false,
    };
  },

  methods: {
    acceptCookies() {
      this.$cookies.set('soocenjeCookie', true, '100d');
      this.cookiesSet = true;
      console.log(this.$cookies.get('soocenjeCookie'));
    },
  },

  mounted() {
    if (this.$cookies.get('soocenjeCookie')) {
      this.cookiesSet = true;
    }
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/colors';
@import '../styles/scaffolding';

#cookies {
  background: $gray;
  width: 100%;
  font-size: 16px;
  line-height: 40px;
  font-family: 'Sans Mono', monospace;
  text-align: center;
  padding-bottom: 44px;

  .container {
    background: $white;
  }

  .cookie-button {
    padding-left: 6px;
    padding-right: 6px;
    padding-top: 2px;
    padding-bottom: 2px;
    background-color: $red;
    color: $white;
    cursor: pointer;
    text-decoration: none;

    &:hover {
      background: $light-red;
    }

    &.info {
      background-color: $blue;

      &:hover {
        background: $light-blue;
      }
    }
  }
}
</style>
