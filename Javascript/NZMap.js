var GeocodeKey = "A9cgnrHAOTLt9s90LajfqMZI15E1CbVH";

var lat = -39.057994;
var lng = 174.080647;
var sun = document.getElementById("Sun");
var weather = document.getElementById("Weather");
var searchText = document.getElementById("Search");
var recent = document.getElementById("Recent");
var mymap = L.map("mapid").setView([lat, lng], 13);
var searched = [];

function initialise() {

	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		maxZoom: 18,
		id: 'mapbox.streets',
		accessToken: 'pk.eyJ1IjoiamxzNjgiLCJhIjoiY2p2b3ZsYmNtMjNhZjRjb2lwemNwOWxnMCJ9.AEceBo-LhiDvpQZsTu5FAw'
	}).addTo(mymap);
	search();
}

function search() {
	var location = searchText.value;
	var mapReq = 'https://www.mapquestapi.com/geocoding/v1/address?key=' + GeocodeKey + '&location=' + location + ",NZ";
	console.log(location + " searched");
	// Check if town was already searched
	let newLocal = true;
	searched.forEach(element => {
		if (element[0] == location){
			newLocal = false;
			lat = element[1];
			lng = element[2];
			console.log(lat + ',' + lng);
			mymap.panTo([lat, lng]);
		}
	});
	if (newLocal){
		// Fetch latitude and longitude of searched town
		fetch(mapReq)
			.then(response => {
				return response.json()
			})
			.then(data => {
				lat = data['results'][0]['locations'][0]['latLng']['lat'];
				lng = data['results'][0]['locations'][0]['latLng']['lng'];
				console.log(lat + ',' + lng);
				mymap.panTo([lat, lng]);
				let para = document.createElement("p");
				para.onclick = function(){
					searchText.value = location;
					search();	
				};
				let node = document.createTextNode(location);
				para.appendChild(node);
				recent.appendChild(para);
				searched.push([location, lat, lng]);

			})
			.catch(err => {
				console.log('Error getting lat and lng: ' + err);
			})
	}

	var sunReq = 'https://api.sunrise-sunset.org/json?lat=' + lat + '&lng=' + lng + '&date=today';

	// Fetch sun rise and set times
	fetch(sunReq)
		.then(response => {
			return response.json()
		})
		.then(data => {
			let rise = data['results']['nautical_twilight_begin'].replace('P', 'A'); // Convert from utc to nz time by going forward 12 hours, or simply swapping PM with AM
			let set = data['results']['nautical_twilight_end'].replace('A', 'P'); // Swaps AM with PM
			sun.innerText = location + " currently: Sun rises at " + rise + " and sets at " + set;
		})
		.catch(err => {
			console.log('Error getting sun rise and sun set time: ' + err);
			sun.innerText = location + " currently: Sun rise and set time are currentily unavaliable";
		})

	// Make AJAX request for weather outlook
	var _request = new XMLHttpRequest();
	var url = "PHP/Geocode.php?lat=" + lat + "&lng=" + lng;
	_request.open("GET", url, true);
	console.log("Request sent to " + url);
	_request.onreadystatechange = function () {
		if (_request.readyState == 4) {
			if (_request.status == 200) {
			    console.log('Request Success: ' + _request.responseText);
			    let parser = new DOMParser();
		let xmlDoc = parser.parseFromString(_request.responseText,'text/xml');
			    let main = xmlDoc.getElementsByTagName("current")[0].getElementsByTagName("weather")[0].getAttribute("value");
			    let curr = xmlDoc.getElementsByTagName("current")[0].getElementsByTagName("temperature")[0].getAttribute("value");
			    let max = xmlDoc.getElementsByTagName("current")[0].getElementsByTagName("temperature")[0].getAttribute("max");
			    let min = xmlDoc.getElementsByTagName("current")[0].getElementsByTagName("temperature")[0].getAttribute("min");
			    // Convert to celsius
			    curr = Math.round((curr - 32)/1.8);
			    max = Math.round((max - 32)/1.8);
			    min = Math.round((min - 32)/1.8);
			    weather.innerText = 'Current weather is ' + main + 'with temperature of ' + curr+ ', max temp: ' + max + ' min temp: ' +min;
		//weather.innerText = _request.responseText;
			}
			else {
				console.log("Request error: " + _request.status);
				sun.innerText = "Weather outlook is currentily unavailable";
			}
		}
	};
	_request.send();
}
