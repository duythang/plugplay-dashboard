(function(){
    freeboard.loadWidgetPlugin({
        type_name: "interactive_toggle",
        display_name: "Toggle",
        description : "Toggle which can send a value as well as recieve one",
        settings: [
            {
                name: "title",
                display_name: "Title",
                type: "text",
                required: true
            },
            {
                name: "value",
                display_name: "Value",
                type: "calculated",
            },
            {
                name: "callback",
                display_name: "Datasource to publish",
                type: "calculated"
            },
            {
                name: "on_text",
                display_name: "On Text",
                type: "text"
            },
            {
                name: "off_text",
                display_name: "Off Text",
                type: "text"
            },
        ],
        newInstance: function (settings, newInstanceCallback) {
            newInstanceCallback(new interactiveToggleWidgetPlugin(settings));
        }
    });

    // Add Styles
    
    freeboard.addStyle(".itoggle", "position:relative;display:inline-block;width:60px;height:34px;float:left;margin-left:90px; margin-right:10px;");
    freeboard.addStyle(".itoggle input", "display:none;");
    freeboard.addStyle(".switch", "position: absolute;cursor: pointer;top: 0;left: 0;right: 0;bottom: 0;" +
                        "background-color: #ccc;-webkit-transition: .4s;transition: .4s;"); 
    freeboard.addStyle(".switch:before", "position: absolute;content:'';height: 26px;width: 26px;left: 4px;" + 
                        "bottom: 4px;background-color: white;webkit-transition: .4s;transition: .4s;");
    freeboard.addStyle("input:checked + .switch", "background-color: #74d21a;");
    freeboard.addStyle("input:focus + .switch", "box-shadow: 0 0 1px #74d21a;");
    freeboard.addStyle("input:checked + .switch:before", "-webkit-transform: translateX(26px);-ms-transform: translateX(26px);transform: translateX(26px);"); 
    freeboard.addStyle(".switch.round", "border-radius: 34px;"); 
    freeboard.addStyle(".switch.round:before", "border-radius: 50%;");
    freeboard.addStyle(".itoggle-text", "margin-top:10px;"); 

    var toggleID = 0;
    var interactiveToggleWidgetPlugin = function (settings) {
        var self = this;
        var thisToggleID = 'itoggle-' + toggleID++;
        var titleElement = $('<h2 class="section-title"></h2>');
        var toggleElement = $('<label class="itoggle"><input id="' + thisToggleID + '" type="checkbox"><div class="switch"></div>label>');
        var stateElement = $('<div class="itoggle-text"></div>');
        var currentSettings = settings;
        var isOn = false;
        var onText;
        var offText;
  
        function updateState() {
            $('#'+thisToggleID).prop('checked', isOn);
            if (isOn) {
                stateElement.text((_.isUndefined(onText) ? (_.isUndefined(currentSettings.on_text) ? "" : currentSettings.on_text) : onText));
            }else {
                stateElement.text((_.isUndefined(offText) ? (_.isUndefined(currentSettings.off_text) ? "" : currentSettings.off_text) : offText));
            }
        }

        this.onClick = function(e) { 
            e.preventDefault()
            var new_val = !isOn;
            this.onCalculatedValueChanged('value', new_val);

            new_val ? new_val = 1 : new_val = 0;
            var value = {
                device: currentSettings.title,
                data0: new_val,
                data1: '',
                data2: '',
            };

            this.sendValue(currentSettings.callback, value);
        }


        this.render = function (containerElement) {
            $(containerElement).append(titleElement).append(toggleElement).append(stateElement);
            $('#'+thisToggleID).change(this.onClick.bind(this));
        }

        this.onSettingsChanged = function (newSettings) {
            currentSettings = newSettings;
            titleElement.html((_.isUndefined(newSettings.title) ? "" : newSettings.title));
            updateState();
        }

        this.onCalculatedValueChanged = function (settingName, newValue) {
            switch(settingName){
                case "value":
                    isOn = newValue;           
                    break;
                case "on_text":
                    onText = newValue;
                    break;
                case "off_text":
                    offText = newValue;
                    break;
            }

            updateState();
        }

        this.onDispose = function () {
        }

        this.getHeight = function () {
            return 1;
        }

        this.onSettingsChanged(settings);
    };

}());