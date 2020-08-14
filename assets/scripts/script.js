// TMDb api call search:
// https://api.themoviedb.org/3/search/movie?api_key={api_key}&query=Jack+Reacher
// TMDb api call recommendations
// https://api.themoviedb.org/3/movie/75780/recommendations?api_key=f83bba844914e64ae1cd385b42ce04e0&language=en-US&page=1

// OMDb api call example:
// http://www.omdbapi.com/?apikey=20106460&t=the+princess+bride

// ========= variables section ==============

// ============= Const Section ==============

const TMDB_API_KEY = "f83bba844914e64ae1cd385b42ce04e0";
const TMDB_SEARCH_URL = "https://api.themoviedb.org/3/search/";
const TMDB_REC_URL = "https://api.themoviedb.org/3/";
const OMDB_URL = "http://www.omdbapi.com/?apikey=20106460&t=";
const NUM_OF_RECOMENDATIONS = 2;

// ============ End Const Section ==============

// ============= Movie Objects ==========
var searchMovie = {};
var relatedMovies = [];


// ========= End Variables Section ==========

// **Note** Remove defult on enter press
$("#input-grid").on("submit", function(event)
{
  event.preventDefault();
  console.log($("#user-type").val());
  relatedMovies = [];
  // **note** Replace movie with value of dropdown
  TmdbSearchByName($("#user-input").val(), $("#user-type").val().toLowerCase());
});

// Function to  search TMDB by name, and type
function TmdbSearchByName(searchTerm, searchType) {
console.log(TMDB_SEARCH_URL);
  $.ajax({
    url: TMDB_SEARCH_URL + searchType + "?api_key=" + TMDB_API_KEY + "&query=" + encodeURI(searchTerm),
  }).then(function (tmdbSearch) {
    searchMovie = tmdbSearch.results[0];
    console.log(tmdbSearch);
    TmdbRelated(searchMovie.id, searchType);
  }).then(async function()
  {
    searchMovie = await OmdbSearch(searchTerm,searchType);
    console.log("Second Then!");
    console.log(searchMovie);
  });
  
}

// Function To Search TMDB for related content based on id
function TmdbRelated(videoID, searchType) {
  $.ajax({
    url: TMDB_REC_URL + searchType +"/" + videoID + "/recommendations?api_key=" + TMDB_API_KEY + "&language=en-US&page=1",
  }).then(async function (tmdbRec) {
    // get movie name
    for (var i = 0; i < NUM_OF_RECOMENDATIONS; i++) {
      if(searchType == "movie")
      {
        relatedMovies[i] = await OmdbSearch(tmdbRec.results[i].title, searchType);
      }
      else
      {
        relatedMovies[i] = await OmdbSearch(tmdbRec.results[i].name, searchType);
      }
    } 
    console.log(relatedMovies);
  });
}

// Function that gathers information from OMDB, and saves that information in related movies array
async function OmdbSearch(videoTitle, searchType) {
  var related;
  if(searchType == "tv")
  {
    searchType = "series";
  }

  await $.ajax({
    url: OMDB_URL + encodeURI(videoTitle) + "&type=" + searchType,
  }).then(function (omdbSearch) {
    console.log(omdbSearch);
    related = omdbSearch;
  });

  return related;
}

function DisplaySearch() {

}
