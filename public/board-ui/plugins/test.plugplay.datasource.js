// # A Freeboard Plugin as a Rest Client

(function(){
	// ### Datasource Definition
	//
	// -------------------
	freeboard.loadDatasourcePlugin({
		"type_name"   : "Demo_restful",
		"display_name": "Demo REST",
        "description" : "Send/Receive data to/from the PlugPlay REST server.",
		"settings"    : [
			{ 
            	name        : "user_key",
            	display_name: "User Key",
            	type        : "text",
            	required    : true,
            },
            { 
            	name        : "board_id",
            	display_name: "Board Id",
            	type        : "text",
            	required    : true,
            },
			{
            	name        : "local_station",
            	display_name: "local_station",
            	type        : "text",
            	description : "The topic to send and receive data",
            	required    : true,
			},
			{
            	name        : "req_station",
            	display_name: "req_station",
            	type        : "text",
            	description : "The topic to send and receive data",
            	required    : true,
            },
            {
            	name        : "recv_data",
            	display_name: "Receive data",
            	type        : "boolean",
            	default_value: false,
            },
            {
            	name        : "refresh",
            	display_name: "Refresh Every",
				suffix: "seconds",
				type : "number",
            	default_value: 1
            }

		],
		// **newInstance(settings, newInstanceCallback, updateCallback)** (required) : A function that will be called when a new instance of this plugin is requested.
		// * **settings** : A javascript object with the initial settings set by the user. The names of the properties in the object will correspond to the setting names defined above.
		// * **newInstanceCallback** : A callback function that you'll call when the new instance of the plugin is ready. This function expects a single argument, which is the new instance of your plugin object.
		// * **updateCallback** : A callback function that you'll call if and when your datasource has an update for freeboard to recalculate. This function expects a single parameter which is a javascript object with the new, updated data. You should hold on to this reference and call it when needed.
		newInstance   : function(settings, newInstanceCallback, updateCallback)
		{
			newInstanceCallback(new restDatasourcePlugin(settings, updateCallback));
		}
	});

	var restDatasourcePlugin = function(settings, updateCallback)
	{
 		var self = this;
		var data = {};
		var xhttp = new XMLHttpRequest();
		var authTopic;
        var timer;
		var currentSettings = settings;

		function alertContents(flag) {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                //console.log('PlugPlay REST connected');
                if(flag){
					data.msg = JSON.parse(xhttp.responseText);
					//console.log(data);
			        updateCallback(data);
                }
            }
            else if (xhttp.readyState == 4 && xhttp.status != 200){
                console.log('PlugPlay REST connected error : '+ xhttp.status);
            }
        };

		function getData() {
			xhttp.onreadystatechange = alertContents(true);            
            xhttp.open("GET", authTopic, true);
            xhttp.setRequestHeader('Content-Type', 'application/json');
            xhttp.send();
		}

		function stopTimer() {
			if (timer) {
				clearTimeout(timer);
				timer = null;
			}
		}

		function updateTimer() {
			stopTimer();
			if(currentSettings.recv_data){
				authTopic = '/api/mqtt/' + currentSettings.user_key + '&' + currentSettings.board_id + '&' + currentSettings.local_station + '&' + currentSettings.req_station;
				timer = setInterval(getData, currentSettings.refresh * 1000);
			}
		}

		// Allow datasource to send rest messages to the REST server
 		self.send = function(value) {
 			if (xhttp) {
				// pre-process msgs before going out
				switch(typeof(value)){
					case 'boolean':
						value = value ? '1' : '0';
						break;
					case 'number':
						value = String(value);
						break;
					case 'object': // In Plugplay, the value is always a JSON object
						value = JSON.stringify(value);  
						break;
					case 'string':
						break;
				}
				xhttp.onreadystatechange = alertContents(false);
                xhttp.open('PUT', authTopic, true);
                xhttp.setRequestHeader('Content-Type', 'application/json');
				//=================================
 		        xhttp.send(value);
 			}
		}

		// **onSettingsChanged(newSettings)** (required) : A public function we must implement that will be called when a user makes a change to the settings.
		self.onSettingsChanged = function(newSettings)
		{			
			data = {};
			currentSettings = newSettings;   
			updateTimer();
			self.updateNow();
		}

		// **updateNow()** (required) : A public function we must implement that will be called when the user wants to manually refresh the datasource
		self.updateNow = function()
		{
			data.msg = {device: '',
						data0: '',
						data1: '',
						data2: '',};
			updateCallback(data);	
		}

		// **onDispose()** (required) : A public function we must implement that will be called when this instance of this plugin is no longer needed. Do anything you need to cleanup after yourself here.
		self.onDispose = function()
		{
			stopTimer();
		}

        // Run at the first time
        updateTimer();
		     
	}
}());