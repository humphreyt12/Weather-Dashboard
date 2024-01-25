$(document).ready(function() {
// Declare a variable to store the searched city
var sCity = [];

// Variable declaration
var searchForm = document.querySelector('#search-form');
var currentWeatherEl = document.querySelector("#current-weather");
var fiveDayForecast = $(".five-day-forecast");
var clearButton = $("#clear-history");
var cityList = $(".city-list");
var cityInput = document.querySelector(".city-input");
var searchContainer = document.querySelector(".search-container");
var APIKey = "e8a8374f29bc3187a7b794e86f244acd";

// Function to display current and future weather
function displayWeather(event) {
  event.preventDefault();
  var cityInputValue = cityInput.value.trim();
  if (cityInputValue !== "") {
    cityName = cityInputValue;
    currentWeather(cityName);
  }
}

// Function to display current and future weather
function currentWeather(cityName) {
  console.log(cityName);
  addToList(cityName);
  // Here we build the URL so we can get data from the server side.
  const WeatherMapAPIURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${APIKey}`;

 // Clear existing forecast before appending new content
 fiveDayForecast.html('');
 
  // Get entered city from API response
  fetch(WeatherMapAPIURL) 
    .then((response) => response.json())
    .then((data) => {
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

// Function to get future weather data from the five day API response
function futureWeather(lat, lon) {
  const FiveDayAPIURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=e8a8374f29bc3187a7b794e86f244acd`;

  // Get entered city from the API response
  fetch(FiveDayAPIURL)
    .then(function (response) {
      console.log(response);
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
// Function to display the past search again when the city button is clicked in search history
function invokePastSearch(event) {
  const buttonEl = event.target;
  if (event.target.matches(".city-button")) {
    const cityName = buttonEl.textContent.trim();
    currentWeather(cityName);
  }
}

// Function to save city to local storage
function saveToLocalStorage(cityName) {
  let storedData = localStorage.getItem("cityName");
  if (storedData === null) {
    sCity = [];
  } else {
    sCity = JSON.parse(storedData);
  }

  sCity.push(cityName);
  localStorage.setItem("cityName", JSON.stringify(sCity)); // Corrected line
}

// Function to dynamically add the passed city as a button in the search history
function addToList(c) {
  const buttonEl = $("<button>" + c.toUpperCase() + "</button>");
  $(buttonEl).attr("class", "city-button");
  $(buttonEl).attr("data-value", c.toUpperCase());
  cityList.append(buttonEl); // Corrected line
}

// Function to render the last city
function loadlastCity() {
  $("ul").empty();
  const storedData = localStorage.getItem("cityName");
  
  if (storedData !== null && storedData.trim() !== "") {
    const sCity = JSON.parse(storedData);

    sCity.forEach(city => {
      addToList(city);
    });

    // Display the weather for the last city in the array
    currentWeather(sCity[sCity.length - 1]);
  }
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
$(document).on("click", ".city-button", invokePastSearch);
$(document).on("click", "#clear-history", clearHistory);
$(window).on("load", function () {
  loadlastCity();
  $("#error-message").text(""); // Clear error message on page load
  });
});

  

