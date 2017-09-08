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
        const topPos = this.$refs[`speech${this.theSpeech.id}`][0].getBoundingClientRect().top;
        this.scrollToSpeech(topPos - 60);
      }
    },

    searchTerm(newSearchTerm) {
      if (newSearchTerm.length > 0) {
        this.searchQuery(newSearchTerm);
      } else {
        this.scrollTranscripts = true;
      }
    },
  },

  beforeMount() {
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
  #transcripts {
    display: flex;
    flex-wrap: wrap;
    overflow: hidden;
    max-height: 300px;
    max-width: 100%;

    .input-container {
      display: flex;
      flex: 0 0 100%;
      overflow: hidden;

      #search-input {
        display: flex;
        flex-grow: 1;
        height: 30px;
      }
    }

    .speeches-container {
      display: flex;
      flex: 1 0 100%;
      max-height: 270px;
      flex-wrap: wrap;

      overflow-x: hidden;
      overflow-y: auto;
    }
    .speech {
      display: flex;
      flex: 0 0 100%;
      flex-wrap: wrap;
      cursor: pointer;

      &:hover {
        background-color: #f0f0f0;
      }

      .speaker-info {
        display: flex;
        flex: 1 0 calc(100% - 5px);
        flex-wrap: nowrap;

        padding: 5px;

        .speaker-image {
          display: flex;
          flex: 0 1 30px;
          height: 30px;

          background-size: contain;
          background-position: center;
          background-repeat: no-repeat;
        }

        .speaker-name {
          line-height: 30px;
          padding-left: 10px;
        }
      }

      .speech-content {
        display: flex;
        flex: 1 0 calc(100% - 5px);
        padding: 5px;

        p {
          margin: 0;
          padding: 0;
        }
      }
    }
  }
</style>

<style lang="scss">
.highlight {
  font-weight: bold;
  background-color: yellow;
}
</style>