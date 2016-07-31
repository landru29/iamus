angular.module("application").component("story", {
    templateUrl: "app/story/story.html",
    controllerAs: "StoryCtrl",
    controller: function ($sce, $http, Storage) {
        "use strict";

        var self = this;

        this.previous = function (page) {
            if (this.page > 0) {
                this.page--;
            }
        };

        this.next = function (page) {
            if (this.page < self.story.length - 1) {
                this.page++;
            }
        };

        function init () {
            self.page = 0;
            self.story = [];
            $http.get("assets/story/story01.json").then(function (response) {
                self.story = response.data;
            });
        }

        Object.defineProperty(this, "currentPage", {
            get: function () {
                return self.story.length > self.page ? $sce.trustAsHtml(self.story[self.page]) : "";
            }
        });

        init();
    }
});
