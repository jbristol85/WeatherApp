/*global $ navigator GOOGLEAPI*/


var locate = {
    coords: {
        lat: "",
        long: ""
    },
    address:{
        street:"",
        city: "",
        state: "",
        zipCode: "",
    },
    getCoords: function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                console.log(position);
                locate.coords.lat = position.coords.latitude;
                locate.coords.long = position.coords.longitude;
                // locate.displayLocation();
                locate.getZipCode();
            });
        }else {
            alert("Not Supported");
        }
    },
    displayLocation: function(){
        document.getElementById("coordLat").innerHTML = "Latitude: " + locate.coords.lat;
        document.getElementById("coordLong").innerHTML = "Longitude: " + locate.coords.long;
        document.getElementById("address1").innerHTML =  locate.address.street;
        document.getElementById("address2").innerHTML = locate.address.city+" " + locate.address.state+ ", " + locate.address.zipCode;
        
        // for(var i = 0; i < locate.address.length; i++)
        // var streetAddress = document.createElement("P");
        // streetAddress.innerHTML = locate.address.key[i];
        // document.getElementById("address").appendChild(streetAddress);
        
    },
    getZipCode: function(){
        $.ajax({
            url:"https://maps.googleapis.com/maps/api/geocode/json",
            data:{latlng:locate.coords.lat+","+locate.coords.long, key:GOOGLEAPI},
            success: function(data){
                console.log(data);
                locate.address.street = data.results[0].address_components[0].short_name + " "+ data.results[0].address_components[1].short_name ;
                locate.address.city = data.results[0].address_components[3].short_name;
                locate.address.state = data.results[0].address_components[5].short_name;
                locate.address.zipCode = data.results[0].address_components[7].short_name;
                locate.displayLocation();
                }
            
        })
    }
    
    
};

var weather = {
 
};

locate.getCoords();
