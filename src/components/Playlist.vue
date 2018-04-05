<template>
  <div class="container">
    <h1 v-if="Object.keys(playlists).length > 0">Uredniške zbirke</h1>
    <div
      class="playlists"
      v-if="Object.keys(playlists).length > 0"
    >
      <a
        v-for="playlist in playlists"
        class="playlist"
        :href="`http://localhost:8080/playlist/${playlist.id}`"
      >
        <div
          class="playlist-img"
          :style="{'background-image': playlist.image_url}"
        ></div>
        <div class="playlist-title">{{ playlist.name }}</div>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Playlist',

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

<style>

</style>
