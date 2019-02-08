// Licensed under the Apache License, Version 2.0

(function() {
  'use strict';

  var app = {
    isLoading: true,
    visibleCards: {},
    selectedCities: [],
    spinner: document.querySelector('.loader'),
    cardTemplate: document.querySelector('.cardTemplate'),
    container: document.querySelector('.main'),
    addDialog: document.querySelector('.dialog-container'),
    daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  };


  /*****************************************************************************
   * Event listeners for UI elements
   ****************************************************************************/

  document.getElementById('butRefresh').addEventListener('click', function() {
    // Refresh all of the forecasts
    app.updateForecasts();
  });

  document.getElementById('butAdd').addEventListener('click', function() {
    // Open/show the add new city dialog
    app.toggleAddDialog(true);
  });

  document.getElementById('butRemove').addEventListener('click', function() {
    // Remove last card
	//app.visibleCards = {};
    //app.selectedCities = [];
	//app.updateForecastCard(initialWeatherForecast);
	//app.updateForecasts();
    app.updateForecastCard(initialWeatherForecast);
    app.selectedCities = [
      {key: initialWeatherForecast.key, label: initialWeatherForecast.label}
    ];
    app.saveSelectedCities();
	window.location.reload();
	//card.classList.remove('cardTemplate');
    //app.container.removeChild(app.container.childNodes[0]);
    //app.visibleCards.removeChild(card);
	//app.selectedCities.pop();
  });
  
  document.getElementById('butAddCity').addEventListener('click', function() {
      // Add the newly selected city
      var select = document.getElementById('selectCityToAdd');
      var selected = select.options[select.selectedIndex];
      var key = selected.value;
      var label = selected.textContent;
      if (!app.selectedCities) {
        app.selectedCities = [];
      }
      app.getForecast(key, label);
      app.selectedCities.push({key: key, label: label});
      app.saveSelectedCities();
      app.toggleAddDialog(false);
    });

  document.getElementById('butAddCancel').addEventListener('click', function() {
    // Close the add new city dialog
    app.toggleAddDialog(false);
  });


  /*****************************************************************************
   *
   * Methods to update/refresh the UI
   *
   ****************************************************************************/

  // Toggles the visibility of the add new city dialog.
  app.toggleAddDialog = function(visible) {
    if (visible) {
      app.addDialog.classList.add('dialog-container--visible');
    } else {
      app.addDialog.classList.remove('dialog-container--visible');
    }
  };

  // Updates a weather card with the latest weather forecast. If the card
  // doesn't already exist, it's cloned from the template.
  app.updateForecastCard = function(data) {
    var dataLastUpdated = new Date(data.created);
    var sunrise = data.channel.astronomy.sunrise;
    var sunset = data.channel.astronomy.sunset;
	var pressure = data.channel.atmosphere.pressure;
	var visibility = data.channel.atmosphere.visibility;
    var current = data.channel.item.condition;
    var humidity = data.channel.atmosphere.humidity;
    var wind = data.channel.wind;

    var card = app.visibleCards[data.key];
    if (!card) {
      card = app.cardTemplate.cloneNode(true);
      card.classList.remove('cardTemplate');
      card.querySelector('.location').textContent = data.label;
      card.removeAttribute('hidden');
      app.container.appendChild(card);
      app.visibleCards[data.key] = card;
    }

    // Verifies the data provide is newer than what's already visible
    // on the card, if it's not bail, if it is, continue and update the
    // time saved in the card
    var cardLastUpdatedElem = card.querySelector('.card-last-updated');
    var cardLastUpdated = cardLastUpdatedElem.textContent;
    if (cardLastUpdated) {
      cardLastUpdated = new Date(cardLastUpdated);
      // Bail if the card has more recent data then the data
      if (dataLastUpdated.getTime() < cardLastUpdated.getTime()) {
        return;
      }
    }
    cardLastUpdatedElem.textContent = data.created;

//var gas = 73;var temp = 24;var hum = 56; 	

var url0 = 'https://api-cleanaircluj.herokuapp.com/api/Resources?filter[order]=timespan%20DESC&filter[limit]=1';
if ('caches' in window) {
	caches.match(url0).then(function(response) {
       if (response) {
         response.json().then(function updateFromCache(json) {
           console.log('chached co2 data: '+json[0].co2);
		   var response0 = json;
		   app.populateAir(json[0],card);
         });
	   }
   });
}

/*
var url0 = 'https://api-cleanaircluj.herokuapp.com/api/Resources?filter[order]=timespan%20DESC&filter[limit]=1';
if ('caches' in window) {
	caches.match(url0).then(function(response) {
       if (response) {
         //response.json().then(function updateFromCache(json) {
           //var results = json.query.results;
           //results.created = json.query.created;
           console.log(response);
         //});
       } else {
		   console.log('return');
       }
     });
   }
*/
   		  
var xhr0 = new XMLHttpRequest();
//xhr1.open('GET', 'https://api.beebotte.com/v1/data/read/RaspberryPi/mq135?limit=1&source=raw&time-range=1hour', false);
xhr0.open('GET', 'https://api-cleanaircluj.herokuapp.com/api/Resources?filter[order]=timespan%20DESC&filter[limit]=1', true);//true=async
//xhr1.setRequestHeader("Authorization", "2eab27596ecc0428cb1086e9f335cfc5:zArjGkSHLj8bzcwLHtmdBmT3y2A=");
xhr0.setRequestHeader("Accept","application/json");
xhr0.addEventListener('load',function(){ console.log('xhr0:status='+xhr0.status+' response='+xhr0.responseText);
  if(xhr0.status === 200){
      //alert("We got data: " + xhr0.response);
	  if (xhr0.responseText != '[]') { 
		  app.populateAir(JSON.parse(xhr0.responseText)[0],card);
		/*  
	  	var response0 = JSON.parse(xhr0.responseText); 
	  	var gas = Math.round(response0[0].co2);
	  	var temp = Math.round(response0[0].temperature);
	  	var hum = Math.round(response0[0].humidity/10);	
		var gascol = "green";
		var gastext = "Normal";
		var gasfont = gas+100;
		var airicon = "air-normal";
		switch( Math.round(gas/35) ) {
		    case 0:
		        gascol = "green";
				gastext= "Excellent";
				airicon = "air-normal";
				break;
		    case 1:
		        gascol = "green";
				gastext= "Normal";
				airicon = "air-normal";
				break;
			case 2:
		        gascol = "blue";
				gastext = "Fair";
				airicon = "air-fair";
				break;
			case 3:
		        gascol = "orange";
				gastext = "Moderate";
				airicon = "air-moderate";
				break;
			case 4: 
				gascol = "red";
				gastext = "Poor";
				airicon = "air-poor";
				break;
			default:
				gascol = "darkred";	
				gastext = "Bad";
				airicon = "air-bad";			
		} 
		var pollen = "3 grains/m³";
		gas*=10;
		card.querySelector('.description').textContent = gastext + " Air Quality";
		card.querySelector('.description').style.color = gascol;
		card.querySelector('.description').style.fontWeight = gasfont;
		card.querySelector('.date').textContent = current.date;
	    card.querySelector('.current .icon').classList.add(airicon);
		card.querySelector('.current .temperature .value').textContent = temp;
		card.querySelector('.current .aqi .value').textContent = gas;  
		card.querySelector('.current .aqi .value').style.color = gascol;
		card.querySelector('.current .airscale').style.color = gascol;
		card.querySelector('.current .humidity').textContent = hum + '%';
	  */
	  }
  }
},false) 
xhr0.send();

//	var xhr1 = new XMLHttpRequest();
	//xhr1.open('GET', 'https://api.beebotte.com/v1/data/read/RaspberryPi/mq135?limit=1&source=raw&time-range=1hour', false);
//	xhr1.open('GET', 'https://api.beebotte.com/v1/data/read/RaspberryPi/mq135?limit=1&source=raw&time-range=12hour', false);
	//xhr1.setRequestHeader("Authorization", "2eab27596ecc0428cb1086e9f335cfc5:zArjGkSHLj8bzcwLHtmdBmT3y2A=");
//	xhr1.setRequestHeader("Authorization", "2eab27596ecc0428cb1086e9f335cfc5:+0zkEvE0KPoxzZOt8J0LPcM+2lk=");
//	xhr1.setRequestHeader("Accept","application/json");
//	xhr1.setRequestHeader("Content-Type","application/json");
//	xhr1.send();
//	if (xhr1.responseText != '[]') {
//		var response1 = JSON.parse(xhr1.responseText);
//		var gas = Math.round(response1[0].data);
//    } else {
//	    var gas = 103;
//	}

	/*
	  MQ-135 
	  normal air output  130
      Isopropile alcohol 700
      Lighter Gas        760
      Benzine            450
      Breath1            150
      Breath2            140
	*/
	
	
	/*
	var xhr2 = new XMLHttpRequest();
	xhr2.open('GET', 'https://api.beebotte.com/v1/data/read/RaspberryPi/temperature?limit=1&source=raw&time-range=1hour', false);
	xhr2.setRequestHeader("Authorization", "2eab27596ecc0428cb1086e9f335cfc5:4Rn9P3m3vKFJnQRm7DyrY/JeiYw=");
	xhr2.setRequestHeader("Accept","application/json");
	xhr2.setRequestHeader("Content-Type","application/json");
	xhr2.send();
    if (xhr2.responseText != '[]') {
		var response2 = JSON.parse(xhr2.responseText);	
    	var temp = Math.round(response2[0].data);	
    } else {
	  var temp = 23;
	}
	

	var xhr3 = new XMLHttpRequest();
	xhr3.open('GET', 'https://api.beebotte.com/v1/data/read/RaspberryPi/humidity?limit=1&source=raw&time-range=1hour', false);
	xhr3.setRequestHeader("Authorization", "2eab27596ecc0428cb1086e9f335cfc5:Mr2xAij+m5cGxXD63TdogPtpE0g=");
	xhr3.setRequestHeader("Accept","application/json");
	xhr3.setRequestHeader("Content-Type","application/json");
	xhr3.send();
	if (xhr3.responseText != '[]') {
		var response3 = JSON.parse(xhr3.responseText);
		var hum = Math.round(response3[0].data/10);	
    } else {
    	var hum = 56;
    }
	*/
	
	/*
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'https://api.breezometer.com/baqi/?lat=46.765475&lon=23.5503&key=ecb9d1545a234e9491cb72437b400abb', false);
	xhr.send();
	var response = JSON.parse(xhr.responseText);
	var aqival = response.breezometer_aqi;
	
	//var aqival = 33;
	var aqicol = response.breezometer_color;//"red";
	var aqitxt = response.breezometer_color;//"black";
	*/
	
	/*
	switch( Math.round(aqival/20) ) {
	    case 5:
	        //aqicol = "green";
			aqitxt = "yellow";
	        break;
	    case 4:
	        //aqicol = "lightgreen";
			aqitxt = "green";
	        break;
		case 3:
	        //aqicol = "yellow";
			break;
		case 2: 
			//aqicol = "orange";	
	}
	*/	
    //card.querySelector('.description').textContent = response.breezometer_description + ", " + current.text;
	//card.querySelector('.description').textContent = gastext + " Air, " + current.text;
//	card.querySelector('.description').textContent = gastext + " Air Quality";
	//card.querySelector('.description').style.color = aqicol;
//	card.querySelector('.description').style.color = gascol;
//	card.querySelector('.description').style.fontWeight = gasfont;
	//card.querySelector('.current .icon').style.background = aqicol;
	//card.querySelector('.current .icon').style.background = gascol;
//    card.querySelector('.date').textContent = current.date;
    //card.querySelector('.current .icon').classList.add(app.getIconClass(current.code));
//	card.querySelector('.current .icon').classList.add(airicon);
  //    card.querySelector('.current .temperature .value').textContent = Math.round(current.temp);
//    card.querySelector('.current .temperature .value').textContent = temp;
	//card.querySelector('.current .aqi .value').textContent = aqival;  
//	card.querySelector('.current .aqi .value').textContent = gas;  
	//card.querySelector('.current .aqi .value').style.color = aqitxt;
//	card.querySelector('.current .aqi .value').style.color = gascol;
	//card.querySelector('.current .aqi .value').style.background = aqicol;
	//card.querySelector('.current .airscale').style.color = aqicol;
//	card.querySelector('.current .airscale').style.color = gascol;
	//card.querySelector('.current .sunrise').textContent = sunrise;
    //card.querySelector('.current .sunset').textContent = sunset;
	//card.querySelector('.current .pollen').textContent = pollen;
    //card.querySelector('.current .humidity').textContent = Math.round(humidity) + '%';
//    card.querySelector('.current .humidity').textContent = hum + '%';
    //card.querySelector('.current .wind .value').textContent = Math.round(wind.speed);
    //card.querySelector('.current .wind .direction').textContent = wind.direction;
    card.querySelector('.date').textContent = current.date;
	var nextDays = card.querySelectorAll('.future .oneday');
    var today = new Date();
    today = today.getDay();
    for (var i = 0; i < 7; i++) {
      var nextDay = nextDays[i];
      var daily = data.channel.item.forecast[i];
      if (daily && nextDay) {
        nextDay.querySelector('.date').textContent =
          app.daysOfWeek[(i + today) % 7];
        nextDay.querySelector('.icon').classList.add(app.getIconClass(daily.code));
        nextDay.querySelector('.temp-high .value').textContent =
          Math.round(daily.high);
        nextDay.querySelector('.temp-low .value').textContent =
          Math.round(daily.low);
      }
    }
    if (app.isLoading) {
      app.spinner.setAttribute('hidden', true);
      app.container.removeAttribute('hidden');
      app.isLoading = false;
    }
  };


  /*****************************************************************************
   *
   * Methods for dealing with the model
   *
   ****************************************************************************/

  app.populateAir = function (res0,card) {
    var gas = Math.round(res0.co2);
  	var temp = Math.round(res0.temperature);
  	var hum = Math.round(res0.humidity/10);	
	var gascol = "green";
	var gastext = "Normal";
	var gasfont = gas+100;
	var airicon = "air-normal";
	switch( Math.round(gas/35) ) {
	    case 0:
	        gascol = "green";
			gastext= "Excellent";
			airicon = "air-normal";
			break;
	    case 1:
	        gascol = "green";
			gastext= "Normal";
			airicon = "air-normal";
			break;
		case 2:
	        gascol = "blue";
			gastext = "Fair";
			airicon = "air-fair";
			break;
		case 3:
	        gascol = "orange";
			gastext = "Moderate";
			airicon = "air-moderate";
			break;
		case 4: 
			gascol = "red";
			gastext = "Poor";
			airicon = "air-poor";
			break;
		default:
			gascol = "darkred";	
			gastext = "Bad";
			airicon = "air-bad";			
	} 
	var pollen = "3 grains/m³";
	gas*=10;
	card.querySelector('.description').textContent = gastext + " Air Quality";
	card.querySelector('.description').style.color = gascol;
	card.querySelector('.description').style.fontWeight = gasfont;
	//card.querySelector('.date').textContent = current.date;
    card.querySelector('.current .icon').classList.add(airicon);
	card.querySelector('.current .temperature .value').textContent = temp;
	card.querySelector('.current .aqi .value').textContent = gas;  
	card.querySelector('.current .aqi .value').style.color = gascol;
	card.querySelector('.current .airscale').style.color = gascol;
	card.querySelector('.current .humidity').textContent = hum + '%';
  }	

  /*
   * Gets a forecast for a specific city and updates the card with the data.
   * getForecast() first checks if the weather data is in the cache. If so,
   * then it gets that data and populates the card with the cached data.
   * Then, getForecast() goes to the network for fresh data. If the network
   * request goes through, then the card gets updated a second time with the
   * freshest data.
   */
  app.getForecast = function(key, label) {
    var statement = 'select * from weather.forecast where woeid=' + key + " and u='c'";
    var url = 'https://query.yahooapis.com/v1/public/yql?format=json&q=' +
        statement;
    // cache logic
    if ('caches' in window) {
         /*
          * Check if the service worker has already cached this city's weather
          * data. If the service worker has the data, then display the cached
          * data while the app fetches the latest data.
          */
         caches.match(url).then(function(response) {
           if (response) { console.log(response);
             response.json().then(function updateFromCache(json) {
               var results = json.query.results;
               results.key = key;
               results.label = label;
               results.created = json.query.created;
               app.updateForecastCard(results);
             });
           }
         });
       }		

    // Fetch the latest data.
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (request.readyState === XMLHttpRequest.DONE) {
        if (request.status === 200) {
          var response = JSON.parse(request.response);
          var results = response.query.results;
          results.key = key;
          results.label = label;
          results.created = response.query.created;
          app.updateForecastCard(results);
        }
      } else {
        // Return the initial weather forecast since no data is available.
        app.updateForecastCard(initialWeatherForecast);
      }
    };
    request.open('GET', url);
    request.send();
  };

  // Iterate all of the cards and attempt to get the latest forecast data
  app.updateForecasts = function() {
    var keys = Object.keys(app.visibleCards);
    keys.forEach(function(key) {
      app.getForecast(key);
    });
  };

  // Save list of cities to localStorage.
  app.saveSelectedCities = function() {
    var selectedCities = JSON.stringify(app.selectedCities);
    localStorage.selectedCities = selectedCities;
  };

  app.getIconClass = function(weatherCode) {
    // Weather codes: https://developer.yahoo.com/weather/documentation.html#codes
    weatherCode = parseInt(weatherCode);
    switch (weatherCode) {
      case 25: // cold
      case 32: // sunny
      case 33: // fair (night)
      case 34: // fair (day)
      case 36: // hot
      case 3200: // not available
        return 'clear-day';
      case 0: // tornado
      case 1: // tropical storm
      case 2: // hurricane
      case 6: // mixed rain and sleet
      case 8: // freezing drizzle
      case 9: // drizzle
      case 10: // freezing rain
      case 11: // showers
      case 12: // showers
      case 17: // hail
      case 35: // mixed rain and hail
      case 40: // scattered showers
        return 'rain';
      case 3: // severe thunderstorms
      case 4: // thunderstorms
      case 37: // isolated thunderstorms
      case 38: // scattered thunderstorms
      case 39: // scattered thunderstorms (not a typo)
      case 45: // thundershowers
      case 47: // isolated thundershowers
        return 'thunderstorms';
      case 5: // mixed rain and snow
      case 7: // mixed snow and sleet
      case 13: // snow flurries
      case 14: // light snow showers
      case 16: // snow
      case 18: // sleet
      case 41: // heavy snow
      case 42: // scattered snow showers
      case 43: // heavy snow
      case 46: // snow showers
        return 'snow';
      case 15: // blowing snow
      case 19: // dust
      case 20: // foggy
      case 21: // haze
      case 22: // smoky
        return 'fog';
      case 24: // windy
      case 23: // blustery
        return 'windy';
      case 26: // cloudy
      case 27: // mostly cloudy (night)
      case 28: // mostly cloudy (day)
      case 31: // clear (night)
        return 'cloudy';
      case 29: // partly cloudy (night)
      case 30: // partly cloudy (day)
      case 44: // partly cloudy
        return 'partly-cloudy-day';
    }
  };

  /*
   * Fake weather data that is presented when the user first uses the app,
   * or when the user has not saved any cities. See startup code for more
   * discussion.
   */
  var initialWeatherForecast = {
    key: '869897',
    label: 'Centru',
    created: '2018-05-11T11:00:00Z',
    channel: {
      astronomy: {
        sunrise: "5:43 am",
        sunset: "8:21 pm"
      },
      item: {
        condition: {
          text: "Windy",
          date: "Fri, 11 May 2018 09:00 PM EDT",
          temp: 26,
          code: 24
        },
        forecast: [
          {code: 44, high: 26, low: 10},
          {code: 44, high: 24, low: 13},
          {code: 4, high: 25, low: 18},
          {code: 24, high: 25, low: 19},
          {code: 24, high: 29, low: 17},
          {code: 44, high: 22, low: 19},
          {code: 44, high: 29, low: 17}
        ]
      },
      atmosphere: {
        humidity: 56
      },
      wind: {
        speed: 5,
        direction: 195
      },
	  "units": {
	  		 "distance": "km",
	  		 "pressure": "mb",
	  		 "speed": "km/h",
	  		 "temperature": "C"
	  }
    }
  };
  // TODO uncomment line below to test app with fake data
  // app.updateForecastCard(initialWeatherForecast);

  app.selectedCities = localStorage.selectedCities;
    if (app.selectedCities) {
      app.selectedCities = JSON.parse(app.selectedCities);
      app.selectedCities.forEach(function(city) {
        app.getForecast(city.key, city.label);
      });
    } else {
      /* The user is using the app for the first time, or the user has not
       * saved any cities, so show the user some fake data. A real app in this
       * scenario could guess the user's location via IP lookup and then inject
       * that data into the page.
       */
      app.updateForecastCard(initialWeatherForecast);
      app.selectedCities = [
        {key: initialWeatherForecast.key, label: initialWeatherForecast.label}
      ];
      app.saveSelectedCities();
    }
	
	if ('serviceWorker' in navigator) {
	    navigator.serviceWorker
	             .register('./service-worker.js')
	             .then(function() { console.log('Service Worker Registered'); });
	}
	
})();


/*
<script type="text/javascript" src='http://www.calitateaer.ro/PROXY/QUALITY_INDEX/VAADIN/vaadinBootstrap.js'></script>
				  <script>
					XMLHttpRequest.prototype._originalSend = XMLHttpRequest.prototype.send;
					var sendWithCredentials = function(data) {
					  this.withCredentials = true;
					  this._originalSend(data);
					};
					XMLHttpRequest.prototype.send = sendWithCredentials;
				  </script>
				     <script>
				 if (!window.vaadin){
					alert("Failed to load the bootstrap JavaScript: "+"VAADIN/vaadinBootstrap.js");
			   }
			 
	


		function initVaadinApplication(){
		 	var urlParts = window.location.href.split("?");
        	var queryString = (urlParts.length == 1) ? "" : "&" + urlParts[1];
        	queryString = (urlParts.length == 0) ? "" : queryString.split("#")[0];
			 
			  vaadin.initApplication("dacqtotem", {
			  //"browserDetailsUrl":'http://80.96.203.233:9084/',//'http://www.calitateaer.ro/PROXY/QUALITY_INDEX/?location=http://www.calitateaer.ro/PROXY/QUALITY_INDEX/'+queryString, "serviceUrl": 'http://80.96.203.233:9084/'
				  
				  "browserDetailsUrl": 'http://www.calitateaer.ro/PROXY/QUALITY_INDEX/?location=http://www.calitateaer.ro/PROXY/QUALITY_INDEX/'+queryString,
				  "serviceUrl": 'http://www.calitateaer.ro/PROXY/QUALITY_INDEX/',
				  "widgetset": 'ro.orioneurope.dacqtotem.gui.widgetset.DacqTotemWidgetSet',
				  "theme": "indices",
				  "versionInfo": {"vaadinVersion": "7.7.6.1"},
				  "vaadinDir":  'http://www.calitateaer.ro/PROXY/RESOURCES/VAADIN/',//http://www.calitateaer.ro/PROXY/QUALITY_INDEX/VAADIN/'-->,
				  "heartbeatInterval": 10,
				  "debug": false,
				  "standalone": true,
				  "authErrMsg": {
					  "message": "Take note of any unsaved data, and <u ▸ click here<\/u ▸ to continue.",
					  "caption": "Authentication problem"
				  },
				  "comErrMsg": {
					  "message": "Take note of any unsaved data,  and <u ▸ click here<\/u ▸ to continue.",
					  "caption": "Communication problem"
				  },
				  "sessExpMsg": {
					  "message": "Take note of any unsaved data,  and <u ▸ click here<\/u ▸ to continue.",
					  "caption": "Session Expired"
				  }
			  });
			}
		
			// init vaadin embeeded application asyncronious and after page load
			function customInit(){
			 setTimeout(function(){
				initVaadinApplication();
				},1500);
			}
			

			</script>
*/			