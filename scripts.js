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
                // console.log(position);
                locate.coords.lat = position.coords.latitude;
                locate.coords.long = position.coords.longitude;
                // locate.displayLocation();
                locate.getZipCode();
                weather.currentWeather();
                weather.forecastWeather();
                // weather.darkSky();

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
        document.getElementById("title").innerHTML = "Local weather for " + locate.address.city + " " + locate.address.state + ", " + locate.address.zipCode;

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



};

var weather = {
    today: {
        temp: "",
        highTemp: "",
        lowTemp: "",
        conditions: "",
        windSpeed: "",
        humidity: "",
        icon: "",
        iconLink: "https://openweathermap.org/img/w/"

    },
    currentWeather: function() {
        // var apiURL="https://api.openweathermap.org/data/2.5/weather?lat="+locate.coords.lat+"&lon="+locate.coords.long+"&APPID=97ca37be0ddae7383d1127163600cdaf"
       var that = this;

        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/weather",
            data: { lat: locate.coords.lat, lon: locate.coords.long, units: "imperial", APPID: OPENAPI },
            dataType: "json",
            success: function(data) {
                console.log(data);
                that.today.temp = data.main.temp;
                that.today.highTemp = data.main.temp_max;
                that.today.lowTemp = data.main.temp_min;
                that.today.conditions = data.weather[0].description;
                that.today.icon = data.weather[0].icon;
                that.today.windSpeed = data.wind.speed;
                that.today.humidity = data.main.humidity;
                that.displayWeather();
            }
        });
    },
    forecastWeather: function() {
        $.ajax({
            url: "https://api.openweathermap.org/data/2.5/forecast",
            data: { lat: locate.coords.lat, lon: locate.coords.long, units: "imperial", APPID: OPENAPI },
            dataType: "json",
            success: function(data) {
                // console.log(data);
            }
        });
    },
    displayWeather: function() {
        // console.log(this.today.iconLink + this.today.icon+ ".png");
        document.getElementById("currentImg").src = this.today.iconLink + this.today.icon+ ".png";
        document.getElementById("currentTemp").innerHTML = this.today.temp + " &#8457;";
        document.getElementById("todayLow").innerHTML = "Low: "+this.today.lowTemp + " &#8457;";
        document.getElementById("todayHi").innerHTML = "High: "+ this.today.highTemp + " &#8457;";
        document.getElementById("weatherDescription").innerHTML = this.today.conditions;
        document.getElementById("todayWind").innerHTML = "Wind: "+this.today.windSpeed +" mph";
        document.getElementById("todayHumidity").innerHTML = "Humidity: "+this.today.humidity + "%";
        
    },


};

locate.getCoords();
