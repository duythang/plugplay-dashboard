!function(){
    var e = 1e3,
        n = 0;
    freeboard.addStyle(".slider", "border: 2px solid #3d3d3d;background-color: #222;margin: 10px;"),
    freeboard.addStyle(".slider-label", "margin-left: 10px; margin-top: 10px; text-transform: capitalize;"),
    freeboard.addStyle(".ui-slider-range", "background: #F90;"),
    freeboard.loadWidgetPlugin({
        type_name: "interactive_slider",
        display_name: "Slider",
        description: "Interactive Slider Plugin",
        external_scripts: [
            "https://code.jquery.com/ui/1.12.0/jquery-ui.js",
            "https://code.jquery.com/ui/1.12.0/themes/base/jquery-ui.css"
            //"/board-ui/plugins/thirdparty/jquery-ui.js",
            //"/board-ui/plugins/thirdparty/jquery-ui.css"
        ],
        fill_size: !0,
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
                type: "calculated"
            }, 
            {
                name: "callback",
                display_name: "Datasource to publish",
                type: "calculated"
            },
            {
                name: "min",
                display_name: "Min",
                type: "text",
                default_value: 0
            }, 
            {
                name: "max",
                display_name: "Max",
                type: "text",
                default_value: 100
            }, 
        ],
        newInstance: function(e, n) {
            n(new a(e))
        }
    });

    var a = function(a) {
        var i = this,
            t = a,
            l = "slider-" + n++,
            d = $('<div class="slider-widget slider-label" id="__' + l + '"></div>'),
            o = $('<h2 class="section-title slider-label"></h2>'),
            r = $('<div id="value-' + l + '" style="display:inline-block; padding-left: 10px; font-weight:bold; color: #d3d4d4" ></div>'),
            s = $('<div class="slider interactive" id="' + l + '"></div>'),
            u = "#" + l,
            c = _.isUndefined(t.value) ? 50 : t.value;
        o.html(_.isUndefined(t.title) ? "" : t.title);
        var p = _.isUndefined(t.min) ? 0 : t.min,
            g = _.isUndefined(t.max) ? 100 : t.max;

        i.render = function(e) {
            $(e).append(d), o.appendTo(d), $(o).append(r), s.appendTo(d), 
            $(u).slider({
                classes: {
                    "ui-slider-range": "ui-corner-all"
                },
                value: c,
                min: p,
                max: g,
                orientation: "horizontal",
                range: "min",
                animate: "fast",
                slide: function(e, n) {
                    $("#value-" + l).html(n.value)
                },
                stop: function(e, n) {
                    //console.log("stop: ", n.value), 
                    //freeboard.showDialog($("<div align='center'>url undefined</div>"), "Error!", "OK", null, function() {}) : 
                    var v = {
                            device: t.title,
                            data0: n.value,
                            data1: '',
                            data2: '',
                        };
                    i.sendValue(t.callback, v)
                }
            }).removeClass("ui-widget-content")
        }, 

        i.onSettingsChanged = function(e) {
            t = e, o.html(_.isUndefined(e.title) ? "" : e.title), $(o).append(r)
        },

        i.onCalculatedValueChanged = function(e, n) {
            //console.log("valueChanged:", e, n),
            "value" == e && ($(r).html(n), $(u).slider("value", n));
            //"max" == e && (n > p ? (g = n, $(u).slider("option", "max", n)) : (t.max = g, freeboard.showDialog($("<div align='center'> Max value cannot be lower than Min value!</div>"), "Warning!", "OK", null, function() {}))), 
            //"min" == e && (n < g ? (p = n, $(u).slider("option", "min", n)) : (t.min = p, freeboard.showDialog($("<div align='center'> Min value cannot be greater than Max value!</div>"), "Warning!", "OK", null, function() {})));
        };

        var m;

        i.onDispose = function(){
        },

        i.getHeight = function() {
            return "big" == t.size ? 2 : 1
        } 
    }
}();

/*
!function() {
    var e = 1e3,
        n = 0;
    freeboard.addStyle(".slider", "border: 2px solid #3d3d3d;background-color: #222;margin: 10px;"),
    freeboard.addStyle(".slider-label", "margin-left: 10px; margin-top: 10px; text-transform: capitalize;"),
    freeboard.addStyle(".ui-slider-range", "background: #F90;"),
    freeboard.loadWidgetPlugin({
        type_name: "slider_plugin",
        display_name: "Slider",
        description: "Interactive Slider Plugin",
        external_scripts: [
            "https://code.jquery.com/ui/1.12.0/jquery-ui.js",
            "https://code.jquery.com/ui/1.12.0/themes/base/jquery-ui.css"
        ],
        fill_size: !0,
        settings: [{
            name: "title",
            display_name: "Title",
            type: "text"
        }, {
            name: "min",
            display_name: "Min",
            type: "calculated",
            default_value: "0"
        }, {
            name: "max",
            display_name: "Max",
            type: "calculated",
            default_value: "100"
        }, {
            name: "value",
            display_name: "Value",
            type: "calculated"
        }, {
            name: "url",
            display_name: "url On Changed %VALUE% ",
            type: "calculated"
        }],
        newInstance: function(e, n) {
            n(new a(e))
        }
    });
    var a = function(a) {
        var i = this,
            t = a,
            l = "slider-" + n++,
            d = $('<div class="slider-widget slider-label" id="__' + l + '"></div>'),
            o = $('<h2 class="section-title slider-label"></h2>'),
            r = $('<div id="value-' + l + '" style="display:inline-block; padding-left: 10px; font-weight:bold; color: #d3d4d4" ></div>'),
            s = $('<div class="slider" id="' + l + '"></div>'),
            u = "#" + l,
            c = _.isUndefined(t.value) ? 50 : t.value;
        o.html(_.isUndefined(t.title) ? "" : t.title);
        var p = _.isUndefined(t.min) ? 0 : t.min,
            g = _.isUndefined(t.max) ? 100 : t.max;
        i.render = function(e) {
            $(e).append(d), o.appendTo(d), $(o).append(r), s.appendTo(d), $(u).slider({
                classes: {
                    "ui-slider-range": "ui-corner-all"
                },
                value: c,
                min: p,
                max: g,
                orientation: "horizontal",
                range: "min",
                animate: "slow",
                slide: function(e, n) {
                    $("#value-" + l).html(n.value)
                },
                stop: function(e, n) {
                    console.log("stop: ", n.value), _.isUndefined(t.url) ? freeboard.showDialog($("<div align='center'>url undefined</div>"), "Error!", "OK", null, function() {}) : i.sendValue(t.url, n.value)
                }
            }).removeClass("ui-widget-content")
        }, 

        i.getHeight = function() {
            return "big" == t.size ? 2 : 1
        }, 

        i.onSettingsChanged = function(e) {
            t = e, o.html(_.isUndefined(e.title) ? "" : e.title), $(o).append(r)
        },

        i.onCalculatedValueChanged = function(e, n) {
            console.log("valueChanged:", e, n), "value" == e && ($(r).html(n), $(u).slider("value", n)), "max" == e && (n > p ? (g = n, $(u).slider("option", "max", n)) : (t.max = g, freeboard.showDialog($("<div align='center'> Max value cannot be lower than Min value!</div>"), "Warning!", "OK", null, function() {}))), "min" == e && (n < g ? (p = n, $(u).slider("option", "min", n)) : (t.min = p, freeboard.showDialog($("<div align='center'> Min value cannot be greater than Max value!</div>"), "Warning!", "OK", null, function() {})))
        };

        var m;

        i.sendValue = function(e, n) {
            return console.log(e, n), 
            (m = new XMLHttpRequest) ? 
            (m.onreadystatechange = this.alertContents, m.open("GET", e.replace("%VALUE%", n), !0), freeboard.showLoadingIndicator(!0), void m.send()) : 
            (console.log("Giving up :( Cannot create an XMLHTTP instance"), !1)
        },

        this.alertContents = function() {
            m.readyState === XMLHttpRequest.DONE && (200 === m.status ? 
            (console.log(m.responseText),setTimeout(function() {
                    freeboard.showLoadingIndicator(!1)
                },e)) : 
            (console.log("There was a problem with the request."), setTimeout(function() {
                    freeboard.showLoadingIndicator(!1),
                    freeboard.showDialog($("<div align='center'>There was a problem with the request. Code " + m.status + m.responseText + " </div>"), "Error!", "OK", null, function() {})
                }, e)))
        },

        i.onDispose = function(){

        }
    }
}(); 
*/