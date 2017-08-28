<template>
  <div id="parlatube">
    <div class="header">
      I AM A HEADER
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
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
