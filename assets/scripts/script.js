// TMDb api call search:
// https://api.themoviedb.org/3/search/movie?api_key={api_key}&query=Jack+Reacher
// TMDb api call recommendations
// https://api.themoviedb.org/3/movie/75780/recommendations?api_key=f83bba844914e64ae1cd385b42ce04e0&language=en-US&page=1

// OMDb api call example:
// http://www.omdbapi.com/?apikey=20106460&t=the+princess+bride


var tmdbSearchURL =  "https://api.themoviedb.org/3/search/movie?api_key=f83bba844914e64ae1cd385b42ce04e0&query=";
var tmdbRecURL = "https://api.themoviedb.org/3/movie/";
var omdbURL = "http://www.omdbapi.com/?apikey=20106460&t=";

// ============= Movie Objects ==========
var searchMovie = {};
var relatedMovies = [];

userInput = "The Princess Bride";

TmdbSearchByName(userInput);

// $.ajax({
//   url: tmdbSearchURL + encodeURI(userInput)
// }).then(function(tmdbSearch) {
//     searchMovie.title = tmdbSearch.results[0].title;
//     console.log(tmdbSearch);
//     var movieID = tmdbSearch.results[0].id;
//     $.ajax({
//         url: tmdbRecURL + movieID + "/recommendations?api_key=f83bba844914e64ae1cd385b42ce04e0&language=en-US&page=1"
//     }).then(function(tmdbRec) {
//         console.log(tmdbRec.results);
//         // get movie name
//         for (var i = 0; i < 2; i++) {
//             var currentResult = encodeURI(tmdbRec.results[i].title)
//             $.ajax({
//                 url: omdbURL + currentResult
//             }).then(function(omdbSearch) {
//                 console.log(omdbSearch);
//             });
//         }
//         DisplaySearch();
//     });
// });

function TmdbSearchByName(searchTerm)
{
    $.ajax({
        url: tmdbSearchURL + encodeURI(searchTerm)
      }).then(function(tmdbSearch) {
          var movie = tmdbSearch.results[0];
          searchMovie.title = movie.title;
          searchMovie.id = movie.id;
          searchMovie.desc = movie.overview;
          console.log(tmdbSearch);
          TmdbRelated(movie.id);
      });
}

function TmdbRelated(movieID)
{
    $.ajax({
        url: tmdbRecURL + movieID + "/recommendations?api_key=f83bba844914e64ae1cd385b42ce04e0&language=en-US&page=1"
    }).then(function(tmdbRec) {
        console.log(tmdbRec.results);
        // get movie name
        for (var i = 0; i < 2; i++) {
            OmdbSearch(tmdbRec.results[i].title);
        }
    });
}

function OmdbSearch(movieTitle)
{
    $.ajax({
        url: omdbURL + encodeURI(movieTitle)
    }).then(function(omdbSearch) {
        console.log(omdbSearch);
    });
}

function DisplaySearch()
{
    div = searchMovie.title;
}