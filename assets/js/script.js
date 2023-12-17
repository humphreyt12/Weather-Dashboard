// //Declare a variable to store the searched city
var cityName = '';


var currentWeatherEl = document.querySelector("#current-weather");
// variable declaration
var searchFormEl = document.querySelector('#search-form');
var searchCity = document.querySelector("#search-city");
var fiveDayForcast = document.querySelector(".five-day-forcast")
// var weatherIcon = $("#weather-icon")

var searchButton = document.querySelector(".search-btn");

var cityInputvalue = document.querySelector(".city-input");
var APIKey = "e8a8374f29bc3187a7b794e86f244acd"; //The API key from OpenWeatherMap 

// Here we build the URL so we can get a data from server side.
function currentWeather (e) {
  e.preventDefault()
  var cityName = cityInputvalue.value; // Get user entered city and remove extra spaces
  localStorage.setItem("cityName", cityName);  // Storing City Input in Local Storage

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
    futureWeather(lat, lon)
    var image = $("<img>");
    image.attr("src", `https://openweathermap.org/img/w/${data.weather[0].icon}.png`); // Weather Icon Image
    $("#weather-icon").html(image)
    $("#current-city").text(`${data.name}`) + dayjs().format('MM/DD/YYYY'); // Displays the City Name and JS Format
    $("#temperature").text(`Temp: ${data.main.temp}`) // "Temp: " + data.main.temp
    $("#wind").text(`Wind: ${data.wind.deg}`) // "Wind: " + data.wind.deg
    $("#humidity").text(`Humidity: ${data.main.humidity}`) // "Humidity: " + data.main.humidity
  });
}
// parse the response to display the current weather including the City name. the Date and the weather icon. 

// Display the curent and future weather to the user after grabing the city form the input text box.
// function displayWeather(event){
//     event.preventDefault();
//     if(searchCity.val().trim()!==""){
//         city=searchCity.val().trim();
//         currentWeather(city);
//     }
// } 


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
        var card = `
          <div class="card">
            <div class="card-body">
              <p id="fDate1">${data.list[i].dt_txt}</p>
              <p id="fImg1"></p>
              <p>Temp:<span id="fTemp1">${data.list[i].main.temp}</span></p>
              <p>Wind:<span id="fWind1">${data.list[i].wind.deg}</span></p>
              <p>Humidity:<span id="fHumidity1">${data.list[i].main.humidity}</span></p>
            </div>
          </div>
          `
   
    var newDiv = $("<div>");
    newDiv.html(card);
    fiveDayForcast.append(newDiv);
    
    }
 });
}

//Click Handlers
searchButton.addEventListener("click", currentWeather);





