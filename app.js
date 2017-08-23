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

  // function shuffle(unshuff_arr) {
  //   word_arr = ''
  //   console.log(unshuff_arr)
  //   unshuff_arr.$promise.then(function(response) {
  //   response.forEach(function(word) {
  //     console.log(word)
  //     word.forEach(function(letter){
  //       console.log(letter)
  //     word_arr += letter.letter
  //   })
  //   })
  // })
  //
  //   word_arr.split(' ')
  //   console.log(word_arr)
  //   // word_arr.forEach(function(word) {
  //   //   word.sort(function(a, b){return 0.5 - Math.random()})
  //   // })
  //   console.log(word_arr)
  //   return(word_arr)
  // }

  function translateAll() {
    sorted_arr = []
    words_arr = []
    t_words_arr = []
    unshuffled = []
    unshuffled_arr = []
    this_word_arr = []
    post_words = []
    space_arr = []
    Post.query().$promise.then(function (response) {
    images.query().$promise.then(function (img_response) {

        response.forEach(function (post) {
          var word_arr = []
          word_arr.push(post.content)
          words_arr.push(word_arr)
        })
        words_arr.forEach(function (word) {
          console.log(word)
          let this_word_arr = []
            // console.log(post_string)
          if (word[0].includes(' ')) {
            space_arr = word.toString().toUpperCase().split(' ')
            console.log(space_arr)
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
                  unshuffled.push(unshf)

                })

                post_words.push(this_word_arr)
                this_word_arr = []
            })

                t_words_arr.push(post_words)

          }

          else {
            post_string = word.toString().toUpperCase().split('')

            post_string.forEach(function (letter) {
          let letter_images = img_response.filter(function (img) {
            return img.letter == letter
          })

          if (letter == ' ') {
            // this_word_arr.push({letter: 'space'})
            console.log(this_word_arr)
            post_words.push(this_word_arr)
            this_word_arr = []
          }

          else if (letter != ' ' ) {
            let random_index = Math.floor(Math.random() * letter_images.length)
            let random_letter_image = letter_images[random_index]
            this_word_arr.push(random_letter_image)
            var unshf= Object.assign({}, random_letter_image)
            unshuffled.push(unshf)
            // console.log(post_string.indexOf(letter))
            if (post_string.indexOf(letter) === post_string.length) {
              post_words.push(this_word_arr)
            }
          }
        })

        unshuffled_arr.push(unshuffled)
        unshuffled = []
        // console.log(this_word_arr)
        // console.log(unshuffled_arr)

        t_words_arr.push(this_word_arr)
      }

        // this_word_arr = []
        // unshuffled.push(this_word_arr)
        // shuffled_word = this_word_arr.sort(function(a, b){return 0.5 - Math.random()})
        // t_words_arr.push(this_word_arr)
        })
        //
        // t_words_arr = t_words_arr.map(function (word) {
        //   shuffled_word = word.sort(function(a, b){return 0.5 - Math.random()})
        //   t_words_arr.push(shuffled_word)
        // })
        // console.log(unshuffled)
        console.log(t_words_arr)

      })
    })
    return t_words_arr
  }

  function all() {
    return Post.query()
  }
}

function IndexControllerFn(logic, Post, images) {
  this.posts = Post.query()
  this.images = images.query()
  this.indexPosts = logic.translateAll()
  // this.shuffledPosts = logic.shuffle(this.indexPosts)

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
