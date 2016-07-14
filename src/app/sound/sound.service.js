angular.module("application").service("Sound", function (ngAudio, $q) {
    "use strict";

    var Sound = function () {
        this.data = [];
    };

    Sound.prototype.load = function (name, url) {
        this.data.push({
            name: name,
            url: url
        });
    };

    Sound.prototype.playAll = function (loop) {
        var self = this;
        var _loop = false;
        if (_.isBoolean(loop)) {
            _loop = loop;
            Array.prototype.shift.call(arguments);
        }
        var songs = arguments.length ? arguments[arguments.length - 1] : this.data;
        if (songs[0]) {
            this.play(songs[0]).then(function () {
                self.playAll(_loop, songs.slice(1));
            });
        } else {
            if (_loop) {
                self.playAll(_loop, self.data);
            } else {
                delete self.currentPlaying;
            }
        }
    };

    Sound.prototype.play = function (name) {
        var self = this;
        return $q(function(resolve, reject) {
            var song = name.url ? name : _.find(self.data, {
                name: name
            });
            if (song) {
                var stream = ngAudio.load(song.url);
                self.currentPlaying = stream.play();
                self.currentPlaying.complete(function () {
                    resolve();
                });
            } else {
                reject("No sound found : " + url);
            }
        });
    };

    return new Sound();
});
