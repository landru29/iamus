angular.module("application").component("sound", {
    templateUrl: "app/sound/sound.html",
    controllerAs: "Sound",
    controller: function(Sound, SOUND) {
        "use strict";

        var self = this;

        function init() {
            _.forEach(SOUND[0].sounds, function(song) {
                Sound.load(song.name, song.url);
            });

            //Sound.play(SOUND[0].sounds[0].name);
            Sound.playAll(true);
        }

        init();
    }
});
