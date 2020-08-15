// TMDb api call search:
// https://api.themoviedb.org/3/search/movie?api_key={api_key}&query=Jack+Reacher
// TMDb api call recommendations
// https://api.themoviedb.org/3/movie/75780/recommendations?api_key=f83bba844914e64ae1cd385b42ce04e0&language=en-US&page=1

// OMDb api call example:
// http://www.omdbapi.com/?apikey=20106460&t=the+princess+bride

// ========= variables section ==============
$(document).foundation();
// =============== Trusworthy Array ==============

const TRUST_ARRAY = [];

// ============= Const Section ==============

const TMDB_API_KEY = "f83bba844914e64ae1cd385b42ce04e0";
const TMDB_SEARCH_URL = "https://api.themoviedb.org/3/search/";
const TMDB_REC_URL = "https://api.themoviedb.org/3/";
const OMDB_URL = "https://www.omdbapi.com/?apikey=20106460&t=";
const NUM_OF_RECOMENDATIONS = 4;

const WRAPPER_ELEM = $("#wrapper");
const SIDEKICK_ELEM = $("#sidekick");
const SEARCH_MOVIE_ELEM = $("#current-movie");
const REC_MOVIE_ELEM = $("#rec-movies");

// ============ End Const Section ==============

// ============= Movie Objects ==========
var searchMovie = {};
var relatedMovies = [];

// ========= End Variables Section ==========

// **Note** Remove default on enter press
$("#input-grid").on("submit", function (event) {
  event.preventDefault();
  WRAPPER_ELEM.css("margin-top", "0");
  setTimeout(function () {
    SIDEKICK_ELEM.css("display", "block");
  }, 500);
  relatedMovies = [];
  // **note** Replace movie with value of dropdown
  TmdbSearchByName($("#user-input").val(), $("#user-type").val().toLowerCase());
});

// Function to  search TMDB by name, and type
function TmdbSearchByName(searchTerm, searchType) {
  $.ajax({
    url:
      TMDB_SEARCH_URL +
      searchType +
      "?api_key=" +
      TMDB_API_KEY +
      "&query=" +
      encodeURI(searchTerm),
  })
    .then(function (tmdbSearch) {
      searchMovie = tmdbSearch.results[0];
      TmdbRelated(searchMovie.id, searchType);
    })
    .then(async function () {
      searchMovie = await OmdbSearch(searchTerm, searchType);
      DisplaySearch();
    });
}

// Function To Search TMDB for related content based on id
function TmdbRelated(videoID, searchType) {
  $.ajax({
    url:
      TMDB_REC_URL +
      searchType +
      "/" +
      videoID +
      "/recommendations?api_key=" +
      TMDB_API_KEY +
      "&language=en-US&page=1",
  }).then(async function (tmdbRec) {
    // get movie name
    for (var i = 0; i < NUM_OF_RECOMENDATIONS; i++) {
      if (searchType == "movie") {
        relatedMovies[i] = await OmdbSearch(
          tmdbRec.results[i].title,
          searchType
        );
      } else {
        relatedMovies[i] = await OmdbSearch(
          tmdbRec.results[i].name,
          searchType
        );
      }
    }
    DisplayRelated();
  });
}

// Function that gathers information from OMDB, in returns the object
async function OmdbSearch(videoTitle, searchType) {
  var related;
  if (searchType == "tv") {
    searchType = "series";
  }

  await $.ajax({
    url: OMDB_URL + encodeURI(videoTitle) + "&type=" + searchType,
  }).then(function (omdbSearch) {
    related = omdbSearch;
  });

  return related;
}

function DisplaySearch() {
  SEARCH_MOVIE_ELEM.empty();
  var newPoster = $("<img>").attr("src", searchMovie.Poster);
  newPoster.attr ('data-index', 'search')
    newPoster.on ('click', DisplayModal);
  SEARCH_MOVIE_ELEM.append(newPoster);

}

function DisplayRelated() {
  REC_MOVIE_ELEM.empty();
  for (let i = 0; i < NUM_OF_RECOMENDATIONS; i++) {
    var newPoster = $("<img>").attr("src", relatedMovies[i].Poster);
    newPoster.attr ('data-index', i)
    newPoster.on ('click', DisplayModal);
    
    REC_MOVIE_ELEM.append(newPoster);
  }
}

function DisplayModal() {
  var elemData= $(event.target).attr('data-index');
  var currentObject;
  if (elemData== 'search') {
  currentObject= searchMovie;
  }
  else {
    currentObject= relatedMovies[elemData];
  }
  console.log(currentObject)
}
