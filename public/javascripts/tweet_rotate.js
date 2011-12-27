$(document).ready( function(){
  setTimeout( 'rotate()', 5000 )
})

function rotate() {
  var channels = $('.site1')
  for( var cnum=0; cnum<channels.length; cnum++ ) {
    var tweets = $('.tweet-frame', channels[cnum] )
    rotate_tweets( tweets )
  }
  
  function rotate_tweets( tweets ){
    var next = 0
    random_bubble( $(tweets[next]) )
    $(tweets[next]).fadeIn()
    
    setInterval( function() {
      $(tweets[next]).hide()
      next = next+1 >= tweets.length ? 0 : next+1
      random_bubble( $(tweets[next]) )
      $(tweets[next]).fadeIn()
    }, 10000)
    
    function random_bubble( tweet ){
      var classes = tweet.attr('class')
      tweet.removeClass(classes)
      classes = '.tweet-frame, tweet-bubble'+Math.floor( Math.random()*3+1 )
      tweet.addClass( classes )
    }
  }
}

    