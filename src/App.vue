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
  width: 100%;
  flex-wrap: wrap;

  .header {
    display: flex;
    flex: 0 0 100%;
  }
}
</style>
