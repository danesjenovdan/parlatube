<template>
  <div
    :class="['snippets-container-container', {empty: (snippets.length === 0)}]"
    :style="{'background-color': backgroundColor}"
  >
    <div class="container">
      <div class="sorter">
        <p>Razvrsti glede na</p>
        <div class="sorter-container">
          <div :class="['sort-button', {active: (!score && !onlyLast)}]" @click="score = false; onlyLast = false">čas objave</div>
          <div :class="['sort-button', {active: (score && !onlyLast)}]" @click="score = true; onlyLast = false">št. ogledov</div>
          <!-- <div :class="['sort-button', {active: onlyLast}]" @click="onlyLast = true">samo zadnje soočenje</div> -->
        </div>
      </div>
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
            :class="['snippet-img', 'clean']"
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
      default: 300,
    },
    backgroundColor: {
      type: String,
      default: '#eaeaea',
    },
  },

  data() {
    return {
      snippets: [],
      score: false,
      onlyLast: false,
    };
  },

  computed: {
    scoreSnippets() {
      return this.snippets.sort((a, b) => parseInt(b.score, 10) - parseInt(a.score, 10))
        .filter(snippet => snippet.published === '1'); // .filter(snippet => snippet.video_id !== '4');
    },
    scoreSnippetsOnlyLast() {
      return this.snippets.sort((a, b) => parseInt(b.score, 10) - parseInt(a.score, 10))
        .filter(snippet => snippet.published === '1').filter(snippet => snippet.video_id === '4');
    },
    timeStampSnippets() {
      return this.snippets.sort((a, b) => parseInt(b.id, 10) - parseInt(a.id, 10))
        .filter(snippet => snippet.published === '1'); // .filter(snippet => snippet.video_id !== '4');
    },
    orderedSnippets() {
      if (this.onlyLast) {
        return this.scoreSnippetsOnlyLast;
      }
      return this.score === true ? this.scoreSnippets : this.timeStampSnippets;
    },
  },

  mounted() {
    this.$http.get(`http://speeches.soocenje.24ur.com/analytics/top/${this.numberOfSnippets}`, { emulateJSON: true }).then((topSuccess) => {
      console.log(topSuccess);
      const localSnippets = [];
      topSuccess.data.counters.forEach((snippet) => {
        this.$http.get(`http://snippet.soocenje.24ur.com/getSnippet?id=${snippet.key}`, {
          emulateJSON: true,
        }).then((snippetSuccess) => {
          const newSnippet = snippetSuccess.data;
          newSnippet.score = snippet.counter;
          // if (newSnippet.video_id === '4') {
          //   newSnippet.newImageUrl = 'http://static.soocenje.24ur.com/snippet-image.png';
          // } else {
          newSnippet.newImageUrl = `http://static.soocenje.24ur.com/frames/optimised/${newSnippet.video_id}/out${Math.floor((newSnippet.start_time + ((newSnippet.end_time - newSnippet.start_time) / 2)) / 5000)}.jpg`;
          // }
          newSnippet.name = snippetSuccess.data.name.replace(/&#39;/g, '\'').replace(/&#34;/g, '"');
          console.log(newSnippet);
          delete newSnippet.extras;
          if (newSnippet.published === '1') {
            localSnippets.push(newSnippet);
          }
        }, () => {
          // an error occured when trying to get snippet info from server
        });

        this.snippets = localSnippets;
      });
    }, () => {
      // an error occured
    });
    // this.$http.get('http://snippet.soocenje.24ur.com/getSnippets', { emulateJSON: true }).then((latestSuccess) => {
    //   console.log(latestSuccess);
    //   const localSnippets = [];
    //   Object.keys(latestSuccess.data).forEach((key) => {
    //     localSnippets.push(latestSuccess.data[key]);
    //     // console.log(latestSuccess.data[key]);
    //   });
    //   this.snippets = localSnippets.sort((a, b) => b.id - a.id)
    //     .splice(0, this.numberOfSnippets)
    //     .map((element) => {
    //       const newElement = JSON.parse(JSON.stringify(element));
    //       newElement.name = element.name.replace(/&#39;/g, '\'');
    //       if (element.video_id === '4') {
    //         newElement.newImageUrl = 'http://static.soocenje.24ur.com/snippet-image.png';
    //       } else {
    //         newElement.newImageUrl = `http://static.soocenje.24ur.com/frames/optimised/${element.video_id}/out${Math.floor(element.start_time / 5000)}.jpg`;
    //       }
    //       return newElement;
    //     });
    // }, () => {
    //   // an error occured
    // });
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/colors';
@import '../styles/scaffolding';
@import '../styles/fonts';

.sorter {
  position: relative;
  margin: auto;
  display: block;

  margin-bottom: 20px;

  overflow: hidden;
  max-width: 100%;

  .sorter-container {
    display: inline-block;
  }

  @include respond-to(parlatube-limbo) {
    left: calc(50% - 322.5px);
  }

  @include respond-to(mobile) {
    margin: 52px;
    margin-top: 0;
    margin-bottom: 20px;
    float: none;
  }

  p {
    font-family: 'Poppins', sans-serif;
    font-weight: 700;
    font-size: 18px;
    display: inline-block;
  }

  .sort-button {
    font-size: 18px;
    font-family: 'Space Mono', serif;
    display: inline-block;
    padding: 10px 20px 10px 20px;
    background: $white;
    color: $red;
    font-weight: 700;
    margin-left: 5px;
    margin-right: 5px;
    cursor: pointer;

    &:hover,
    &.active {
      background-color: $red;
      color: $white;
    }

    @include respond-to(mobile) {
      margin-bottom: 10px;
    }
  }
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
  background-color: $gray;
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
