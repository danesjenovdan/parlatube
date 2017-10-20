<template>
  <div
    :class="['snippets-container-container', {empty: (snippets.length === 0)}]"
    :style="{'background-color': backgroundColor}"
  >
    <div class="container">
      <router-link class="title-link" :to="{name: 'Collections'}"><h1>Zadnji izseki</h1></router-link>
      <div
        :class="['snippets', {empty: (snippets.length === 0)}]"
        :style="{'background-color': backgroundColor}"
      >
        <router-link
          :to="{name: 'Home', params: {editing: true}}"
          class="snippets-empty"
          v-if="snippets.length === 0"
        ></router-link>
        <a
          v-for="snippet in orderedSnippets"
          class="snippet"
          :href="`http://soocenje.24ur.com/snippet/${snippet.id}`"
        >
          <div
            :class="['snippet-img', {clean: snippet.video_id === '4'}]"
            :style="{'background-image': `url('${snippet.newImageUrl}')`}"
          ></div>
          <div class="snippet-title">{{ snippet.name || 'Brez naslova' }}</div>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LatestSnippets',

  props: {
    numberOfSnippets: {
      type: Number,
      default: 6,
    },
    backgroundColor: {
      type: String,
      default: '#ffffff',
    },
  },

  data() {
    return {
      snippets: [],
    };
  },

  computed: {
    orderedSnippets() {
      return this.snippets.sort((a, b) => parseInt(b.score, 10) - parseInt(a.score, 10))
        .filter(snippet => snippet.published === '1');
    },
  },

  mounted() {
    this.$http.get('http://snippet.soocenje.24ur.com/getSnippetsLast', { emulateJSON: true }).then((latestSuccess) => {
      console.log(latestSuccess);
      const localSnippets = [];
      Object.keys(latestSuccess.data).forEach((key) => {
        localSnippets.push(latestSuccess.data[key]);
        // console.log(latestSuccess.data[key]);
      });
      this.snippets = localSnippets.sort((a, b) => b.id - a.id)
        .splice(0, this.numberOfSnippets)
        .map((element) => {
          console.log(element);
          const newElement = JSON.parse(JSON.stringify(element));
          newElement.name = element.name.replace(/&#39;/g, '\'');
          newElement.newImageUrl = `http://static.soocenje.24ur.com/frames/optimised/${element.video_id}/out${Math.floor((parseInt(element.start_time, 10) + ((parseInt(element.end_time, 10) - parseInt(element.start_time, 10)) / 2)) / 5000)}.jpg`;
          return newElement;
        });
    }, () => {
      // an error occured
    });
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/colors';
@import '../styles/scaffolding';

.title-link {
  text-decoration: none;
  color: black;
  &:hover {
    text-decoration: underline;
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
  color: $black;
}

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
  background-image: url('../assets/brez-izsekov.png');
  background-size: contain;
  display: block;
  position: relative;
  margin: auto;
  width: 358px;
  height: 134px;
  margin-top: 50px;
  margin-bottom: 50px;
}
.snippet {
  display: block;
  cursor: pointer;

  max-width: 310px;
  height: 222px;

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
    height: auto;

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

    background-size: cover;
    background-position: 0 0;
    background-repeat: no-repeat;

    filter: contrast(2);

    &::before {
      content: '';
      display: block;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: $black;
      opacity: 0.2;
    }

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
      background-image: url('../assets/icons/play-snippet.svg');
      background-position: center;
      background-repeat: no-repeat;
      background-size: 59px 59px;
      transition: all 0.2s ease-out;
    }

    &.clean {
      filter: none;

      &::before {
        display: none;
      }
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
</style>
