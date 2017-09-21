<template>
  <div id="transcripts">
    <div class="input-container">
      <input
        type="text"
        id="search-input"
        placeholder="išči ..."
        v-model="searchTerm"
      >
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
    };
  },

  computed: {
    ...mapState({
      currentTime: state => state.video.currentTime,
    }),
    theSpeech() {
      const filteredSpeeches = this.transcripts.filter(speech =>
        ((speech.start_time_stamp / 1000) < this.currentTime) &&
        ((speech.end_time_stamp / 1000) > this.currentTime));

      return filteredSpeeches[0];
    },
  },

  methods: {
    scrollTo(timestamp) {
      this.$store.commit('video/UPDATE_SEEK_TO', Math.ceil(timestamp / 1000));
    },
    scrollToSpeech(topPos) {
      if (this.scrollTranscripts) {
        this.$refs.speechesContainer.scrollTop = this.$refs.speechesContainer.scrollTop + topPos;
      }
    },
    searchQuery(term) {
      this.scrollTranscripts = false;
      this.$refs.speechesContainer.scrollTop = 0;

      const highlightingRegex = new RegExp(term, 'g'); // TODO highlighting hack
      this.$http.get(`http://speeches.knedl.si/q/${term}`).then((result) => {
        if (result.data.length > 0) {
          this.transcripts = result.data
          .sort((a, b) => a.start_time_stamp - b.start_time_stamp)
          .map(speech => ({
            content: speech.content.replace(highlightingRegex, `<span class="highlight">${term}</span>`), // TODO highlighting hack
            end_time_stamp: speech.timestamp_start,
            start_time_stamp: speech.timestamp_start,
            image_url: speech.speaker_url,
            id: speech.id,
            name: speech.speaker_name,
          }));
        } else {
          this.transcripts = this.allSpeeches;
        }
      });
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

    searchTerm(newSearchTerm) {
      if (newSearchTerm.length > 0) {
        this.searchQuery(newSearchTerm);
      } else {
        this.transcripts = this.allSpeeches;
        this.scrollTranscripts = true;
      }
    },
  },

  created() {
    this.$http.get('http://speeches.knedl.si/getSpeeches/1', {
      emulateJSON: true,
    }).then((result) => {
      this.transcripts = result.data.sort((a, b) => a.start_time_stamp - b.start_time_stamp);
      this.allSpeeches = this.transcripts;
    });
  },

  mounted() {
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
    box-shadow: 0 4px 7px rgba(0, 0, 0, 0.2);
    height: 54px;
    background-color: $white;
    align-items: center;

    &::after {
      content: '';
      display: flex;
      flex: 0 0 35px;
      height: 35px;
      background-image: url('../assets/icons/search.svg');
      background-size: contain;
      background-color: $white;
      margin-right: 10px;
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
  }

  .speeches-container {
    display: flex;
    flex: 1 0 100%;
    flex-wrap: wrap;

    height: calc(100% - 54px);

    overflow-x: hidden;
    overflow-y: auto;
  }
  .speech {
    display: flex;
    flex: 0 0 100%;
    flex-wrap: wrap;
    cursor: pointer;
    position: relative;
    background-color: $white;

    &:hover::after {
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
      flex: 1 0 calc(100% - 5px);
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

.highlight {
  font-weight: bold;
}

.speeches-container {
  @extend %scroller;
}
</style>