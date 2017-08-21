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
    test_post = posts.get({id: $stateParams.id}).$promise.then(function (response) {
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
