'use strict';

// This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = 'https://www.youtube.com/iframe_api';
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// This code fires when the YouTube API is ready
function onYouTubeIframeAPIReady() {
    startApp();
}

var parlatube = void 0;

function startApp() {
    parlatube = new Vue({
        el: '#app',
        name: 'Parlatube',
        data: {
            player: null,
            videoId: 'wXE4_es0cCI',
            subtitles: null,
            timer: null
        },
        methods: {
            onPlayerReady: function onPlayerReady() {
                this.player.playVideo();
            },
            seekTo: function seekTo(miliseconds) {
                this.player.seekTo(miliseconds / 1000);
            },
            scrollSubtitles: function scrollSubtitles() {}
        },
        mounted: function mounted() {
            // This code creates the <iframe> and instantiates the player.
            // It also calls a function when the "onReady" event fires.
            this.player = new YT.Player('player', {
                height: '390',
                width: '100%',
                videoId: this.videoId,
                startSeconds: 0,
                events: {
                    'onReady': this.onPlayerReady
                }
            });

            this.subtitles = parser.fromSrt(captions, true);
            this.timer = window.setInterval(function () {
                console.log(parlatube.player.getCurrentTime());
            }, 500);
        }
    });
}
//# sourceMappingURL=main.js.map
