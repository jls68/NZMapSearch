var GeocodeKey = "A9cgnrHAOTLt9s90LajfqMZI15E1CbVH";

var lat = -39.057994
var lng = 174.080647
var sun = document.getElementById("Sun");
var weather = document.getElementById("Weather");
var recent = document.getElementById("Recent");
var mymap = L.map("mapid").setView([lat, lng], 13);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
	attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
	maxZoom: 18,
	id: 'mapbox.streets',
	accessToken: 'pk.eyJ1IjoiamxzNjgiLCJhIjoiY2p2b3ZsYmNtMjNhZjRjb2lwemNwOWxnMCJ9.AEceBo-LhiDvpQZsTu5FAw'
}).addTo(mymap);

search();

function search() {
	var location = document.getElementById("Search").value;
	var mapReq = 'http://www.mapquestapi.com/geocoding/v1/address?key=' + GeocodeKey + '&location=' + location + ",NZ";
	console.log(location);

	fetch(mapReq)
		.then(response => {
			return response.json()
		})
		.then(data => {
			lat = data['results'][0]['locations'][0]['latLng']['lat'];
			lng = data['results'][0]['locations'][0]['latLng']['lng'];
			console.log(lat + ',' + lng);
			mymap.setView([lat, lng], 13);
			recent.innerText = recent.innerText + '\n' + location;
		})
		.catch(err => {
			console.log('Error getting lat and lng: ' + err);
		})

	var sunReq = 'https://api.sunrise-sunset.org/json?lat=' + lat + '&lng=' + lng + '&date=today';
	var weatherReq = 'http://www.mapquestapi.com/geocoding/v1/address?key=' + GeocodeKey + '&location=' + location + ",NZ";

	fetch(sunReq)
		.then(response => {
			return response.json()
		})
		.then(data => {
			let rise = data['results']['nautical_twilight_begin'].replace('P','A'); // Convert from utc to nz time by going forward 12 hours, or simply swapping PM with AM
			let set = data['results']['nautical_twilight_end'].replace('A','P'); // Swaps AM with PM
			sun.innerText = location + " currently: Sun rises at " + rise + " and sets at " + set;
		})
		.catch(err => {
			console.log('Error getting sun rise and sun set time: ' + err);
		})

	/*fetch(weatherReq)
		.then(response => {
			return response.json()
		  })
		  .then(data => {
			weather.innerText = "Current Weather is #, outlook: # max temp: # min temp: #";
		  })
		  .catch(err => {
			console.log('Error getting weather: '+err);
		  })*/

	return;
}