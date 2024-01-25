$(document).ready(function() {
// Declare a variable to store the searched city
var sCity = [];

// Variable declaration
var searchForm = document.querySelector('#search-form');
var currentWeatherEl = document.querySelector("#current-weather");
var fiveDayForecast = document.querySelector(".five-day-forecast");
var clearButton = $("#clear-history");
var cityList = document.querySelector("#city-list");
var cityInput = document.querySelector(".city-input");
var searchContainer = document.querySelector(".search-container");
var APIKey = "e8a8374f29bc3187a7b794e86f244acd";

  // Display the current and future weather to the user after grabbing the city from the input text box.
  function displayWeather(event) {
    event.preventDefault();
    const cityName = $(cityInput).val().trim();

    if (cityName !== "") {
      currentWeather(cityName);
      addToList(cityName); // Add the city to the list when displaying weather
      saveToLocalStorage(cityName); // Save the city to local storage
    }
  }

// Function to display current and future weather
function currentWeather(cityName) {
  // Here we build the URL so we can get data from the server side.
  const WeatherMapAPIURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${APIKey}`;

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

// TODO: When the user hits submit, their search is saved to local storage
$(".search-btn").on("click", displayWeather);

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

//Function to save city to local storage
  function saveToLocalStorage(cityName) {
    let storedData = localStorage.getItem("cityName");
    if (storedData === null) {
      sCity = [];
    } else {
      sCity = JSON.parse(storedData);
    }

    sCity.push(cityName);
    localStorage.setItem("cityName", JSON.stringify(sCity));
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
  const storedData = localStorage.getItem("cityName", sCity);
  if (storedData !== null && storedData.trim() !== "") {
    const sCity = JSON.parse(storedData);
    for (let i = 0; i < sCity.length; i+=8) {
      addToList(sCity[i]);
    }
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
$(document).on("click", invokePastSearch);
$(window).on("load", function () {
  loadlastCity();
  $("#error-message").text(""); // Clear error message on page load
  });
document.getElementById('clear-history').onclick = clearHistory; // Click Handler for Clear History
});

  

