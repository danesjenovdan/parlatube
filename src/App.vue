<template>
  <div id="parlatube">
    <parlatube-header></parlatube-header>
    <router-view></router-view>
    <parlatube-footer></parlatube-footer>
  </div>
</template>

<script>
import ParlatubeHeader from 'components/ParlatubeHeader';
import ParlatubeFooter from 'components/ParlatubeFooter';

export default {
  name: 'App',

  components: {
    ParlatubeHeader,
    ParlatubeFooter,
  },
};
</script>

<style lang="scss" scoped>
#parlatube {
  display: flex;
  flex-wrap: wrap;
  flex: 0 1 100%;
  overflow: hidden;

  .header {
    display: flex;
    flex: 0 1 100%;
  }
}
</style>
<style>
body {
  margin: 0;
}
</style>
<style lang="scss">
@import 'styles/scaffolding';
@import 'styles/fonts';
</style>