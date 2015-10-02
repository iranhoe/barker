var app = angular.module('tiempoApp', ['ngRoute', 'ngResource']).run(function ($rootScope, $http) {
    $rootScope.authenticated = false;
    $rootScope.current_user = "";

    $rootScope.signout = function () {
        $http.get('/auth/signout');

        $rootScope.authenticated = false;
        $rootScope.current_user = "";
    };
});



app.config(['$routeProvider', function ($routeProvider) {
        // Don't strip trailing slashes from calculated URLs
        $routeProvider
    //the timeline display
    .when('/', {
            templateUrl: 'main',
            controller: 'mainController'
        })
    //the signup display
    .when('/register', {
            templateUrl: 'register',
            controller: 'authController'
        })
    //the login display
    .when('/login', {
            templateUrl: 'login',
            controller: 'authController'
        });
}]);

app.factory('postService', function ($resource) {
    return $resource('/api/posts/:id');
});

app.controller('mainController', function ($scope, $rootScope, postService) {
    $scope.posts = postService.query();
    $scope.newPost = { username: '', text: '', created_at: '' };

    $scope.post = function (){
        $scope.newPost.username = $rootScope.current_user;
        $scope.newPost.created_at = Date.now();
        postService.save($scope.newPost, function () {
            $scope.posts = postService.query();
            $scope.newPost = { username: '', text: '', created_at: '' };
        });
    };
});

app.controller('authController', function ($scope, $rootScope, $http, $location) {
    $scope.user = { username: '', password: '' };
    $scope.error_message = '';

    $scope.login = function () {
        $http.post('auth/login', $scope.user).success(function (data) {
            $rootScope.authenticated = true;
            $rootScope.current_user = data.user.username;

            $location.path('/');
        });
    };

    $scope.register = function () {
        $http.post('auth/signup', $scope.user).success(function (data) {
            $rootScope.authenticated = true;
            $rootScope.current_user = data.user.username;
            
            $location.path('/');
        });
    };
});