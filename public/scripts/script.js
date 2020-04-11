function moveRight() {
    var slide = document.getElementById('slide1');
    slide.style.marginLeft = '-50%'
}

function moveLeft() {
    var slide = document.getElementById('slide1');
    slide.style.marginLeft = '0';
}

var option1 = document.getElementById('user');
var option2 = document.getElementById('bell');
var option3 = document.getElementById('envelope');
var headerProfile = document.getElementById('header_profile');

console.log(option1, option2, option3);

option1.addEventListener('change', function () {
    if (this.checked) {
        option2.checked = false;
        option3.checked = false;
    }
});

option2.addEventListener('change', function () {
    if (this.checked) {
        option1.checked = false;
        option3.checked = false;
    }
});

option3.addEventListener('change', function () {
    if (this.checked) {
        option1.checked = false;
        option2.checked = false;
    }
});

headerProfile.addEventListener('focusout', function () {
    console.log('focus Lost');
    option1.checked = false;
    option2.checked = false;
    option3.checked = false;
});

/* =========== 
 Function to get the location coordinates using geolocation api
=========== */
var getPosition = (position) => {
    var locationObj = {};
    locationObj.lat = position.coords['latitude'];
    locationObj.lng = position.coords['longitude'];
    // Call the google api to create the map
    initMap(locationObj);
    // call the getHumanReadableAddress function to get the address in human readable format
    getHumanReadableAddress(position.coords['latitude'], position.coords['longitude']);
}

/* =========== 
 Function that gets triggered when we have the error while fetch the co-ordinates
 using HTML5 geoolocation api
=========== */
var locationNotReceived = (positionError) => {
    console.log(positionError);
}

/* =========== 
 Function to get the address using the coordinates
=========== */
var getHumanReadableAddress = (latitude, longitude) => {
    var tempURL = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyCm_GrSti6BA79AerJkEcrmCusdDhDCsko`;
    $.ajax({
        url: tempURL,
        success: function (result) {
            if (result.status == 'OK') {
                var lat = result.results[0].geometry.location.lat;
                var lng = result.results[0].geometry.location.lng;
                $('#address').val(result['results'][0]['formatted_address']);
                $('#lat').val(lat);
                $('#lng').val(lng);
            }
        }
    }
    );
}

/* =========== 
  Function to create the map with an id selector (target the id and generate the map)
=========== */
var createMapWithCoordinates = (selector, latLongObj) => {
    var map = new google.maps.Map(
        document.getElementById(selector),
        {
            zoom: 15, center: latLongObj
        });
    marker = new google.maps.Marker({
        position: latLongObj,
        map: map,
        title: 'Default Marker',
        draggable: true
    });
}

/* =========== 
  Function to initialize the map on page load
=========== */
var initMap = (locationObj) => {
    // create a map using the co-ordinates and the target id
    createMapWithCoordinates('map', locationObj);
    // The marker, positioned at the given lat and long
    google.maps.event.addListener(marker, 'dragend', function (event) {
        var tempObj = {};
        tempObj.lat = this.position.lat();
        tempObj.lng = this.position.lng();
        getHumanReadableAddress(this.position.lat(), this.position.lng());
    });
}

/* =========== 
  HTML5 geolocation api to get the coordinates
=========== */
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getPosition, locationNotReceived);
} else {
    alert('Geolocation is not supported in your browser');
}

function findMe() {

}