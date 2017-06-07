// # A Freeboard Plugin that uses the Eclipse Paho javascript client to read MQTT messages

(function(){
	// ### Datasource Definition
	//
	// -------------------
	freeboard.loadDatasourcePlugin({
		"type_name"   : "plugplay_mqtt_paho",
		"display_name": "PlugPlay MQTT",
        "description" : "Receive data from an MQTT server.",
		"external_scripts" : [
			"https://cdnjs.cloudflare.com/ajax/libs/paho-mqtt/1.0.1/mqttws31.min.js"
		],
		"settings"    : [
			{
				name        : "use_ssl",
				display_name: "Use SSL",
				type        : "boolean",
				description : "Use SSL/TLS to connect to the MQTT Server",
				default_value: true,
			},
			{ // will be username
            	name        : "user_key",
            	display_name: "User Key",
            	type        : "text",
            	required    : true,
            },
            { // will be password
            	name        : "board_id",
            	display_name: "Board Id",
            	type        : "text",
            	required    : true,
            },
			{
            	name        : "topic",
            	display_name: "Topic to subscribe",
            	type        : "text",
            	description : "The topic to subscribe to",
            	required    : true,
            },
		],
		// **newInstance(settings, newInstanceCallback, updateCallback)** (required) : A function that will be called when a new instance of this plugin is requested.
		// * **settings** : A javascript object with the initial settings set by the user. The names of the properties in the object will correspond to the setting names defined above.
		// * **newInstanceCallback** : A callback function that you'll call when the new instance of the plugin is ready. This function expects a single argument, which is the new instance of your plugin object.
		// * **updateCallback** : A callback function that you'll call if and when your datasource has an update for freeboard to recalculate. This function expects a single parameter which is a javascript object with the new, updated data. You should hold on to this reference and call it when needed.
		newInstance   : function(settings, newInstanceCallback, updateCallback)
		{
			newInstanceCallback(new mqttDatasourcePlugin(settings, updateCallback));
		}
	});

	var mqttDatasourcePlugin = function(settings, updateCallback)
	{
 		var self = this;
		var data = {};
		var client, authTopic;
		var currentSettings = settings;
		var clientId = 'plugplay_paho_' + Math.random().toString(16).substr(2, 8);
		var server = 'mqtt.plugplay.co',
			port = 8084;
		
		authTopic = currentSettings.board_id + '/' + currentSettings.topic;

		function onConnect() {
			//console.log("MQTT PlugPlay subscribed");
			client.subscribe(authTopic);
		};
		
		function onConnectionLost(responseObject) {
			if (responseObject.errorCode !== 0)
				console.log("MQTT PlugPlay onConnectionLost: "+responseObject.errorMessage);
		};

		function onMessageArrived(message) {
			// pre-process arrived msgs before going to widgets
			data.msg = JSON.parse(message.payloadString);
			//=================================================
			updateCallback(data);
		};

		// Allow datasource to publish mqtt messages from clients
 		self.send = function(value) {
 			if (client.isConnected()) {
				// pre-process msgs before going out
				switch(typeof(value)){
					case 'boolean':
						value = value ? '1' : '0';
						break;
					case 'number':
						value = String(value);
						break;
					case 'object':
						value = JSON.stringify(value);  
						break;
					case 'string':
						break;
				}
				
 				var message = new Paho.MQTT.Message(value);
 		        message.destinationName = authTopic;
				//=================================
 		        client.send(message);
 			}
		}

		// **onSettingsChanged(newSettings)** (required) : A public function we must implement that will be called when a user makes a change to the settings.
		self.onSettingsChanged = function(newSettings)
		{			
			data = {};
			currentSettings = newSettings;
			authTopic = currentSettings.board_id + '/' + currentSettings.topic;

			if (client.isConnected()) {
				client.disconnect();
			}

			client = new Paho.MQTT.Client(server,
										port, 
										clientId);
			client.onConnectionLost = onConnectionLost;
			client.onMessageArrived = onMessageArrived;
			client.connect({onSuccess:onConnect,
							userName: currentSettings.user_key,
							password: currentSettings.board_id,
							useSSL: currentSettings.use_ssl});
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
			if (client.isConnected()) {
				client.disconnect();
			}
			client = {};
		}

		client = new Paho.MQTT.Client(server,
										port, 
										clientId);
		client.onConnectionLost = onConnectionLost;
		client.onMessageArrived = onMessageArrived;
		client.connect({onSuccess:onConnect, 				
						userName: currentSettings.user_key,
						password: currentSettings.board_id,
						useSSL: currentSettings.use_ssl});
	}
}());