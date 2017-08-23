<template>
  <div id="home">
    <parla-video 
    ></parla-video>
  </div>
</template>

<script>
import ParlaVideo from './ParlaVideo';
import store from '../store';

export default {
  name: 'home',
  data() {
    return {
    };
  },
  components: {
    'parla-video': ParlaVideo,
    store,
  },
  mounted() {
    console.log(store.state.editor.videoId);
    store.commit('video/UPDATE_VIDEOID', 'wXE4_es0cCI');
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
#home {
  display: flex;
  flex: 0 0 100%;
}
</style>
