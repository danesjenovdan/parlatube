<template>
  <div id="header">
    <div class="container">
      <router-link :to="{name: 'Home'}" id="logo">
        <img src="../assets/logo.svg">
        <p><strong>predsedniška</strong><br>soočenja 2017</p>
      </router-link>
      <div id="partners">
        <a target="_blank" href="http://24ur.com"><img id="pop" src="http://m.24ur.com/img/logo.png"></a>
        <div class="hover-container">
          <a target="_blank" href="http://danesjenovdan.si/"><img id="djnd" src="../assets/djnd.png"></a>
          <!-- <div class="hoverthing">
            <div class="hoverelements"></div>
          </div> -->
        </div>
      </div>
    </div>
    <div class="container" id="navbar-container">
      <div id="navbar">
        <router-link
          :to="{name: 'Collections'}"
          class="navbar-option"
        >IZSEKI</router-link>

        <router-link
          :to="{name: 'Home'}"
          class="navbar-option"
        >6. SOOČENJE</router-link>

        <router-link
          :to="{ name: 'Soocenje', params: {videoId: '6'}}"
          class="navbar-option"
        >5. SOOČENJE</router-link>
        
        <router-link
          :to="{name: 'Soocenje', params: {videoId: '5'}}"
          class="navbar-option"
        >4. SOOČENJE</router-link>
        
        <router-link
          :to="{name: 'Soocenje', params: {videoId: '4'}}"
          class="navbar-option"
        >3. SOOČENJE</router-link>
        
        <router-link
          :to="{name: 'Soocenje', params: {videoId: '3'}}"
          class="navbar-option"
        >2. SOOČENJE</router-link>
        
        <router-link
          :to="{name: 'Soocenje', params: {videoId: '1'}}"
          class="navbar-option"
        >1. SOOČENJE</router-link>
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

    @include respond-to(mobile) {
      margin-top: 2px;
      margin-left: -2px;
    }

    img {
      display: inline-block;
      width: 79px;
      height: 58px;

      @include respond-to(mobile) {
        transform: scale(0.8);
      }
    }

    p {
      font-family: 'Space Mono', monospace;
      font-size: 21px;
      line-height: 25px;
      display: inline-block;
      color: $blue;
      margin: 0 0 0 13px;

      @include respond-to(mobile) {
        display: none;
      }
    }
  }

  #partners {
    background-color: $white;
    display: block;
    position: absolute;
    height: 58px;
    top: 0;
    right: 0;

    .hover-container {
      display: inline-block;
      
      .hoverthing {
        display: none;
        position: absolute;
        bottom: -35px;
        right: 0;
        width: 100px;
        height: 35px;
        background: $white;
        border: 3px solid $gray;
      }
    }

    .hover-container:hover {
      .hoverthing {
        display: block;
      }
    }

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

  // #navbar-container {
  //   overflow-x: auto;
  // }
  #navbar {
    background-color: $white;
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    -ms-overflow-style: -ms-autohiding-scrollbar;

    width: 100%;

    height: 78px;
    margin-bottom: 44px;

    font-family: 'Space Mono', monospace;
    font-size: 26px;
    font-weight: bold;
    line-height: 78px;

    .navbar-option {
      cursor: pointer;
      color: $blue;
      text-decoration: none;
      display: block;
      position: relative;

      flex: 0 0 auto;

      margin: auto;

      padding-left: 26px;
      padding-right: 26px;

      &.active:before, &:hover:before {
        content: '';
        display: block;
        width: calc(100% - 52px);
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
