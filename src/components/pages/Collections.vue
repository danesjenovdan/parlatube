<template>
  <div id="collections">
    <h1>Uredniške zbirke</h1>
    <a
      v-for="playlist in playlists"
      class="playlist"
      :href="`http://parlatube.knedl.si/#/playlist/${playlist.id}`"
    >{{ playlist.name }}</a>
  </div>  
</template>

<script>
export default {
  name: 'Collections',

  data() {
    return {
      playlists: [],
    };
  },

  mounted() {
    this.$http.get('http://snippet.knedl.si/getPlaylists', { emulateJSON: true }).then((playlistsSuccess) => {
      console.log(playlistsSuccess);
      this.playlists = playlistsSuccess.data;
    }, () => {
      // an error occured
    });
  },
};
</script>

<style lang="scss" scoped>
#collections {
  display: flex;
  flex: 0 0 100%;
  flex-wrap: wrap;
  align-content: space-between;

  h1 {
    display: flex;
    flex: 0 0 100%;
    justify-content: center;
  }

  .playlist {
    display: flex;
    flex: 1 0 30%;
    justify-content: center;
    align-items: center;

    height: 100px;
    background: red;

    margin: 10px;

    cursor: pointer;
  }
}
</style>
