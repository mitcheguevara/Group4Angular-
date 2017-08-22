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
    Post.get({id: $stateParams.id}).$promise.then(function (response) {
       post_string = response.content.toUpperCase().split('')
       img_arr = []
       sorted_arr = []
       console.log(post_string)

       images.query().$promise.then(function (img_response) {

         post_string.forEach(function (letter) {
           let letter_images = img_response.filter(function (img) {
               return img.letter == letter
           })


           if (letter != " ") {
             let random_index = Math.floor(Math.random() * letter_images.length)
             let random_letter_image = letter_images[random_index]
             sorted_arr.push(random_letter_image)
           }
         })
         console.log(sorted_arr)
        })

        })

        }
      //  for (i=0; i < post_string.length; i++) {
      //    let test_string = post_string[i]
      //     console.log(test_string)
       //
      //      console.log(img_response)
      //    for (l=1; l < img_response.length; l++) {
      //     //  console.log(test_string)
      //     ll = Math.floor((Math.random() * 400))
      //      if (test_string === img_response[ll].letter) {
      //        console.log(img_response[ll].url)
      //        img_arr.push({letter: test_string, url:img_response[ll].url})
      //          if (img_arr.length === post_string.length) {
      //            for (x=0; x< post_string.length; x++) {
      //             //  console.log(img_arr)
      //              for (y=0; y< img_arr.length; y++) {
      //               //  console.log('hi')
      //                if (post_string[x] === img_arr[y].letter) {
      //                 //  console.log(img_arr[y])
      //                  sorted_arr.push(img_arr[y])
      //                }
        //            }
        //          }
        //        }
        //      console.log(sorted_arr)
        //      break
        //    }
        //  }
      //  }



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
  this.translate = logic.translate()
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
