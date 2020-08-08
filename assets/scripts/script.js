// TMDb api call search:
// https://api.themoviedb.org/3/search/movie?api_key={api_key}&query=Jack+Reacher
// TMDb api call recommendations
// https://api.themoviedb.org/3/movie/75780/recommendations?api_key=f83bba844914e64ae1cd385b42ce04e0&language=en-US&page=1

// OMDb api call example:
// http://www.omdbapi.com/?apikey=20106460&t=the+princess+bride

const TMDB_SEARCH_URL = "https://api.themoviedb.org/3/search/movie?api_key=f83bba844914e64ae1cd385b42ce04e0&query=";
const TMDB_REC_URL = "https://api.themoviedb.org/3/movie/";
const OMDB_URL = "http://www.omdbapi.com/?apikey=20106460&t=";

// ============= Movie Objects ==========
var searchMovie = {};
var relatedMovies = [];

$("#search-button").on("click", function()
{
    relatedMovies = [];
    TmdbSearchByName($("#user-input").val());
});


function TmdbSearchByName(searchTerm) {
  $.ajax({
    url: TMDB_SEARCH_URL + encodeURI(searchTerm),
  }).then(function (tmdbSearch) {
    var movie = tmdbSearch.results[0];
    searchMovie.title = movie.title;
    searchMovie.id = movie.id;
    searchMovie.desc = movie.overview;
    console.log(tmdbSearch);
    TmdbRelated(movie.id);
  });
}

function TmdbRelated(movieID) {
  $.ajax({
    url:
      TMDB_REC_URL +
      movieID +
      "/recommendations?api_key=f83bba844914e64ae1cd385b42ce04e0&language=en-US&page=1",
  }).then(function (tmdbRec) {
    console.log(tmdbRec.results);
    // get movie name
    for (var i = 0; i < 2; i++) {
      OmdbSearch(tmdbRec.results[i].title);
    }
  }).then(function()
  {
      console.log("Last thing");
  });
}

function OmdbSearch(movieTitle) {
    
  $.ajax({
    url: OMDB_URL + encodeURI(movieTitle),
  }).then(function (omdbSearch) {
    console.log(omdbSearch);
    var related = {};
    related.title = omdbSearch.Title;
    relatedMovies.push(related);
    console.log(relatedMovies);
    // Redraw display
  });
}

function DisplaySearch() {
  div = searchMovie.title;
}
