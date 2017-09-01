<template>
  <div id="transcripts">
    <div class="input-container">
      <input
        type="text"
        id="search-input"
        placeholder="išči ..."
      >
    </div>
    <div class="speeches-container">
      <div
        class="speech"
        v-for="speech in transcripts"
        @click.prevent="scrollTo(speech.start_time_stamp)"
      >
        <div class="speaker-info">
          <div
            class="speaker-image"
            :style="{'background-image': `url(${speech.image_url})`}"
          ></div>
          <div class="speaker-name">{{ speech.name }}</div>
        </div>
        <div class="speech-content">
          {{ speech.content }}
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
    };
  },

  computed: {
    ...mapState({
      currentTime: state => state.video.currentTime,
    }),
  },

  methods: {
    scrollTo(timestamp) {
      this.$store.commit('video/UPDATE_SEEK_TO', (timestamp / 1000));
    },
  },

  watch: {
    currentTime() {
    },
  },

  beforeMount() {
    this.$http.get('http://speeches.knedl.si/getSpeeches/1', {
      emulateJSON: true,
    }).then((result) => {
      this.transcripts = result.data;
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
      }
    }
  }
</style>
