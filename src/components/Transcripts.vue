<template>
  <div
    id="transcripts"
    :style="{ height: `${videoHeight}px` }"
  >
    <div class="input-container">
      <input
        type="text"
        id="search-input"
        placeholder="išči ..."
        v-model="searchTerm"
      >
      <div :class="['number-of-results', { filtering: amIFiltering }]">({{ numberOfResults }})</div>
      <div :class="{ clearme: amIFiltering, searchme: !amIFiltering }" @click="clearResults"></div>
    </div>
    <div
      class="speeches-container"
      ref="speechesContainer"
      @mouseover="scrollTranscripts = false"
      @mouseout="scrollTranscripts = true"
    >
      <div
        class="speech"
        v-for="speech in transcripts"
        @click.prevent="scrollTo(speech.start_time_stamp)"
        :ref="`speech${speech.id}`"
      >
        <div class="speaker-info">
          <div
            class="speaker-image"
            :style="{'background-image': `url(${speech.image_url})`}"
          ></div>
          <div class="speaker-name">{{ speech.name }}</div>
          <div v-if="amIFiltering" :class="['speech-expander', { shrink: speech.expanded, expand: !speech.expanded }]" @click.stop="toggleSpeech(speech)"></div>
        </div>
        <div class="speech-content">
          <p v-html="speech.content"></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'Transcripts',

  data() {
    return {
      transcripts: [],
      allSpeeches: [],
      currentSpeechId: 0,
      scrollTranscripts: true,
      searchTerm: '',
      numberOfResults: 0,
      videoHeight: 359,
    };
  },

  computed: {
    ...mapState({
      currentTime: state => state.video.currentTime,
      videoLoadedAndPlaying: state => state.video.loadedAndPlaying,
      seekTo: state => state.video.seekTo,
    }),
    theSpeech() {
      const filteredSpeeches = this.transcripts.filter(speech =>
        ((speech.start_time_stamp / 1000) < this.currentTime) &&
        ((speech.end_time_stamp / 1000) > this.currentTime));

      return filteredSpeeches[0];
    },
    amIFiltering() {
      return this.searchTerm !== '';
    },
  },

  methods: {
    scrollTo(timestamp) {
      // RESET SEEK TO
      this.$store.commit('video/UPDATE_SEEK_TO', -1);
      this.$nextTick(() => {
        this.$store.commit('video/UPDATE_SEEK_TO', (timestamp / 1000));
        this.searchTerm = '';
      });
    },
    scrollToSpeech(topPos) {
      if (this.scrollTranscripts) {
        this.$refs.speechesContainer.scrollTop = this.$refs.speechesContainer.scrollTop + topPos;
      }
    },
    searchQuery(term) {
      this.scrollTranscripts = false;
      this.$refs.speechesContainer.scrollTop = 0;

      this.$http.get(`http://speeches.soocenje.24ur.com/q/1/${term}`).then((result) => {
        console.log(result);
        if (result.data.length > 0) {
          this.transcripts = result.data
          .sort((a, b) => a.start_time_stamp - b.start_time_stamp)
          .map(speech => ({
            content_t: speech.content_t[0],
            highlight: speech.highlight,
            content: speech.highlight,
            end_time_stamp: speech.timestamp_start,
            start_time_stamp: speech.timestamp_start,
            image_url: `http://speeches.soocenje.24ur.com${speech.speaker_url}`,
            id: speech.id,
            name: speech.speaker_name,
            expanded: false,
          }));

          this.numberOfResults = result.data.length;
        } else {
          this.transcripts = [];
          this.numberOfResults = 0;
        }
      });
    },

    toggleSpeech(speech) {
      const theSpeech = this.transcripts.filter(transcript => transcript === speech)[0];
      const theIndex = this.transcripts.indexOf(theSpeech);
      const newTranscripts = JSON.parse(JSON.stringify(this.transcripts));
      if (speech.expanded) {
        newTranscripts[theIndex].content = speech.highlight;
        newTranscripts[theIndex].expanded = false;
      } else {
        const highlights = /<em>(.*?)<\/em>/g.exec(speech.highlight);
        newTranscripts[theIndex].content = speech.content_t.replace(` ${highlights[1]}`, ` ${highlights[0]}`);
        newTranscripts[theIndex].expanded = true;
      }
      this.transcripts = newTranscripts;
    },

    clearResults() {
      if (this.amIFiltering) {
        this.searchTerm = '';
      }
    },
  },

  watch: {
    currentTime(newCurrentTime) {
      if (this.theSpeech &&
        (newCurrentTime > this.theSpeech.start_time_stamp / 1000) &&
        (newCurrentTime < this.theSpeech.end_time_stamp / 1000)) {
        const topPos = this.$refs[`speech${this.theSpeech.id}`][0].getBoundingClientRect().top - this.$refs.speechesContainer.getBoundingClientRect().top;
        this.scrollToSpeech(topPos);
      }
    },

    videoLoadedAndPlaying(newVideoLoadedAndPlaying) {
      const newHeight = this.$parent.$children.filter(child => child.$el.id === 'video')[0].$el.getBoundingClientRect().height - 10;
      if (newVideoLoadedAndPlaying) {
        this.videoHeight = newHeight;
        console.log(newHeight);
      }
    },

    searchTerm(newSearchTerm) {
      if (newSearchTerm.length > 0) {
        this.searchQuery(newSearchTerm);
        console.log('ping');
      } else {
        this.transcripts = this.allSpeeches;
        this.scrollTranscripts = true;
      }
    },
  },

  created() {
    this.$http.get('http://speeches.soocenje.24ur.com/getSpeeches/1', {
      emulateJSON: true,
    }).then((result) => {
      this.transcripts = result.data
        .sort((a, b) => a.start_time_stamp - b.start_time_stamp)
        .map(speech => ({
          content: speech.content,
          content_t: speech.content,
          highlight: '',
          end_time_stamp: speech.end_time_stamp,
          start_time_stamp: speech.start_time_stamp,
          image_url: `${speech.image_url}`,
          id: speech.id,
          name: speech.name,
        }));
      this.allSpeeches = this.transcripts;
    });
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/colors';

#transcripts {
  display: flex;
  flex: 0 1 100%;
  flex-wrap: wrap;
  overflow: hidden;
  max-width: 100%;
  padding: 5px 5px 5px 0;

  background-color: $gray;

  .input-container {
    display: flex;
    flex: 1 1 100%;
    overflow: hidden;
    // box-shadow: 0 4px 7px rgba(0, 0, 0, 0.2);
    height: 54px;
    background-color: $white;
    align-items: center;
    border-bottom: 2px solid $gray;

    .searchme {
      display: flex;
      flex: 0 0 35px;
      height: 35px;
      background-image: url('../assets/icons/search.svg');
      background-size: contain;
      background-color: $white;
      margin-right: 10px;
    }

    .clearme {
      display: flex;
      flex: 0 0 35px;
      height: 35px;
      background-image: url('../assets/icons/clear.svg');
      background-size: contain;
      background-color: $white;
      margin-right: 10px;
      cursor: pointer;
    }

    #search-input {
      display: flex;
      flex-grow: 1;
      border: none;
      color: $black;
      font-family: 'Space Mono', monospace;
      font-weight: 700;
      line-height: 54px;

      padding-left: 14px;
    }

    .number-of-results {
      font-family: 'Space Mono', monospace;
      color: $black;
      position: absolute;
      right: 50px;
      padding-right: 6px;
      padding-left: 2px;
      padding-top: 2px;
      padding-bottom: 2px;

      display: none;
      
      font-size: 12px;      

      background: $white;

      &.filtering {
        display: block;
      }
    }
  }

  .speeches-container {
    display: flex;
    flex: 1 0 100%;
    flex-wrap: wrap;

    height: calc(100% - 54px);

    overflow-x: hidden;
    overflow-y: auto;

    background-color: $white;

    position: relative;

    &:before {
      content: 'Ni rezultatov';
      display: block;
      position: absolute;
      font-family: 'Poppins', sans-serif;
      font-size: 13px;
      top: 10px;
      left: 14px;
    }
  }
  .speech {
    display: flex;
    flex: 0 0 100%;
    flex-wrap: wrap;
    cursor: pointer;
    position: relative;
    background-color: $white;

    &:hover::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;

      background-color: $red;
      opacity: 0.15;
    }

    .speaker-info {
      display: flex;
      flex: 1 1 calc(100% - 5px);
      flex-wrap: nowrap;

      padding: 17px 13px 11px 13px;

      .speaker-image {
        display: flex;
        flex: 0 1 30px;
        height: 30px;

        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;

        border-radius: 50%;
      }

      .speaker-name {
        line-height: 30px;
        padding-left: 10px;
        font-family: 'Space Mono', monospace;
        text-transform: uppercase;
        font-size: 14px;
        font-weight: 700;
      }
      
      .speech-expander {
        width: 13px;
        height: 17px;
        top: 19px;
        right: 7px;
        position: absolute;
        background-size: contain;
        transition: all 0.2s ease-out;

        &.expand {
          background-image: url('../assets/icons/expand.png');
        }

        &.shrink {
          background-image: url('../assets/icons/shrink.png');
        }

        &:hover {
          transform: scale(1.2);
        }
      }
    }

    .speech-content {
      display: flex;
      flex: 1 1 calc(100% - 5px);
      padding: 0 13px 19px 13px;

      p {
        margin: 0;
        padding: 0;
        font-family: 'Poppins', sans-serif;
        font-size: 13px;
        color: $black;
      }
    }
  }
}
</style>

<style lang="scss">
@import '../styles/colors';
@import '../styles/scroller';

.speech-content p em {
  // font-weight: 700;
  font-style: normal;
  background-color: rgba(188, 42, 42, 0.4); // $red with 0.4 opacity
  padding-left: 1px;
  padding-right: 1px;
}

.speeches-container {
  @extend %scroller;
}
</style>