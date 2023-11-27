//Declare a variable to store the searched city
var city = "";

// variable declaration
var searchCity = $("#search-city");
var searchButton = $("#search-button");
var currentCity = $("#current-city");
var currentTemperature = $("#temperature");
var currentHumidty= $("#humidity");
var currentWind=$("#wind");

var sCity=[];

// searches the city to see if it exists in the entries from the storage
function find(c){
    for (var i=0; i<sCity.length; i++){
        if(c.toUpperCase()===sCity[i]){
            return -1;
        }
    }
    return 1;
}
//Set up the API key
var APIKey = "e8a8374f29bc3187a7b794e86f244acd";


// Here we build the URL so we can get a data from server side.
function currentWeather(city){
var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
fetch(queryURL)


.then(function (response) {
    return response.json();
  })
  .then(function (data) {
    for (var i = 0; i < data.length; i++) {
      var listItem = document.createElement('li');
      listItem.textContent = data[i].html_url;
      repoList.appendChild(listItem);
    }
    // parse the response to display the current weather including the City name. the Date and the weather icon. 
console.log(response);
  });
}

// Display the curent and future weather to the user after grabing the city form the input text box.
function displayWeather(event){
    event.preventDefault();
    if(searchCity.val().trim()!==""){
        city=searchCity.val().trim();
        currentWeather(city);
    }
} 
// render function
function loadlastCity(){
    $("ul").empty();
    var sCity = JSON.parse(localStorage.getItem("cityname"));
    if(sCity!==null){
        sCity=JSON.parse(localStorage.getItem("cityname"));
        for(i=0; i<sCity.length;i++){
            addToList(sCity[i]);
        }
        city=sCity[i-1];
        currentWeather(city);
    }

}
//Click Handlers
$("#search-button").on("click",displayWeather);