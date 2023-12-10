//Declare a variable to store the searched city
var city = "Tampa";
const cityInput = document.querySelector(".city-input");
//var futureWeather = document.querySelector("#future-weather");

// variable declaration
var searchFormEl = document.querySelector('#search-form');
var searchCity = $("#search-city");
var searchButton = $("#search-button");
var currentCity = $("#current-city");
var currentTemperature = $("#temperature");
var currentHumidty= $("#humidity");
var currentWind = $("#wind");
var fiveDayForcast = $(".five-day-forcast")
var weatherIcon = $("#weather-icon")

var searchButton = document.querySelector(".search-btn");


var APIKey = "e8a8374f29bc3187a7b794e86f244acd"; //The API key from OpenWeatherMap 

// Here we build the URL so we can get a data from server side.
//function currentWeather(city){
const queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;
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
    image.attr("src", `https://openweathermap.org/img/w/${data.weather[0].icon}.png`); // Weather Icon Image
    weatherIcon.html(image)
    currentCity.text(`${data.name}`) + dayjs().format('MM/DD/YYYY'); // Displays the City Name and JS Format
    currentTemperature.text(`Temp: ${data.main.temp}`) // "Temp: " + data.main.temp
    currentWind.text(`Wind: ${data.wind.deg}`) // "Wind: " + data.wind.deg
    currentHumidty.text(`Humidity: ${data.main.humidity}`) // "Humidity: " + data.main.humidity
  });



// parse the response to display the current weather including the City name. the Date and the weather icon. 

// Display the curent and future weather to the user after grabing the city form the input text box.
// function displayWeather(event){
//     event.preventDefault();
//     if(searchCity.val().trim()!==""){
//         city=searchCity.val().trim();
//         currentWeather(city);
//     }
// } 


const futureWeather = () => {
    const cityName = cityInput.value.trim(); // Get user entered city and remove extra spaces
    localStorage.setItem("cityName", cityName);  // Storing City Input in Local Storage
    if(!cityName) return;  //Return if cityName is empty
    const FiveDayAPIURL = "api.openweathermap.org/data/2.5/forecast?q=${cityName}lat={lat}&lon={lon}&appid={e8a8374f29bc3187a7b794e86f244acd}"

//Get entered city from the API response
fetch(FiveDayAPIURL, {
    method: 'GET', //GET is the default.
    credentials: 'same-origin', // include, *same-origin, omit
    redirect: 'follow', // manual, *follow, error
}).then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data)
  });
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
      </div>
    </div>
    `

    var newDiv = $("<div>");
    newDiv.html(card);
    fiveDayForcast.append(newDiv);
}


//Click Handlers
//searchButton.addEventListener("click",displayWeather);
$("#search-button").on("click",futureWeather);




