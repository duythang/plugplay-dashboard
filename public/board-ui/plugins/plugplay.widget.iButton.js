(function(){
    freeboard.loadWidgetPlugin({
        type_name: "interactive_button",
        display_name: "Button",
        description : "Button which can send a value as well as recieve one",
        settings: [
            {
                name:           "button_type",
                display_name:   "Button Type",
                type:           "option",
                description:    "Choose a style of Button",
                options: [
                            { name: 'Yellow', value: "yellow" },
                            { name: 'Red', value: "red" },
                            { name: 'Green', value: "green" },
                ]
            },
            {
                name: "title",
                display_name: "Title",
                type: "text",
                required : true,
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
            newInstanceCallback(new interactiveButtonWidgetPlugin(settings));
        }
    });

    // Add Styles
    freeboard.addStyle(".ibutton", "border-radius:50%;width:50px;height:50px;border:2px solid #3d3d3d;float:left;margin-top:15px;margin-left:110px;margin-right:10px;background-color:#909090;");
    freeboard.addStyle(".ibutton.onYellow", "background-color:#FFC773;border-color:#0;");
    freeboard.addStyle(".ibutton.onRed", "background-color:#F00003;border-color:#0;"); 
    freeboard.addStyle(".ibutton.onGreen", "background-color:#00FF00;border-color:#0;");
    freeboard.addStyle(".ibutton-text", "margin-top:35px;");
    freeboard.addStyle(".ibutton.interactive:hover", "cursor: pointer;"); 

    var interactiveButtonWidgetPlugin = function (settings) {

        var self = this;
        var titleElement = $('<h2 class="section-title"></h2>');
        var buttonElement = $('<div class="ibutton interactive"></div>');
        var stateElement = $('<div class="ibutton-text"></div>');
        var currentSettings = settings;
        var isOn = false;
        var onText;
        var offText;
  
        function updateState() {
            switch(currentSettings.button_type){
                case "yellow":
                    buttonElement.toggleClass("onRed", false);
                    buttonElement.toggleClass("onGreen", false);
                    buttonElement.toggleClass("onYellow", isOn);
                    break;
                case "red":
                    buttonElement.toggleClass("onYellow", false);
                    buttonElement.toggleClass("onGreen", false);
                    buttonElement.toggleClass("onRed", isOn);
                    break;
                case "green":
                    buttonElement.toggleClass("onRed", false);
                    buttonElement.toggleClass("onYellow", false);
                    buttonElement.toggleClass("onGreen", isOn);
                    break;
            }
            
            if (isOn) {
                stateElement.text((_.isUndefined(onText) ? (_.isUndefined(currentSettings.on_text) ? "" : currentSettings.on_text) : onText));
            }
            else {
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
            $(containerElement).append(titleElement).append(buttonElement).append(stateElement);
            $(buttonElement).click(this.onClick.bind(this));
        }

        this.onSettingsChanged = function (newSettings) {
            currentSettings = newSettings;
            titleElement.html((_.isUndefined(newSettings.title) ? "" : newSettings.title));
            updateState();
        }

        this.onCalculatedValueChanged = function (settingName, newValue) {
            switch(settingName){
                case "value":
                    //isOn = newValue;
                    newValue ? isOn = true : isOn = false;                      
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
            return 2;
        }

        this.onSettingsChanged(settings);
    };

}());