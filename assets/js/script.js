// //Declare a variable to store the searched city
var cityName = [];
var citySearch = [];


// variable declaration
var searchForm = document.querySelector('#search-form');
var searchCity = document.querySelector("#search-city");
var currentWeatherEl = document.querySelector("#current-weather");
var fiveDayForecast = document.querySelector(".five-day-forecast");
var searchButton = document.querySelector(".search-btn");
var clearButton = $("#clear-history");
var cityList = document.querySelector("#city-list");
var cityInput = document.querySelector(".city-input");
var searchContainer = document.querySelector(".search-container");

// searches the city to see if it exists in the entries from the storage
function find(c){
  for (var i=0; i<citySearch.length; i++){
      if(c.toUpperCase()=== citySearch[i]){
          return -1;
      }
  }
  return 1;
}
var APIKey = "e8a8374f29bc3187a7b794e86f244acd"; //The API key from OpenWeatherMap 


// Here we build the URL so we can get a data from server side.
function currentWeather (e) {
  e.preventDefault()

  var searchHistory = JSON.parse(localStorage.getItem("citySearch")) || [];
// TODO: When the user hits submit, their search is saved to local storage
 var cityName = cityInput.value.trim(); // Get user entered city and remove extra spaces

 if (searchHistory.includes(cityName) === false) {
  citySearch.push(cityName);
 localStorage.setItem("citySearch", JSON.stringify(citySearch));
 }
  
 localStorage.setItem("cityName", cityName);  // Storing City Name in Local Storage

const WeatherMapAPIURL = `https://api.openweathermap.org/data/2.5/weather?q=` + cityName + "&appid=" + APIKey;
//Get entered city from API response
fetch(WeatherMapAPIURL, {
    method: 'POST',
    body: JSON.stringify({
    foo: "bar"
    })
  }
).then(function (response) {
  console.log("RES: ", response)
    return response.json();
  })
  .then(function (data) {
    console.log(data)
    var lat = data.coord.lat;
    var lon = data.coord.lon;
    const date = dayjs(data.dt*1000).format('M/D/YYYY')
    futureWeather(lat, lon)
    var image = $("<img>");
    image.attr("src", `https://openweathermap.org/img/w/${data.weather[0].icon}.png`); // Weather Icon Image
    $("#current-city").text(`${data.name}`) + $("#date").text(`${date}`) + $("#weather-icon").html(image)// Displays the City Name and Date in Day.JS Format
    $("#temperature").text(`Temp: ${((data.main.temp - 273.15) * 1.80 + 32).toFixed(2)} ℉`) // "Temp: " + data.main.temp
    $("#wind").text(`Wind: ${(data.wind.speed*2.237).toFixed(1)} MPH`) // "Wind: " + data.wind.speed
    $("#humidity").text(`Humidity: ${data.main.humidity} %`) // "Humidity: " + data.main.humidity
  });
}

//Get future weather data from the five day API response
function futureWeather(lat, lon) {

  const FiveDayAPIURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${APIKey}`;

  //Get entered city from the API response
  fetch(FiveDayAPIURL, {
      method: 'POST',
      body: JSON.stringify({
      foo: "bar"
      })
    }

  ).then(function (response) {
      return response.json();   
  })
  .then(function (data) {
  
    // i+=8 is going to get the data of the next day in the array of 40 objects in the five days weather response
    for (let i = 0; i < data.list.length; i+=8) {
   
      console.log("FIVE DAY: ", data.list[i])
      const date = dayjs(data.list[i].dt_txt).format('M/D/YYYY')
        // Creating the five day weather cards
        var card = `
          <div class="card">
            <div class="card-body">
              <p id="fDate1">${date}</p>
              <img src="https://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png"></img>  
              <p>Temp:<span id="fTemp1">${((data.list[i].main.temp - 273.15) * 1.80 + 32).toFixed(2)} ℉</span></p>
              <p>Wind:<span id="fWind1">${(data.list[i].wind.speed*2.237).toFixed(1)} MPH</span></p>
              <p>Humidity:<span id="fHumidity1">${data.list[i].main.humidity} %</span></p>
            </div>
          </div>
          `
    var newDiv = $("<div>");
    newDiv.html(card);
    fiveDayForecast.append(newDiv[0]);
    }
 });
}

//Clear the search history from the page
function clearHistory(event){
  citySearch = [];
  localStorage.removeItem("cityname");

}

//Click Handlers
searchButton.addEventListener("click", currentWeather);


  // TODO: Once that item is saved to local storage, a new button is immediately added to the page
  function rendercityName() {
  cityList.innerHTML = "";
 
  for (var i = 0; i < cityName.length; i+=8) {
    var city = cityName[i];

    var li = document.createElement("li");
    li.textContent = city;
    li.setAttribute("data-index", i);

    var button = document.createElement("button");
    button.textContent = "city";

    li.appendChild(button);
    cityList.appendChild(li);
      currentWeather (e);
  } 
}
// TODO: On page load. Grab all items in local storage, and display buttons on screen.
function init () {
  var storedCitySearch = JSON.parse(localStorage.getItem("citySearch"));// get local storage
   // If city were retrieved from localStorage, update the citySearch array to it
   if (storedCitySearch !== null) {
    citySearch = storedCitySearch;
  }
  
  // render buttons
  for (let city in citySearch) {
    var button = document.createElement("button");
    button.textContent = citySearch[city];
    searchContainer.appendChild(button);
  }
  currentWeather (e);
}


searchForm .addEventListener("submit", function(event) {
  event.preventDefault();

  var cityText = cityInput.value.trim();


});
cityList.addEventListener("click", function(event) {
  var element = event.target;

  // Checks if element is a button
  if (element.matches("button") === true) {
    // Get its data-index value and remove the todo element from the list
    var index = element.parentElement.getAttribute("data-index");
    cityName.splice(index, 1);
    rendercityName();
  }
});

function clearHistory() {
  window.localStorage.removeItem('citySearch');
  window.location.reload();
}
//Click Handlers for Search History
$(document).on("click",rendercityName);
$(window).on("load",init);
document.getElementById('clear-history').onclick = clearHistory;

init()
  

