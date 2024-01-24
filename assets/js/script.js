// Declare a variable to store the searched city
var sCity = [];
var citySearch = [];
var cityName = "";
// Variable declaration
var searchForm = document.querySelector('#search-form');
var currentWeatherEl = document.querySelector("#current-weather");
var fiveDayForecast = document.querySelector(".five-day-forecast");
var clearButton = $("#clear-history");
var cityList = document.querySelector("#city-list");
var cityInput = document.querySelector(".city-input");
var searchContainer = document.querySelector(".search-container");

function displayWeather(event) {
  event.preventDefault();
  var cityNameInput = document.getElementById('search-input').value.trim();
  if (cityNameInput !== "") {
    cityName = cityNameInput;
    currentWeather(cityName);
  }
}

// Function to display current and future weather
function currentWeather(cityName) {
  console.log("City Name Before Trim:", cityName);

  // Check if cityName is a string and not empty before making the API request
  if (typeof cityName !== 'string' || cityName.trim() === '') {
      console.error("Invalid city name. Please enter a valid city name.");
      // Display an error message to the user or take appropriate action
      return;
  }

  // Here we build the URL so we can get data from the server side.
  const WeatherMapAPIURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=e8a8374f29bc3187a7b794e86f244acd`;

  console.log("API Request URL:", WeatherMapAPIURL); // Add this line for debugging


  // Get entered city from API response
  fetch(WeatherMapAPIURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.cod === '400') {
        console.error("Error in API response:", data.message);
        return;
      }

      var lat = data.coord.lat;
      var lon = data.coord.lon;
      const date = dayjs(data.dt * 1000).format('M/D/YYYY');
      futureWeather(lat, lon);
      var image = $("<img>");
      image.attr("src", `https://openweathermap.org/img/w/${data.weather[0].icon}.png`);
      $("#current-city").text(`${data.name}`) + $("#date").text(`${date}`) + $("#weather-icon").html(image);
      $("#temperature").text(`Temp: ${((data.main.temp - 273.15) * 1.80 + 32).toFixed(2)} ℉`);
      $("#wind").text(`Wind: ${(data.wind.speed * 2.237).toFixed(1)} MPH`);
      $("#humidity").text(`Humidity: ${data.main.humidity} %`);
    })
    .catch(function (error) {
      console.error("Error in fetch:", error);
    });
  }

// TODO: When the user hits submit, their search is saved to local storage
var cityName = document.getElementById('search-input').value.trim();
localStorage.setItem("cityName", JSON.stringify(cityName));  // Storing City Name in Local Storage

// Function to get future weather data from the five day API response
function futureWeather(lat, lon) {
  const FiveDayAPIURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=e8a8374f29bc3187a7b794e86f244acd`;

  // Get entered city from the API response
  fetch(FiveDayAPIURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      for (let i = 0; i < data.list.length; i += 8) {
        const date = dayjs(data.list[i].dt_txt).format('M/D/YYYY');
        var card = `
          <div class="card">
            <div class="card-body">
              <p id="fDate1">${date}</p>
              <img src="https://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png"></img>  
              <p>Temp:<span id="fTemp1">${((data.list[i].main.temp - 273.15) * 1.80 + 32).toFixed(2)} ℉</span></p>
              <p>Wind:<span id="fWind1">${(data.list[i].wind.speed * 2.237).toFixed(1)} MPH</span></p>
              <p>Humidity:<span id="fHumidity1">${data.list[i].main.humidity} %</span></p>
            </div>
          </div>
          `;
        var newDiv = $("<div>");
        newDiv.html(card);
        fiveDayForecast.append(newDiv[0]);
      }
    });
}

// Function to dynamically add the passed city as a button in the search history
function addToList(c) {
  const buttonEl = $("<button>" + c.toUpperCase() + "</button>");
  $(buttonEl).attr("class", "city-button");
  $(buttonEl).attr("data-value", c.toUpperCase());
  $(".city-list").append(buttonEl);
}

// Function to display the past search again when the city button is clicked in search history
function invokePastSearch(event) {
  const buttonEl = event.target;
  if (event.target.matches(".city-button")) {
    const cityName = buttonEl.textContent.trim();
    currentWeather(cityName);
  }
}

// Function to render the last city
function loadlastCity() {
  $("ul").empty();
  const storedData = localStorage.getItem("cityName", cityName);

   
      for (let i = 0; i < sCity.length; i++) {
        addToList(sCity[i]);
        cityName = sCity[i];
      }
      currentWeather(cityName);
    } 
  

// Function to clear the search history from the page
function clearHistory(event) {
  event.preventDefault();
  sCity = [];
  localStorage.removeItem("cityName");
  document.location.reload();
}

// Click Handlers
$(".search-btn").on("click", displayWeather);

$(document).on("click", invokePastSearch);
$(window).on("load", function () {
  loadlastCity();
  $("#error-message").text(""); // Clear error message on page load
});
document.getElementById('clear-history').onclick = clearHistory; // Click Handler for Clear History



  

