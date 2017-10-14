<template>
  <div id="collections">
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
    <div :class="['snippets-container-container', {empty: (snippets.length === 0)}]">
      <div class="container">
        <h1>Najbolj gledani izseki</h1>
        <div :class="['snippets', {empty: (snippets.length === 0)}]">
          <router-link
            :to="{name: 'Home', params: {editing: true}}"
            class="snippets-empty"
            v-if="snippets.length === 0"
          ></router-link>
          <a
            v-for="snippet in snippets"
            class="snippet"
            :href="`http://soocenje.24ur.com/snipped/${snippet.id}`"
          >
            <div
              class="snippet-img"
              :style="{'background-image': `OG_IMAGE_URL/`}"
            ></div>
            <div class="snippet-title">{{ snippet.name || 'Brez naslova' }}</div>
          </a>
        </div>
      </div>
    </div>
  </div>  
</template>

<script>
export default {
  name: 'Collections',

  data() {
    return {
      playlists: [],
      snippets: [],
    };
  },

  mounted() {
    this.$http.get('http://snippet.soocenje.24ur.com/getPlaylists', { emulateJSON: true }).then((playlistsSuccess) => {
      console.log(playlistsSuccess);
      this.playlists = playlistsSuccess.data;
    }, () => {
      // an error occured
    });

    this.$http.get('http://speeches.soocenje.24ur.com/analytics/top/10', { emulateJSON: true }).then((topSuccess) => {
      console.log(topSuccess);
      const localSnippets = [];
      topSuccess.data.counters.forEach((snippet) => {
        this.$http.get(`http://snippet.soocenje.24ur.com/getSnippet?id=${snippet.key}`, {
          emulateJSON: true,
        }).then((snippetSuccess) => {
          console.log(snippetSuccess);
          const newSnippet = snippetSuccess.data;
          delete newSnippet.extras;
          localSnippets.push(newSnippet);
        }, () => {
          // an error occured when trying to get snippet info from server
        });

        this.snippets = localSnippets;
      });
    }, () => {
      // an error occured
    });
  },
};
</script>

<style lang="scss" scoped>
@import '../../styles/colors';
@import '../../styles/scaffolding';

#collections {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 10px;
  padding-bottom: 0;
  width: 100%;
  background-color: $gray;

  .snippets-container-container {
    background-color: $white;
    width: calc(100% + 20px);
    margin-left: -10px;
    margin-right: -10px;
    position: relative;

    &.empty {
      background-color: $gray;
    }
  }

  h1 {
    display: block;
    width: 100%;
    text-align: center;
    width: 100%;
    font-family: 'Poppins', sans-serif;
    font-size: 30px;
    font-weight: 700;
  }

  .playlists,
  .snippets {
    display: block;
    width: 100%;
    margin: auto;
    position: relative;
    &.empty {
      background-color: $gray;
    }
  }
  .snippets {
    background-color: #ffffff;
  }
  .snippets-empty {
    background-image: url('../../assets/brez-izsekov.png');
    background-size: contain;
    display: block;
    position: relative;
    margin: auto;
    width: 358px;
    height: 134px;
    margin-top: 50px;
    margin-bottom: 50px;
  }
  .playlist,
  .snippet {
    display: block;
    cursor: pointer;

    max-width: 310px;

    position: relative;
    
    float: left;
    margin-right: 25px;

    text-decoration: none;

    margin-bottom: 52px;

    &:nth-child(3n) {
      margin-right: 0;
    }

    @include respond-to(parlatube-limbo) {
      &:nth-child(3n) {
        margin-right: 25px;
      }
      &:nth-child(2n) {
        margin-right: 0;
      }
      left: calc(50% - 322.5px);
    }

    @include respond-to(mobile) {
      margin: auto;
      margin-bottom: 52px;
      float: none;

      &:nth-child(3n) {
        margin-right: auto;
      }
    }

    .playlist-img,
    .snippet-img {
      background: $blue;
      max-width: 310px;
      height: 174px;
      position: relative;

      @include respond-to(desktop) {
        width: 310px;
      }

      &::after {
        content: '';
        display: block;
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-color: rgba(188, 42, 42, 0.7);
        opacity: 0;
        background-image: url('../../assets/icons/play-snippet.svg');
        background-position: center;
        background-repeat: no-repeat;
        background-size: 59px 59px;
        transition: all 0.2s ease-out;
      }
    }

    .playlist-title,
    .snippet-title {
      color: $black;
      font-size: 16px;
      font-family: 'Space Mono', monospace;
      font-weight: 700;
      text-decoration: none;
    }

    &:hover .playlist-img::after,
    &:hover .snippet-img::after {
      opacity: 0.7;
    }
  }
}
</style>
