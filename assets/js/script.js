// //Declare a variable to store the searched city
var cityName = [];
var citySearch = [];

var currentWeatherEl = document.querySelector("#current-weather");
// variable declaration
var searchFormEl = document.querySelector('#search-form');
var searchCity = document.querySelector("#search-city");
var fiveDayForecast = document.querySelector(".five-day-forecast")
// var weatherIcon = $("#weather-icon")

var searchButton = document.querySelector(".search-btn");
var cityInput = document.querySelector(".city-input");
var APIKey = "e8a8374f29bc3187a7b794e86f244acd"; //The API key from OpenWeatherMap 


// Here we build the URL so we can get a data from server side.
function currentWeather (e) {
  e.preventDefault()

// TODO: When the user hits submit, their search is saved to local storage
 var cityName = cityInput.value.trim(); // Get user entered city and remove extra spaces
citySearch.push(cityName);
 localStorage.setItem("citySearch", JSON.stringify(citySearch));
  
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
    $("#temperature").text(`Temp: ${data.main.temp} ℉`) // "Temp: " + data.main.temp
    $("#wind").text(`Wind: ${data.wind.deg} °`) // "Wind: " + data.wind.deg
    $("#humidity").text(`Humidity: ${data.main.humidity} %`) // "Humidity: " + data.main.humidity
  });
}

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

        var card = `
          <div class="card">
            <div class="card-body">
              <p id="fDate1">${date}</p>
              <img src="https://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png"></img>  
              <p>Temp:<span id="fTemp1">${data.list[i].main.temp} ℉</span></p>
              <p>Wind:<span id="fWind1">${data.list[i].wind.deg} °</span></p>
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

//Click Handlers
searchButton.addEventListener("click", currentWeather);

// TODO: On page load. Grab all items in local storage, and display buttons on screen.
function init () {
  var storedCitySearch = JSON.parse(localStorage.getItem("citySearch"));// get local storage
console.log(storedCitySearch);

  // If city were retrieved from localStorage, update the citySearch array to it
  if (storedCitySearch !== null) {
    citySearch = storedCitySearch;
  }
  // render buttons
  var button = document.createElement("button");// TODO: Once that item is saved to local storage, a new button is immediately added to the page
  button.textContent = cityName;
  
  var li = document.createElement("li");
  li.textContent = citySearch;

  li.appendChild(button);
  cityName.appendChild(li);
}
  // storeCitySearch();
  // renderCityName();
init()
  