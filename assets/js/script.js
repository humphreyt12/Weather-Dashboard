var APIKey = "e8a8374f29bc3187a7b794e86f244acd";

var city;

var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + APIKey;

fetch(queryURL);