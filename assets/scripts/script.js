// TMDb api call search:
// https://api.themoviedb.org/3/search/movie?api_key={api_key}&query=Jack+Reacher
// TMDb api call recommendations
// https://api.themoviedb.org/3/movie/75780/recommendations?api_key=f83bba844914e64ae1cd385b42ce04e0&language=en-US&page=1

// OMDb api call example:
// http://www.omdbapi.com/?apikey=20106460&t=the+princess+bride


var tmdbSearchURL =  "https://api.themoviedb.org/3/search/movie?api_key=f83bba844914e64ae1cd385b42ce04e0&query=";
var tmdbRecURL = "https://api.themoviedb.org/3/movie/";
var omdbURL = "http://www.omdbapi.com/?apikey=20106460&t=";

userInput = "fight+club";

$.ajax({
  url: tmdbSearchURL + userInput
}).then(function(tmdbSearch) {
    var movieID = tmdbSearch.results[0].id;
    $.ajax({
        url: tmdbRecURL + movieID + "/recommendations?api_key=f83bba844914e64ae1cd385b42ce04e0&language=en-US&page=1"
    }).then(function(tmdbRec) {
        console.log(tmdbRec.results);
    });
});