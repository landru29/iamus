angular.module("application").service("Storage", function ($localStorage) {
    if (!$localStorage.epiphanies) {
        $localStorage.epiphanies = {};
    }

    return $localStorage.epiphanies;
});
