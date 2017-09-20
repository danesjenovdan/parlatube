<template>
  <div id="parlatube">
    <parlatube-header></parlatube-header>
    <router-view></router-view>
  </div>
</template>

<script>
import ParlatubeHeader from 'components/ParlatubeHeader';

export default {
  name: 'App',

  components: {
    ParlatubeHeader,
  },
};
</script>

<style lang="scss" scoped>
#parlatube {
  display: flex;
  flex-wrap: wrap;
  flex: 0 0 100%;
  overflow: hidden;

  .header {
    display: flex;
    flex: 0 0 100%;
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