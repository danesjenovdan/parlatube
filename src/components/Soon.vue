<template>
  <div id="soon">
    <div class="container">
      <div class="soon">
        <div class="icon"></div>
        <div class="text">Soočenje se prične {{ theTime }}.</div>
      </div>
    </div>
  </div>
</template>

<script>
import * as moment from 'moment';
import 'moment/locale/sl';

export default {
  name: 'Soon',

  data() {
    return {};
  },

  computed: {
    theTime() {
      const eventTime = moment('2017-10-20T21:00:00Z');
      const currentTime = moment.now();
      const time = eventTime - currentTime;
      const duration = moment.duration(time);

      let hourPrefix = 'ur';
      if (duration.hours() === 1) {
        hourPrefix = 'uro';
      } else if (duration.hours() === 2) {
        hourPrefix = 'uri';
      } else if ((duration.hours() === 3) || (duration.hours() === 4)) {
        hourPrefix = 'ure';
      }

      let minutePrefix = 'minut';
      if (duration.minutes() === 1) {
        minutePrefix = 'minuto';
      } else if (duration.hours() === 2) {
        minutePrefix = 'minuti';
      } else if ((duration.hours() === 3) || (duration.hours() === 4)) {
        minutePrefix = 'minute';
      }
      return `čez ${(duration.days() > 0) ? '1 dan, ' : ''} ${duration.hours()} ${hourPrefix} in ${duration.minutes() + 1} ${minutePrefix}`;
    },
  },

  mounted() {
  },
};
</script>

<style lang="scss" scoped>
@import '../styles/colors';
@import '../styles/scroller';

#soon {
  display: block;
  flex: 0 0 100%;
  flex-wrap: wrap;
  background: $gray;
  overflow: hidden;
  padding-top: 150px;
  padding-bottom: 170px;

  .soon {
    background: $gray;
    overflow: hidden;
    margin: auto;
    display: block;
    position: relative;
    width: 300px;

    .icon {
      background-image: url('../assets/icons/oblacek.png');
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
      width: 100px;
      height: 100px;
      float: left;
    }

    .text {
      font-family: 'Space Mono', serif;
      font-size: 16px;
      font-weight: 700;
      float: left;
      width: 180px;
      height: 100px;
      padding-left: 20px;
      padding-top: 15px;
    }
  }
}
</style>

<style lang="scss">
.fb_iframe_widget,
.fb_iframe_widget span,
.fb_iframe_widget span iframe[style] {
  min-width: 100%;
  width: 100%;
}

/* TODO */
// #drawing-container {
//   display: none;
// }
</style>
