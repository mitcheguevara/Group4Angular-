angular
.module('ransomApp', [
  'ui.router',
  'ngResource'
])
.config([
  '$stateProvider',
  RouterFunction
])
.factory('Post', [
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
  'Post',
  'images',
  logicService
])
.controller('IndexController' ,[
  'Post',
  'images',
  IndexControllerFn
])
.controller('ShowController', [
  'logic',
  'Post',
  '$stateParams',
  ShowControllerFn
])
.controller('PostNewController', [
  '$state',
  'Post',
  PostNewController
])
.controller('PostEditController', [
  '$state',
  'Post',
  PostEditController
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
  .state('postNew', {
    url: '/posts/new',
    templateUrl: 'views/new.html',
    controller: 'PostNewController',
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
  .state ('postEdit', {
  url: 'posts/:id/edit',
  templateUrl: 'views/edit.html',
  controller: 'PostEditController',
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

function logicService($stateParams, $resource, Post, images) {
  return {
    all:all,
    translate:translate
  }

  function translate() {
    // var this_arr = []
    test_post = Post.get({id: $stateParams.id}).$promise.then(function (response) {
       post_string = response.content.toUpperCase()
       console.log(post_string)


      //  ps_array = post_string.map(function(x){
      //    images.query().$promise.then(function (img_response) {
      //     //  console.log(img_response)
      //      console.log(post_string)
      //      for (i=0; i < img_response.length; i++) {
      //      if (x == img_response[i].letter) {
      //       return img_response[i].url
      //      }
      //    }
      //    })
      //  })
      //  console.log(ps_array)



       for (i=0; i < post_string.length; i++) {
         let test_string = post_string[i]

         images.query().$promise.then(function (img_response) {
        // console.log(img_response.url)
         for (l=0; l < img_response.length; l++) {
          //  console.log(test_string)
           if (test_string === img_response[l].letter) {
            //  console.log(img_response[l].url)
           }
         }})
       }

    })
    // console.log(test_post)
    // console.log(test_post.content)
    // for (i=0; i < this_word.length; i++){
    //   this_arr.push(this_word.charAt(i))
    //   console.log(this_word.charAt(i))
    // }
    return post_string
  }

  function all() {
    return Post.query()
  }
}

function IndexControllerFn(Post, images) {
  this.posts = Post.query()
  this.images = images.query()
console.log(this.post)
}

function ShowControllerFn(logic, Post, $stateParams) {
  this.post = Post.get({id: $stateParams.id})
  this.posts = logic.all()
  // this.translate = logic.translate()
}

function PostNewController ($state, Post) {
  this.post = new Post()
  this.create = function () {
    this.post.$save(() => {
      $state.go('postIndex')
    })
  }
}

function PostEditController($state, Post) {
  this.post = Post.get({id: $state.params.id})
  this.update = function () {
    this.post.$update({id: $state.params.id}).then(() => {
      $state.go('postIndex', {}, {reload: true})
    })
  }
  this.destroy = function () {
    this.post.$delete({id: $state.params.id}).then(() => {
      $state.go('postIndex', {}, {reload: true})
    })
  }
}
