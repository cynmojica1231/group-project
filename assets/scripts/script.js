// TMDb api call search:
// https://api.themoviedb.org/3/search/movie?api_key={api_key}&query=Jack+Reacher
// TMDb api call recommendations
// https://api.themoviedb.org/3/movie/75780/recommendations?api_key=f83bba844914e64ae1cd385b42ce04e0&language=en-US&page=1

// OMDb api call example:
// http://www.omdbapi.com/?apikey=20106460&t=the+princess+bride

// ========= variables section ==============

// =============== Trusworthy Array ==============

var TRUST_MOVIE_ARRAY = [ 11, 12, 13, 18, 22, 58, 62, 65, 73, 77, 78, 85, 87, 95, 98, 101, 103, 105, 106, 115, 118, 120, 121, 122, 155, 185, 189, 197, 217, 218, 238, 254, 268, 272, 275, 277, 278, 280, 285, 311, 348, 350, 377, 408, 411, 425, 489, 500, 521, 585, 578, 601, 597, 604, 608, 564, 559, 550, 602, 607, 557, 603, 620, 640, 646, 621, 671, 673, 675, 680, 672, 674, 679, 694, 747, 752, 755, 767, 782, 786, 812, 808, 813, 809, 807, 862, 926, 955, 948, 954, 949, 1368, 1635, 1648, 1637, 1726, 1893];
var TRUST_TV_ARRAY = [];

// ============= Const Section ==============

const TMDB_API_KEY = "f83bba844914e64ae1cd385b42ce04e0";
const TMDB_SEARCH_URL = "https://api.themoviedb.org/3/search/";
const TMDB_REC_URL = "https://api.themoviedb.org/3/";
const OMDB_URL = "https://www.omdbapi.com/?apikey=20106460&t=";
const NUM_OF_RECOMENDATIONS = 4;

// Main HTML Element references
const WRAPPER_ELEM = $("#wrapper");
const SIDEKICK_ELEM = $("#sidekick");
const SEARCH_MOVIE_ELEM = $("#current-movie");
const REC_MOVIE_ELEM = $("#rec-movies");
const SEARCH_ELEM = $("#user-input");
const SEARCH_TYPE_ELEM = $("#user-type");

// Modal Element References
const MOVIE_MODAL_ELEM = $("#movie-modal");
const MODAL_TITLE_ELEM = $("#modal-title");
const MODAL_POSTER_ELEM = $("#modal-poster");
const MODAL_DIRECTOR_ELEM = $("#modal-director");
const MODAL_ACTORS_ELEM = $("#modal-actors");
const MODAL_RUNTIME_ELEM = $("#modal-runtime");
const MODAL_RATED_ELEM = $("#modal-rated");
const MODAL_IMDB_RATING_ELEM = $("#modal-rating");
const MODAL_PLOT_ELEM = $("#modal-plot");

// ============ End Const Section ==============

// ============= Movie Objects ==========
var searchMovie = {};
var relatedMovies = [];

// ========= End Variables Section ==========

//  Initialize Foundations for modal display functionality
$(document).foundation();

$("#input-grid").on("submit", function (event) {
  event.preventDefault();

  // Setting up values in their correct format
  var searchValue = SEARCH_ELEM.val().trim().toLowerCase();
  var searchType = SEARCH_TYPE_ELEM.val().toLowerCase();
  
  // If user has nothing in search bar we want to do nothing
  if(searchValue == "")
  {
    return;
  }

  // Start animating the search div to top of screen
  WRAPPER_ELEM.css("margin-top", "0");
  setTimeout(function () {
    SIDEKICK_ELEM.css("display", "block");
  }, 100);

  // Check if the search exists in cache
  if(!CheckForCache(searchValue, searchType))
  {
    relatedMovies = [];
    TmdbSearchByName(searchValue, searchType);
  }
  else
  {
    LoadCache(searchValue, searchType);
    DisplaySearch();
    DisplayRelated();
  }

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
  console.log(videoID);
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
    CacheSearch(SEARCH_ELEM.val().trim().toLowerCase(), searchType);
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

// Displays the information about the searched movie
function DisplaySearch() {
  SEARCH_MOVIE_ELEM.empty();
  var newPoster = $("<img>").attr("src", searchMovie.Poster);
  newPoster.attr ('data-index', 'search')
  newPoster.attr('data-open', 'movie-modal');
  newPoster.on ('click', DisplayModal);
  SEARCH_MOVIE_ELEM.append(newPoster);
}

// Displays the information about the related movies
function DisplayRelated() {
  REC_MOVIE_ELEM.empty();
  for (let i = 0; i < NUM_OF_RECOMENDATIONS; i++) {
    var newPoster = $("<img>").attr("src", relatedMovies[i].Poster);
    newPoster.attr('data-index', i)
    newPoster.attr('data-open', 'movie-modal');
    newPoster.on('click', DisplayModal);
    REC_MOVIE_ELEM.append(newPoster);
  }
}

function DisplayModal() {
  var elemData= $(event.target).attr('data-index');
  var currentObject;
  if (elemData== 'search') {
  currentObject = searchMovie;
  }
  else {
    currentObject = relatedMovies[elemData];
  }
  
  // Set Poster Image
  MODAL_POSTER_ELEM.attr('src',currentObject.Poster)
  // Set Director
  MODAL_DIRECTOR_ELEM.text('Director: ' + currentObject.Director)
  // Set Actors
  MODAL_ACTORS_ELEM.text('Actors: ' + currentObject.Actors)
  // Title
  MODAL_TITLE_ELEM.text(currentObject.Title + ' (' + currentObject.Year + ')')
  // Set Rating
  MODAL_RATED_ELEM.text('Rated: ' + currentObject.Rated)
  // Set IMDB rating
  MODAL_IMDB_RATING_ELEM.text('IMDB rating: ' + currentObject.imdbRating)
  // Set Plot
  MODAL_PLOT_ELEM.text(currentObject.Plot)

}

// Saves the current objects into local storage based on search term and search type
function CacheSearch(searchTerm, searchType)
{
  localStorage.setItem(searchTerm + "|Search|" + searchType.toLowerCase(), JSON.stringify(searchMovie));
  localStorage.setItem(searchTerm + "|Related|" + searchType.toLowerCase(), JSON.stringify(relatedMovies));
}

// Sets the objects from local storage based on search term and search type
function LoadCache(searchTerm, searchType)
{
  searchMovie = JSON.parse(localStorage.getItem(searchTerm + "|Search|" + searchType.toLowerCase()));
  relatedMovies = JSON.parse(localStorage.getItem(searchTerm + "|Related|" + searchType.toLowerCase()));
}

// Call this function before trying to load the cache, It will return true or false if the search exists
function CheckForCache(searchTerm, searchType)
{
  if(JSON.parse(localStorage.getItem(searchTerm + "|Search|" + searchType.toLowerCase()) === null))
  return false;

  return true;
}

function StoreGoodID(id, searchType)
{

}

$("#trust-button").on("click", function()
{
  TRUST_MOVIE_ARRAY = [];
  for(var i=0; i< 2000; i++)
  {
    GetValidSearch(i,"tv");
  }

  console.log(TRUST_MOVIE_ARRAY);

});

function GetValidSearch(index, searchType) {
  console.log("https://api.themoviedb.org/3/" +
  searchType +
  "/" +
  index +
  "?api_key=" +
  TMDB_API_KEY +
  "&language=en-US");
  $.ajax({
    url:
    "https://api.themoviedb.org/3/" +
      searchType +
      "/" +
      index +
      "?api_key=" +
      TMDB_API_KEY +
      "&language=en-US",
  })
    .fail(function (){
      return;
    })
    .then(function(tmdbSearch) {

      if(tmdbSearch.id === null)
      {
        console.log("No id");
        return;
      }

      if(tmdbSearch.spoken_languages[0].iso_639_1 != "en")
      {
        console.log("Not english");
        return;
      }

      if(parseInt( tmdbSearch.popularity) <= 20)
      {
        console.log("low pop");
        return;
      }

      TRUST_MOVIE_ARRAY.push(index);
    })

    
    
  }
