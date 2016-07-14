angular.module("application").component("sound", {
    templateUrl: "app/sound/sound.html",
    controllerAs: "SoundCtrl",
    controller: function (Sound, SOUND, Storage) {
        "use strict";

        var self = this;

        function loadPlaylist () {
            self.playlists = SOUND;
            if ((Storage.playlist) && (_.some(self.playlists, { name: Storage.playlist }))) {
                self.playlist = _.find(self.playlists, { name: Storage.playlist });
            }
        }

        function init () {
            loadPlaylist();

            _.forEach(SOUND[0].sounds, function(song) {
                Sound.load(song.name, song.url);
            });

            //Sound.play(SOUND[0].sounds[0].name);
            Sound.playAll(true);
        }

        init();
    }
});
