<template>
  <div id="header">
    <div class="container">
      <div id="logo">
        <img src="../assets/logo.png">
        <p><strong>predsedniška</strong><br>soočenja 2017</p>
      </div>
      <div id="partners">
        <img src="../assets/24ur.png">
        <img src="../assets/djnd.png">
      </div>
    </div>
    <div id="navbar">
      <router-link
        :to="{name: 'Home'}"
        class="navbar-option"
      >SOOČENJE</router-link>
      <router-link
        :to="{name: 'Collections'}"
        class="navbar-option"
      >IZSEKI</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ParlatubeHeader',
};
</script>

<style lang="scss">
@import '../styles/colors';

#header {
  display: flex;
  flex: 0 0 100%;
  flex-wrap: wrap;
  background-color: $gray;
  justify-content: center;

  #logo {
    background-color: $gray;
    display: flex;
    flex: 1 1 100%;
    margin-top: 33px;
    margin-bottom: 29px;

    cursor: pointer;

    img {
      display: inline-block;
    }

    p {
      font-family: 'Space Mono', monospace;
      font-size: 21px;
      line-height: 25px;
      display: inline-block;
      color: $blue;
      margin: 0 0 0 13px;
    }
  }

  #partners {
    background-color: $white;
    display: block;
    position: absolute;
    height: 58px;
    top: 0;
    right: 0;

    img {
      margin: 16px;
      display: inline-block;
    }
  }

  #navbar {
    background-color: $white;
    display: flex;
    flex: 0 1 981px;
    flex-wrap: wrap;
    justify-content: space-around;

    height: 78px;
    margin-bottom: 44px;

    font-family: 'Space Mono', monospace;
    font-size: 26px;
    font-weight: bold;
    line-height: 78px;

    .navbar-option {
      position: relative;
      cursor: pointer;
      color: $blue;
      text-decoration: none;

      &.active:before, &:hover:before {
        content: '';
        display: block;
        width: 100%;
        height: 16px;
        position: absolute;
        margin: auto;
        bottom: 21px;
        left: 0;
        right: 0;
        background-color: $red;
        opacity: 0.4;
      }
    }
  }
}
</style>
