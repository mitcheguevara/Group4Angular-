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
.controller('IndexController' ,[
  'posts',
  'images',
  IndexControllerFn
])

function RouterFunction($stateProvider) {
  $stateProvider
  .state('ransomIndex', {
    url: '/index',
    templateUrl: 'views/index.html',
    controller: 'IndexController',
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

function IndexControllerFn(posts, images) {
  this.posts = posts.query()
  this.images = images.query()


}
