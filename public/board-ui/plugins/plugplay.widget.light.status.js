(function(){
    freeboard.loadWidgetPlugin({
        type_name: "status_light",
        display_name: "Light (Status)",
        description : "A Status Light can recieves 3 input values",
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
                name: "min_value",
                display_name: "Minimum",
                type: "text",
                required : true,
            },
            {
                name: "normal_value",
                display_name: "Normal",
                type: "text",
                required : true,
            },
            {
                name: "max_value",
                display_name: "Maximum",
                type: "text",
                required : true,
            },
            {
                name: "min_text",
                display_name: "Minimum Text",
                type: "text"
            },
            {
                name: "normal_text",
                display_name: "Normal Text",
                type: "text"
            },
            {
                name: "max_text",
                display_name: "Max Text",
                type: "text"
            },
        ],
        newInstance: function (settings, newInstanceCallback) {
            newInstanceCallback(new statusLightWidgetPlugin(settings));
        }
    });

    // Add Styles Here. This style is same with light.js. So, should create a global .css file (TODO)
    freeboard.addStyle(".indicator-slight", "border-radius:50%;width:22px;height:22px;border:2px solid #3d3d3d;float:left;margin-top:5px;margin-left:0px;margin-right:10px;background-color:#909090;"), 
    freeboard.addStyle(".indicator-slight.onYellow", "background-color:#FFC773;box-shadow: 0px 0px 15px #FF9900;border-color:#FDF1DF;");
    freeboard.addStyle(".indicator-slight.onRed", "background-color:#F00003;box-shadow: 0px 0px 15px #FF9900;border-color:#FDF1DF;"); 
    freeboard.addStyle(".indicator-slight.onGreen", "background-color:#00FF00;box-shadow: 0px 0px 15px #FF9900;border-color:#FDF1DF;");
    freeboard.addStyle(".indicator-slight-text", "margin-top:10px;");
     
    var statusLightWidgetPlugin = function (settings) {

        var self = this;
        var titleElement = $('<h2 class="section-title"></h2>');
        var stateElement = $('<div class="indicator-slight-text"></div>');
        var indicatorElement = $('<div class="indicator-slight"></div>');
        var currentSettings = settings;
        var status = 'off';
        var minText, normalText, maxText;
        var minValue, normalValue, maxValue;

        function updateState() {
            switch(status){
                case 'off':
                    indicatorElement.toggleClass("onRed", false);
                    indicatorElement.toggleClass("onGreen", false);
                    indicatorElement.toggleClass("onYellow", false);
                    stateElement.text("OFF");
                    break;
                case 'yellow':
                    indicatorElement.toggleClass("onRed", false);
                    indicatorElement.toggleClass("onGreen", false);
                    indicatorElement.toggleClass("onYellow", true);
                    stateElement.text((_.isUndefined(minText) ? (_.isUndefined(currentSettings.min_text) ? "" : currentSettings.min_text) : minText));
                    break;
                case 'green':
                    indicatorElement.toggleClass("onRed", false);
                    indicatorElement.toggleClass("onYellow", false);
                    indicatorElement.toggleClass("onGreen", true);
                    stateElement.text((_.isUndefined(normalText) ? (_.isUndefined(currentSettings.normal_text) ? "" : currentSettings.normal_text) : normalText));
                    break;
                case 'red':
                    indicatorElement.toggleClass("onYellow", false);
                    indicatorElement.toggleClass("onGreen", false);
                    indicatorElement.toggleClass("onRed", true);
                    stateElement.text((_.isUndefined(maxText) ? (_.isUndefined(currentSettings.max_text) ? "" : currentSettings.max_text) : maxText));
                    break;
            }

            minValue = Number(currentSettings.min_value);
            normalValue = Number(currentSettings.normal_value);
            maxValue = Number(currentSettings.max_value);
        }

        this.render = function (element) {
            $(element).append(titleElement).append(indicatorElement).append(stateElement);
        }

        this.onSettingsChanged = function (newSettings) {
            currentSettings = newSettings;
            titleElement.html((_.isUndefined(newSettings.title) ? "" : newSettings.title));
            updateState();
        }

        this.onCalculatedValueChanged = function (settingName, newValue) {
            switch(settingName){
                case "value":
                    var temValue = newValue;
                    if (temValue <= minValue){
                        status = 'off';
                    }else if(minValue < temValue && temValue <= normalValue){
                        status = 'yellow';
                    }else if(normalValue < temValue && temValue <= maxValue){
                        status = 'green';
                    }else if(maxValue < temValue){
                        status = 'red';
                    }else{
                        return;
                    }
                    break;
                case "min_text":
                    minText = newValue;
                    break;
                case "normal_text":
                    normalText = newValue;
                    break;
                case "max_text":
                    maxText = newValue;
                    break;
                default:
                    return;
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