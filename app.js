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
  '$stateParams',
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
  'logic',
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

function logicService($stateParams, $resource, posts, images) {
  return {
    all:all,
    translate:translate
  }

  function translate() {
    // var this_arr = []
    test_post = posts.get({id: $stateParams.id})
    console.log(test_post)
    console.log(test_post.content)
    // for (i=0; i < this_word.length; i++){
    //   this_arr.push(this_word.charAt(i))
    //   console.log(this_word.charAt(i))
    // }
    return test_post.content
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

function ShowControllerFn(logic, posts, $stateParams) {
  this.post = posts.get({id: $stateParams.id})
  this.posts = logic.all()
  this.translate = logic.translate()
}
