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
  'logic',
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
  .state('home', {
    url: '/',
    templateUrl: 'index.html',
    controller: 'IndexController',
    controllerAs: 'vm'
  }
  )
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
  return $resource('https://ransom-letters.herokuapp.com/', {}, {
      update: {method: 'PUT'},

    })
}

function imagesService($resource) {
  return $resource('https://ransom-letters.herokuapp.com/', {}, {
      update: {method: 'PUT'},
    })
}

function logicService($stateParams, $resource, Post, images) {
  return {
    all:all,
    translate:translate,
    translateAll:translateAll,
    // shuffle:shuffle
  }

  function translate() {
    sorted_arr = []
    Post.get({id: $stateParams.id}).$promise.then(function (response) {
       post_string = response.content.toUpperCase().split('')
       img_arr = []

       console.log(post_string)

      images.query().$promise.then(function (img_response) {

         post_string.forEach(function (letter) {
           let letter_images = img_response.filter(function (img) {
               return img.letter == letter
           })

           if (letter == " ") {
             sorted_arr.push({letter: 'space'})
           }

           else if (letter != " ") {
             let random_index = Math.floor(Math.random() * letter_images.length)
             let random_letter_image = letter_images[random_index]
             sorted_arr.push(random_letter_image)
           }
         })
         console.log(sorted_arr)

        })

        })
        return sorted_arr
}

  function translateAll() {
    sorted_arr = []
    words_arr = []
    t_words_arr = []
    unshuffled = []
    unshuffled_arr = []
    this_word_arr = []
    post_words = []
    space_arr = []
    unshuffled_word = []
    assign_unshuffle = []
    unshuffled_phrase = []
    final_shuffled = []
    shuffled = []
    Post.query().$promise.then(function (response) {
    images.query().$promise.then(function (img_response) {

        response.forEach(function (post) {
          var word_arr = []
          word_arr.push(post.content)
          word_arr.postId = post.id
          words_arr.push(word_arr)
        })
        words_arr.forEach(function (word) {
          console.log(word)
          let this_word_arr = []
            space_arr = word.toString().toUpperCase().split(' ')
            space_arr.forEach(function(sWord) {
              sWord_arr= sWord.split('')
                sWord_arr.forEach(function(sLetter){
                  let letter_images = img_response.filter(function (img) {
                    return img.letter == sLetter
                  })
                  let random_index = Math.floor(Math.random() * letter_images.length)
                  let random_letter_image = letter_images[random_index]
                  this_word_arr.push(random_letter_image)
                  var unshf= Object.assign({}, random_letter_image)
                  unshuffled_word.push(unshf)

                })
                unshuffled_phrase.push(unshuffled_word)
                unshuffled_word = []
                post_words.postId = word.postId
                post_words.push(this_word_arr)
                this_word_arr = []
            })
                unshuffled_arr.push(unshuffled_phrase)
                unshuffled_arr = []
                t_words_arr.push(post_words)
                post_words = []
        })
        console.log(t_words_arr)
          t_words_arr.forEach(function (phrase) {
            phrase.forEach(function(word) {
              shuffled_word = word.sort(function(a, b){return 0.5 - Math.random()})
              shuffled_word.postId = phrase.postId
              shuffled.push(shuffled_word)
            })
            shuffled.postId = phrase.postId
            final_shuffled.push(shuffled)
            shuffled = []
        })
        console.log(final_shuffled)

      })
    })
    return final_shuffled
  }

  function all() {
    return Post.query()
  }
}

function IndexControllerFn(logic, Post, images) {
  this.posts = Post.query()
  this.images = images.query()
  this.indexPosts = logic.translateAll()
  console.log(this.indexPosts)
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
