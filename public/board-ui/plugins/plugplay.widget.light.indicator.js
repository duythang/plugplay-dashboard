(function(){
    freeboard.loadWidgetPlugin({
        type_name: "light",
        display_name: "Light (Indicator)",
        description : "A Indicator Light only recieves true or false input value",
        settings: [
            {
                name:           "light_type",
                display_name:   "Light Type",
                type:           "option",
                description:    "Choose a style of Light",
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
                required: true
            },
            {
                name: "value",
                display_name: "Value",
                type: "calculated",
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
            newInstanceCallback(new lightWidgetPlugin(settings));
        }
    });

    // Add Styles here. This style is same with statusLight.js. So, should create a global .css file (TODO)
    freeboard.addStyle(".indicator-light", "border-radius:50%;width:22px;height:22px;border:2px solid #3d3d3d;float:left;margin-top:5px;margin-left:0px;margin-right:10px;background-color:#909090;"), 
    freeboard.addStyle(".indicator-light.onYellow", "background-color:#FFC773;box-shadow: 0px 0px 15px #FF9900;border-color:#FDF1DF;");
    freeboard.addStyle(".indicator-light.onRed", "background-color:#F00003;box-shadow: 0px 0px 15px #FF9900;border-color:#FDF1DF;"); 
    freeboard.addStyle(".indicator-light.onGreen", "background-color:#00FF00;box-shadow: 0px 0px 15px #FF9900;border-color:#FDF1DF;");
    freeboard.addStyle(".indicator-light-text", "margin-top:10px;");
     
    var lightWidgetPlugin = function (settings) {

        var self = this;
        var titleElement = $('<h2 class="section-title"></h2>');
        var stateElement = $('<div class="indicator-light-text"></div>');
        var indicatorElement = $('<div class="indicator-light"></div>');
        var currentSettings = settings;
        var isOn = false;
        var onText;
        var offText;

  
        function updateState() {
            switch(currentSettings.light_type){
                case "yellow":
                    indicatorElement.toggleClass("onRed", false);
                    indicatorElement.toggleClass("onGreen", false);
                    indicatorElement.toggleClass("onYellow", isOn);
                    break;
                case "red":
                    indicatorElement.toggleClass("onYellow", false);
                    indicatorElement.toggleClass("onGreen", false);
                    indicatorElement.toggleClass("onRed", isOn);
                    break;
                case "green":
                    indicatorElement.toggleClass("onRed", false);
                    indicatorElement.toggleClass("onYellow", false);
                    indicatorElement.toggleClass("onGreen", isOn);
                    break;
            }
            
            if (isOn) {
                stateElement.text((_.isUndefined(onText) ? (_.isUndefined(currentSettings.on_text) ? "" : currentSettings.on_text) : onText));
            }
            else {
                stateElement.text((_.isUndefined(offText) ? (_.isUndefined(currentSettings.off_text) ? "" : currentSettings.off_text) : offText));
            }
        }

        this.render = function (element) {
            $(element).append(titleElement).append(indicatorElement).append(stateElement);
        }

        this.onSettingsChanged = function (newSettings) {
            currentSettings = newSettings;
            titleElement.html((_.isUndefined(newSettings.title) ? "" : newSettings.title));
            updateState();
        }

        this.onCalculatedValueChanged = function (settingName, newValue){
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
            return 1;
        }

        this.onSettingsChanged(settings);
    };

}());