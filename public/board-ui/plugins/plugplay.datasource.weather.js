(function(){
	// ### Datasource Definition
	//
	// -------------------
	freeboard.loadDatasourcePlugin({
        "settings": [{
            "description": "You can also try a city name.",
            "type": "text",
            "display_name": "Zip / Postal Code",
            "name": "location"
        }, {
            "options": [{
                "value": "imperial",
                "name": "Imperial"
            }, {
                "value": "metric",
                "name": "Metric"
            }],
            "default": "imperial",
            "type": "option",
            "display_name": "Units",
            "name": "units"
        }],
        "external_scripts": ["https://cdnjs.cloudflare.com/ajax/libs/jquery.simpleWeather/3.1.0/jquery.simpleWeather.min.js"],
        "description": "Retrieve live weather data at a specific location, updated once per minute.",
        "display_name": "Weather",
        "type_name": "weather",
        "newInstance": function(settings, newInstanceCallback, updateCallback) {
            newInstanceCallback(new weatherDatasource(settings, updateCallback));
        }
    });

	var weatherDatasource = function(e, f) {
		var b = this;
		var c = null;
		var a = e;

		function d(h) {
			if (c) {
				clearInterval(c)
			}
			c = setInterval(function() {
				b.updateNow()
			}, h)
		}

		function g(h) {
			return h.replace(/\w\S*/g, function(i) {
				return i.charAt(0).toUpperCase() + i.substr(1).toLowerCase()
			})
		}
		d(60 * 1000);
		this.updateNow = function() {
			var h = (a.units == "metric") ? "c" : "f";
			$.simpleWeather({
				location: a.location,
				woeid: "",
				unit: h,
				success: function(j) {
					var i = {};
					if (j && j.city) {
						i = {
							place_name: j.city + ", " + j.region,
							sunrise: j.sunrise,
							sunset: j.sunset,
							conditions: j.currently,
							current_temp: j.temp,
							high_temp: j.high,
							low_temp: j.low,
							pressure: j.pressure,
							humidity: j.humidity,
							wind_speed: j.wind.speed,
							wind_direction: j.wind.direction
						}
					}
					f(i)
				},
				error: function(i) {
					console.log("error in weather datasource: " + i)
				}
			})
		};
		this.onDispose = function() {
			clearInterval(c);
			c = null
		};
		this.onSettingsChanged = function(h) {
			a = h;
			b.updateNow();
			d(60 * 1000)
		}
	};
}());