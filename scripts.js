/*global $ navigator DARKSKYAPI OPENAPI GOOGLEAPI*/
// degrees celcius - &#8451;


var locate = {
    coords: {
        lat: "",
        long: ""
    },
    address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
    },
    getCoords: function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                locate.coords.lat = position.coords.latitude;
                locate.coords.long = position.coords.longitude;
                locate.getZipCode();
                weather.currentWeather();
                // weather.forecastWeather();

            });
        }
        else {
            alert("Not Supported");
        }
    },
    displayLocation: function() {
        // document.getElementById("coordLat").innerHTML = "Latitude: " + locate.coords.lat;
        // document.getElementById("coordLong").innerHTML = "Longitude: " + locate.coords.long;
        // document.getElementById("address1").innerHTML = locate.address.street;
        document.getElementById("title").innerHTML = locate.address.city + " " + locate.address.state + ", " + locate.address.zipCode;
    },
    getZipCode: function() {
        $.ajax({
            url: "https://maps.googleapis.com/maps/api/geocode/json",
            data: { latlng: locate.coords.lat + "," + locate.coords.long, key: GOOGLEAPI },
            success: function(data) {
                // console.log(data);
                locate.address.street = data.results[0].address_components[0].short_name + " " + data.results[0].address_components[1].short_name;
                locate.address.city = data.results[0].address_components[3].short_name;
                locate.address.state = data.results[0].address_components[5].short_name;
                locate.address.zipCode = data.results[0].address_components[7].short_name;
                locate.displayLocation();
            }
        });
    },
    getCoordsSearch: function() {
        var searchedAddress = document.getElementById("searchBar").value;
        console.log(searchedAddress);
        $.ajax({
            url: "https://maps.googleapis.com/maps/api/geocode/json",
            data: { address: searchedAddress, key: GOOGLEAPI },
            success: function(data) {
                // console.log(data)
                // console.log(data.results[0].geometry.location.lat);
                locate.coords.lat = data.results[0].geometry.location.lat;
                locate.coords.long = data.results[0].geometry.location.lng;
                weather.currentWeather()
            }

        });
    }
};

var weather = {
    today: {
        temp: "",
        cTemp: "",
        highTemp: "",
        cHighTemp: "",
        lowTemp: "",
        cLowTemp: "",
        conditions: "",
        windSpeed: "",
        cWindSpeed: "",
        humidity: "",
        id: "",
        icon: "",
        iconLink: "https://openweathermap.org/img/w/"
    },
    backgroundImg: {
        thunder: "https://images.unsplash.com/photo-1504466664756-1adbe6d13b36?auto=format&fit=crop&w=1050&q=80&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D",
        drizzle: "https://bloximages.chicago2.vip.townnews.com/cumberlink.com/content/tncms/assets/v3/editorial/c/2b/c2b35358-b107-11e2-96e6-001a4bcf887a/517ed1e66451c.image.jpg",
        rain: "https://images.unsplash.com/photo-1438449805896-28a666819a20?auto=format&fit=crop&w=1050&q=80&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D",
        snow: "https://images.unsplash.com/photo-1427955569621-3e494de2b1d2?auto=format&fit=crop&w=1050&q=80&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D",
        atmosphere: "https://images.unsplash.com/photo-1415347373860-1f2049f610ce?auto=format&fit=crop&w=1050&q=80&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D",
        clear: "https://images.unsplash.com/photo-1504321946642-8f661bf96ff0?auto=format&fit=crop&w=1050&q=80&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D",
        clouds: "https://images.unsplash.com/photo-1500113018993-b5c64275ed93?auto=format&fit=crop&w=634&q=80&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D"
    },
    currentWeather: function() {
        var that = this;

        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/weather",
            data: { lat: locate.coords.lat, lon: locate.coords.long, units: "imperial", APPID: OPENAPI },
            dataType: "json",
            success: function(data) {
                // console.log(data.weather[0].id);
                that.today.temp = (data.main.temp.toFixed(1));
                that.today.highTemp = data.main.temp_max;
                that.today.lowTemp = data.main.temp_min;
                that.today.conditions = data.weather[0].description;
                that.today.icon = data.weather[0].icon;
                that.today.windSpeed = data.wind.speed;
                that.today.humidity = data.main.humidity;
                that.today.id = data.weather[0].id;
                that.today.cTemp = (that.today.temp - 32 * (5 / 9)).toFixed(1);
                that.today.cHighTemp = (that.today.highTemp - 32 * (5 / 9)).toFixed(1);
                that.today.cLowTemp = (that.today.lowTemp - 32 * (5 / 9)).toFixed(1);
                that.today.cWindSpeed = (that.today.windSpeed * 1.60934).toFixed(1);
                that.displayWeather();
                that.backgroundWeather();
            }
        });
    },


    displayWeather: function() {
        // document.getElementById("currentImg").src = this.today.iconLink + this.today.icon + ".png";
        document.getElementById("todayHumidity").innerHTML = 'Humidity: ' + this.today.humidity + "%";
        document.getElementById("weatherDescription").innerHTML = this.today.conditions;
        document.getElementById("weatherIcon").innerHTML = '<i class="wi wi-owm-' + this.today.id + '"></i>'

        if (document.getElementById("radioF").checked) {
            document.getElementById("currentTemp").innerHTML = this.today.temp + " &#8457;";
            document.getElementById("todayLow").innerHTML = "Low: " + this.today.lowTemp + " &#8457;";
            document.getElementById("todayHi").innerHTML = "High: " + this.today.highTemp + " &#8457;";
            document.getElementById("todayWind").innerHTML = "Wind: " + this.today.windSpeed + " mph";
        }
        else if (document.getElementById("radioC").checked) {
            document.getElementById("currentTemp").innerHTML = this.today.cTemp + " &#8451;";
            document.getElementById("todayLow").innerHTML = "Low: " + this.today.cLowTemp + " &#8451;";
            document.getElementById("todayHi").innerHTML = "High: " + this.today.cHighTemp + " &#8451;";
            document.getElementById("todayWind").innerHTML = "Wind: " + this.today.cWindSpeed + " kph";
        }

    },
    backgroundWeather: function() {
        var x = this.today.id;
        var y = document.getElementById("weatherWell");
        console.log(x);
        switch (true) {
            case (x >= 200 && x < 299):
                y.style.background = "url("+weather.backgroundImg.thunder+") 100%";
                break;         
            case x >= 300 && x < 399:
                y.style.background = "url("+weather.backgroundImg.drizzle+") 100%";
                break;
            case x >= 500 && x < 599:
                y.style.background = "url("+weather.backgroundImg.rain+") 100%";
                break;
            case x >= 600 && x < 699:
                y.style.background = "url("+weather.backgroundImg.snow+") 100%";
                break;
            case x >= 700 && x < 799:
                y.style.background = "url("+weather.backgroundImg.atmosphere+") 100%";
                break;
            case x == 800:
                y.style.background = "url("+weather.backgroundImg.clear+") 100%";
                break;
            case x >= 801 && x < 899:
                y.style.background = "url("+weather.backgroundImg.clouds+" ) 100%";
                break;
            default:
                console.log("no weather");
        }
    }


};
document.getElementById("submit").onclick = function(event) {
    event.preventDefault();
    locate.getCoordsSearch();
    document.getElementById("title").innerHTML = "Local weather for " + document.getElementById("searchBar").value;
    document.getElementById("searchBar").value = "";
};

document.getElementById("radioF").onclick = function() {
    document.getElementById("radioC").removeAttribute("checked");
    document.getElementById("radioF").setAttribute("checked", "checked");
    weather.displayWeather();
};
document.getElementById("radioC").onclick = function() {
    document.getElementById("radioF").removeAttribute("checked");
    document.getElementById("radioC").setAttribute("checked", "checked");
    weather.displayWeather();
};

locate.getCoords();

//----For setting up 5day forecast -----

// forecastWeather: function() {
//     $.ajax({
//         url: "https://api.openweathermap.org/data/2.5/forecast",
//         data: { lat: locate.coords.lat, lon: locate.coords.long, units: "imperial", APPID: OPENAPI },
//         dataType: "json",
//         success: function(data) {
//             console.log(data);
//             console.log(data.list);
//             (data.list).forEach(function(currentValue, index, array){
//                 // console.log(currentValue.main.temp)
//                 var foreDate = currentValue.dt;
//                 var convertedDate= new Date(foreDate*1000);
//                 var date = new Date();
//                 var todayDay = date.getDay();

//               weather.forecast[convertedDate.getDay()].temp.push(currentValue.main.temp);
//               weather.forecast[convertedDate.getDay()].conditions.push(currentValue.weather[0].description);
//               weather.forecast[convertedDate.getDay()].icon.push(currentValue.weather[0].icon);
//               weather.displayForecast();

//             });
//         }
//     });
// },
// displayForecast: function(){
//     for(var i = 0 ; i<weather.forecast.length; i++){
//     var forecastDiv = document.createElement("DIV");
//     forecastDiv.setAttribute("class", "well");
//     forecastDiv.innerHTML = weather.forecast[i].temp[2];
//     document.getElementById("forecastWells").appendChild(forecastDiv);
//     }
// }