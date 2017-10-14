<template>
  <div id="header">
    <div class="container">
      <router-link :to="{name: 'Home'}" id="logo">
        <img src="../assets/logo.svg">
        <p><strong>predsedniška</strong><br>soočenja 2017</p>
      </router-link>
      <div id="partners">
        <a target="_blank" href="http://24ur.com"><img id="pop" src="http://m.24ur.com/img/logo.png"></a>
        <a target="_blank" href="http://danesjenovdan.si/"><img id="djnd" src="../assets/djnd.png"></a>
      </div>
    </div>
    <div class="container">
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
  </div>
</template>

<script>
export default {
  name: 'ParlatubeHeader',
};
</script>

<style lang="scss">
@import '../styles/colors';
@import '../styles/scaffolding';

#header {
  // display: flex;
  // flex: 0 0 100%;
  // flex-wrap: wrap;
  width: 100%;
  background-color: $gray;
  justify-content: center;

  #logo {
    background-color: $gray;
    display: flex;
    flex: 1 1 100%;
    margin-top: 33px;
    margin-bottom: 29px;
    text-decoration: none;

    cursor: pointer;

    img {
      display: inline-block;
      width: 79px;
      height: 58px;
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

    #pop {
      width: 55px;
      height: 27px;
    }

    #djnd {
      width: 71.5px;
      height: 27px;
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
