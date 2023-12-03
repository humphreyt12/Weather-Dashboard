//Declare a variable to store the searched city
var city = "Atlanta";

// variable declaration
var searchFormEl = document.querySelector('#search-form');
var searchCity = $("#search-city");
var searchButton = $("#search-button");
var currentCity = $("#current-city");
var currentTemperature = $("#temperature");
var currentHumidty= $("#humidity");
var currentWind=$("#wind");
var fiveDayForcast = $(".five-day-forcast")
var weatherIcon = $("#weather-icon")

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
//function currentWeather(city){
var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
fetch(queryURL, {
    method: 'GET', //GET is the default.
    credentials: 'same-origin', // include, *same-origin, omit
    redirect: 'follow', // manual, *follow, error
}).then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data)
    // 
    var image = $("<img>");
    image.attr("src", `https://openweathermap.org/img/w/${data.weather[0].icon}.png`);
    weatherIcon.html(image)
    currentTemperature.text(`Temp: ${data.main.temp}`) // "Temp: " + data.main.temp
  });



    // parse the response to display the current weather including the City name. the Date and the weather icon. 
//console.log(response);


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

var arr = [
    {
        temp: 44,
        wind: "34mph",
        humidty: 45
    },
    {
        temp: 42,
        wind: "24mph",
        humidty: 55
    },
    {
        temp: 66,
        wind: "50mph",
        humidty: 15
    },
    {
        temp: 25,
        wind: "77mph",
        humidty: 95
    },
    {
        temp: 34,
        wind: "22mph",
        humidty: 11
    },
]


// for (let i = 0; i < 40; i+=8) { // i+=8 is going to get the data of the next day in the array of 40 objects in the five days weather response
for (let i = 0; i < arr.length; i++) { 
    var card = `
    <div class="card">
      <div class="card-body">
        <p id="fDate1"></p>
        <p id="fImg1"></p>
        <p>Temp:<span id="fTemp1">${arr[i].temp}</span></p>
        <p>Wind:<span id="fWind1">${arr[i].wind}</span></p>
        <p>Humidity:<span id="fHumidity1">${arr[i].humidty}</span></p>
        <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p>
      </div>
    </div>
    `
    var newDiv = $("<div>");
    newDiv.html(card);
    fiveDayForcast.append(newDiv);
}
//Click Handlers
$("#search-button").on("click",displayWeather);

//searchFormEl.addEventListener('submit', handleSearchFormSubmit);



