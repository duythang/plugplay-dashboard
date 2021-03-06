// # A Freeboard Plugin that uses the Eclipse Paho javascript client to read MQTT messages

(function()
{
	// ### Datasource Definition
	//
	// -------------------
	freeboard.loadDatasourcePlugin({
		"type_name"   : "paho_mqtt",
		"display_name": "Free MQTT",
        "description" : "Send/Receive data to/from a MQTT server.",
		"external_scripts" : [
			"https://cdnjs.cloudflare.com/ajax/libs/paho-mqtt/1.0.1/mqttws31.min.js"
		],
		"settings"    : [
			{
				"name"         : "server",
				"display_name" : "MQTT Server",
				"type"         : "text",
				"description"  : "Hostname for your MQTT Server",
                "required" : true
			},
			{
				"name"        : "port",
				"display_name": "Port",
				"type"        : "number", 
				"description" : "The port to connect to the MQTT Server on",
				"required"    : true
			},
			{
				"name"        : "use_ssl",
				"display_name": "Use SSL",
				"type"        : "boolean",
				"description" : "Use SSL/TLS to connect to the MQTT Server",
				"default_value": true
			},
            {
            	"name"        : "client_id",
            	"display_name": "Client Id",
            	"type"        : "text",
            	"default_value": "",
            	"required"    : false
            },
            {
            	"name"        : "username",
            	"display_name": "Username",
            	"type"        : "text",
            	"default_value": "",
            	"required"    : false
            },
            {
            	"name"        : "password",
            	"display_name": "Password",
            	"type"        : "text",
            	"default_value": "",
            	"required"    : false
            },
            {
            	"name"        : "topic",
            	"display_name": "Topic",
            	"type"        : "text",
            	"description" : "The topic to subscribe and publish",
            	"required"    : true
            },
            {
            	"name"        : "json_data",
            	"display_name": "JSON messages?",
            	"type"        : "boolean",
            	"description" : "If the messages on your topic are in JSON format they will be parsed so the individual fields can be used in freeboard widgets",
            	"default_value": false
            }
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

		var currentSettings = settings;

		function onConnect() {
			console.log("Connected");
			client.subscribe(currentSettings.topic);
		};
		
		function onConnectionLost(responseObject) {
			if (responseObject.errorCode !== 0)
				console.log("onConnectionLost:"+responseObject.errorMessage);
		};

		function onMessageArrived(message) {
			data.topic = message.destinationName;
			if (currentSettings.json_data) {
				data.msg = JSON.parse(message.payloadString);
			} else {
				data.msg = message.payloadString;
			}
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
 		        message.destinationName = currentSettings.topic;
				//=================================
 		        client.send(message);
 			}
		}

		// **onSettingsChanged(newSettings)** (required) : A public function we must implement that will be called when a user makes a change to the settings.
		self.onSettingsChanged = function(newSettings)
		{

			data = {};
			currentSettings = newSettings;
			if (client.isConnected()) {
				client.disconnect();
			}
			
			client = new Paho.MQTT.Client(currentSettings.server,
										currentSettings.port, 
										currentSettings.client_id);
			client.onConnectionLost = onConnectionLost;
			client.onMessageArrived = onMessageArrived;
			client.connect({onSuccess:onConnect,
							userName: currentSettings.username,
							password: currentSettings.password,
							useSSL: currentSettings.use_ssl});
			self.updateNow();
		}

		// **updateNow()** (required) : A public function we must implement that will be called when the user wants to manually refresh the datasource
		self.updateNow = function()
		{
			// Don't need to do anything here, can't pull an update from MQTT.
		}

		// **onDispose()** (required) : A public function we must implement that will be called when this instance of this plugin is no longer needed. Do anything you need to cleanup after yourself here.
		self.onDispose = function()
		{
			if (client.isConnected()) {
				client.disconnect();
			}
			client = {};
		}

		var client = new Paho.MQTT.Client(currentSettings.server,
										currentSettings.port, 
										currentSettings.client_id);
		client.onConnectionLost = onConnectionLost;
		client.onMessageArrived = onMessageArrived;
		client.connect({onSuccess:onConnect, 
						
						userName: currentSettings.username,
						password: currentSettings.password,
						useSSL: currentSettings.use_ssl});
	}
}());