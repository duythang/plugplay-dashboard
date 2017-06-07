(function(){
    freeboard.loadWidgetPlugin({
        "type_name": "pointer",
        "display_name": "Pointer",
        "fill_size": true,
        "external_scripts": ["/board-ui/plugins/thirdparty/raphael.2.1.0.min.js"],
        "settings": [{
            "name": "direction",
            "display_name": "Direction",
            "type": "calculated",
            "description": "In degrees"
        }, {
            "name": "value_text",
            "display_name": "Value Text",
            "type": "calculated"
        }, {
            "name": "units",
            "display_name": "Units",
            "type": "text"
        }],
        newInstance: function (settings, newInstanceCallback) {
            newInstanceCallback(new pointerWidgetPlugin(settings));
        }
    });

    // Add Styles
    freeboard.addStyle("div.pointer-value", "position:absolute;height:95px;margin:auto;top: 0px;bottom: 0px;width: 100%;text-align:center;");

    var pointerWidgetPlugin = function (k) {
        var q = this;
        var j;
        var m = 3;
        var l;
        var h, p;
        var o = 0;
        var i = $('<div class="widget-big-text"></div>');
        var n = $("<div></div>");

        function r(t) {
            if (!t || t.length < 2) {
                return []
            }
            var u = [];
            u.push(["m", t[0], t[1]]);
            for (var s = 2; s < t.length; s += 2) {
                u.push(["l", t[s], t[s + 1]])
            }
            u.push(["z"]);
            return u
        }
        this.render = function(t) {
            h = $(t).width();
            p = 235;
            var s = Math.min(h, p) / 2 - m * 2;
            j = Raphael($(t).get()[0], h, p);
            var u = j.circle(h / 2, p / 2, s);
            u.attr("stroke", "#FF9900");
            u.attr("stroke-width", m);
            l = j.path(r([h / 2, (p / 2) - s + m, 15, 20, -30, 0]));
            l.attr("stroke-width", 0);
            l.attr("fill", "#fff");
            $(t).append($('<div class="pointer-value"></div>').append(i).append(n))
        };
        this.onSettingsChanged = function(s) {
            n.html(s.units)
        };
        this.onCalculatedValueChanged = function(t, v) {
            if (t == "direction") {
                if (!_.isUndefined(l)) {
                    var u = "r";
                    var s = o + 180;
                    if (s < v) {}
                    l.animate({
                        transform: "r" + v + "," + (h / 2) + "," + (p / 2)
                    }, 250, "bounce")
                }
                o = v
            } else {
                if (t == "value_text") {
                    i.html(v)
                }
            }
        };
        this.onDispose = function() {};
        this.getHeight = function() {
            return 4
        };
        this.onSettingsChanged(k)
    };

}());