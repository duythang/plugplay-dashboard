// # A Freeboard Plugin as a Rest Client

(function(){
	// ### Datasource Definition
	//
	// -------------------
	freeboard.loadDatasourcePlugin({
		"type_name"   : "plugplay_restful",
		"display_name": "PlugPlay REST",
        "description" : "Receive data from an REST server.",
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
            	name        : "topic",
            	display_name: "Topic to Send or Receive Data",
            	type        : "text",
            	description : "The topic to send or receive data",
            	required    : true,
            },
            {
            	name        : "recv_data",
            	display_name: "Receive data",
            	type        : "boolean",
            	description : "If you use this function, the Datasource will load data periodically with a interval",
            	default_value: false,
            },
            {
            	name        : "interval",
            	display_name: "Refresh Every",
				suffix: "seconds",
				type : "number",
            	description : "The value has to be bigger than 2 (seconds)",
            	default_value: 5
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
		var xhttp, authTopic;
        var refreshIntervalId;
		var currentSettings = settings;

		authTopic = '/api/rest/' + currentSettings.user_key + '&' + currentSettings.board_id + '&' + currentSettings.topic;

		// Allow datasource to publish mqtt messages from clients
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

        function alertContents(flag) {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                //console.log('Connect REST Successfully');
                if(flag){
                    data.msg = JSON.parse(xhttp.responseText);
			        //=================================================
			        updateCallback(data);
                }
            }
            else if (xhttp.readyState == 4 && xhttp.status != 200){

                console.log('Connect REST Failed : '+ xhttp.status);
            }
        };

		// **onSettingsChanged(newSettings)** (required) : A public function we must implement that will be called when a user makes a change to the settings.
		self.onSettingsChanged = function(newSettings)
		{			
			data = {};
			currentSettings = newSettings;
            authTopic = '/api/rest/' + currentSettings.user_key + '&' + currentSettings.board_id + '&' + currentSettings.topic;
            
			clearInterval(refreshIntervalId);
            if(currentSettings.recv_data){
                refreshIntervalId = setInterval(function (){ 
                    xhttp.onreadystatechange = alertContents(true);            
                    xhttp.open("GET",authTopic, true);
                    xhttp.setRequestHeader('Content-Type', 'application/json');
                    xhttp.send();
                }, currentSettings.interval*1000); 
            }
            
			self.updateNow();
		}

		// **updateNow()** (required) : A public function we must implement that will be called when the user wants to manually refresh the datasource
		self.updateNow = function()
		{
			// Don't need to do anything here, can't pull an update from MQTT.
			data.msg = {device: '',
				data0: '',
				data1: '',
				data2: '',};
			updateCallback(data);
			
		}

		// **onDispose()** (required) : A public function we must implement that will be called when this instance of this plugin is no longer needed. Do anything you need to cleanup after yourself here.
		self.onDispose = function()
		{
			clearInterval(refreshIntervalId);
		}

        // Run at the first time
        xhttp = new XMLHttpRequest();
        if(currentSettings.recv_data){
			if(currentSettings.interval < 2) currentSettings.interval = 2;
            refreshIntervalId = setInterval(function (){ 
                    xhttp.onreadystatechange = alertContents(true);            
                    xhttp.open("GET",authTopic, true);
                    xhttp.setRequestHeader('Content-Type', 'application/json');
                    xhttp.send();
            }, currentSettings.interval*1000);
        }
         
	}
}());