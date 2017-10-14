<template>
  <div class="container">
    <div id="footer">
      <a href="https://www.emojione.com/" target="_blank">Hvala Emojione za emojije!</a>
      <div class="fb-page" data-href="https://www.facebook.com/24urcom" data-width="242" data-small-header="true" data-adapt-container-width="true" data-hide-cover="true" data-show-facepile="false"><blockquote cite="https://www.facebook.com/24urcom" class="fb-xfbml-parse-ignore"><a href="https://www.facebook.com/24urcom">24ur.com</a></blockquote></div>
      <div class="fb-page" data-href="https://www.facebook.com/danesjenovdan/" data-width="241" data-small-header="true" data-adapt-container-width="false" data-hide-cover="true" data-show-facepile="false"><blockquote cite="https://www.facebook.com/danesjenovdan/" class="fb-xfbml-parse-ignore"><a href="https://www.facebook.com/danesjenovdan/">Danes je nov dan</a></blockquote></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ParlatubeFooter',
};
</script>

<style lang="scss" scoped>
@import '../styles/scaffolding';
@import '../styles/colors';

#footer {
  margin-top: 30px;
  margin-bottom: 20px;
  border-top: 1px solid $dark-gray;
  padding-top: 15px;

  a {
    color: $dark-gray;
    text-decoration: none;
    font-family: 'Space Mono', monospace;
    font-size: 14px;
    line-height: 70px;
  }

  .fb-page {
    float: right;
    margin-left: 20px;
    margin-bottom: 20px;
  }
}
</style>
