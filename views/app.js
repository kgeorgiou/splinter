var app = angular.module('splinter', ['angular-loading-bar']);

var API_URL = "http://splinter.kg.gg/splint";
//var API_URL = "http://localhost:3007/splint";

app.config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
}]);

app.controller('SplinterController', ['$scope', '$http', function ($scope, $http) {
    $scope.term = "";
    $scope.displayedTerm = "";
    $scope.isEmpty = false;
    $scope.similarsList = [];

    $scope.getSynonyms = function () {
        $scope.isEmpty = false;
        $scope.similarsList = [];
        $scope.displayedTerm = $scope.term;
        $http.post(API_URL, {url: $scope.term}).success(function (data) {
            $scope.similarsList = data.result;
            if (!data.result || !data.result.length)
                $scope.isEmpty = true;
        }).error(function (status, error) {
        });

    };

    $scope.showResults = function () {
        return $scope.similarsList && $scope.similarsList.length;
    };

    $scope.isResultEmpty = function () {
        return $scope.isEmpty;
    }
}]);