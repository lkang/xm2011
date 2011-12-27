
/**
 * Module dependencies.
 */

var http = require('http');
var express = require('express');
var url = require('url');

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use('/', express.errorHandler({ dump: true, stack: true }));
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes
app.get('/', function(req, res) {
  var urloptions = url.parse( req.url, true )

  console.log( "urloptions: " )
  console.log( urloptions.query )
  
  function isEmpty( ob ) {
    for( var x in ob ) {
      return( false )
    }
    return( true )
  }

  if( isEmpty(urloptions.query) || urloptions.query.search1 == null )
    urloptions.query = {
      search1: 'from:l_kang',
      search2: 'from:kangaustin',
      search3: 'from:tissummy',
      search4: 'from:youngkim63'
    }
  
  searches = []
  for( var searchvar in urloptions.query ) {
    searches.push({
      search_term : urloptions.query[searchvar],
      results: "",
      done: false      
    })
  }
  
  for(var search_num in searches) {
    do_search( searches[search_num], res )
  }
  
  function do_search( search, res ){  
    console.log( "operating on search: " + search.search_term )
    
    // http://search.twitter.com/search.json?q=nerd&geocode=37.781157,-122.398720,250mi
    var options = { host: 'search.twitter.com', port:80, path:'/search.json?q=' + search.search_term }                   
    http.get( options, function( response ){
      var search_results = ""
      response.on('data', function(chunk){
        search_results = search_results.concat(chunk);
      });
      
      response.on('end', function(){
        console.log( "got end for : " + search.search_term )
        // console.log( search_results )
        if(search_results.length)
          search.results = JSON.parse(search_results).results
        else
          search.results = { results: [] }
        search.done = true
  
        for( var s in searches ){
          if( !searches[s].done )
            return
        }
        // render if all results are done
        res.render('index', {
          title: 'Holiday Tweets',
          results: searches
        });
      })
    })
  }
})


// port = process.env.PORT || 3000 // for heroku
port = 80 // for no.de
app.listen(port);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

