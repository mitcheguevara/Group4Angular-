angular
.module('ransomApp', [
  'ui.router',
  'ngResource'
])
.config([
  '$stateProvider',
  RouterFunction
])
.factory('posts', [
  '$resource',
  postsService
])
.factory('images', [
  '$resource',
  imagesService
])
.factory('logic', [
  '$resource',
  'posts',
  'images',
  logicService
])
.controller('IndexController' ,[
  'posts',
  'images',
  IndexControllerFn
])
.controller('ShowController', [
  'posts',
  '$stateParams',
  ShowControllerFn
])

function RouterFunction($stateProvider) {
  $stateProvider
  .state('postIndex', {
    url: '/index',
    templateUrl: 'views/index.html',
    controller: 'IndexController',
    controllerAs: 'vm'
  }
  )
  .state('postShow', {
    url: '/posts/:id',
    templateUrl: 'views/show.html',
    controller: 'ShowController',
    controllerAs: 'vm'
  }
  )
}
function postsService($resource) {
  return $resource('http://localhost:3000/posts/:id', {}, {
      update: {method: 'PUT'},

    })



}

function imagesService($resource) {
  return $resource('http://localhost:3000/images/:id', {}, {
      update: {method: 'PUT'},
    })

}

function logicService($resource, images, posts) {
  return {
    all:all
  }

  function all() {
    return posts.query()
  }
}

function IndexControllerFn(posts, images) {
  this.posts = posts.query()
  this.images = images.query()
console.log(this.post)
}

function ShowControllerFn(posts, $stateParams) {
  this.posts = posts.query()
  this.post = posts.get({id: $stateParams.id})
  console.log(logic.all)

    
}
