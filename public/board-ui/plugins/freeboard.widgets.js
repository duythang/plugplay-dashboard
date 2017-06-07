/** 
 * WIDGET IMPLEMENTATION
*/
(function() {
    
    // Sparkline
    freeboard.addStyle(".sparkline", "width:100%;height: 75px;");
    var j = function(a) {
        var d = $('<h2 class="section-title"></h2>'),
            e = $('<div class="sparkline"></div>'),
            f = $("<div></div>"),
            g = a;
        this.render = function(a) {
            $(a).append(d).append(e).append(f)
        },

        this.onSettingsChanged = function(a) {
            g = a, 
            d.html(_.isUndefined(a.title) ? "" : a.title), 
            a.include_legend && b(f, a.legend.split(","))
        }, 
        
        this.onCalculatedValueChanged = function(a, b) {
            g.legend ? c(e, b, g.legend.split(",")) : c(e, b)
        }, 
        
        this.onDispose = function() {}, 
        this.getHeight = function() {
            var a = 0;
            if (g.include_legend && g.legend) {
                var b = g.legend.split(",").length;
                b > 4 ? a = .5 * Math.floor((b - 1) / 4) : b && (a = .5)
            }
            return 2 + a
        }, 
        this.onSettingsChanged(a)
    };
    freeboard.loadWidgetPlugin({
        type_name: "sparkline",
        display_name: "Time series (Sparkline)",
        external_scripts: ["/board-ui/plugins/thirdparty/jquery.sparkline.min.js"],
        settings: [{
            name: "title",
            display_name: "Title",
            type: "text"
        }, {
            name: "value",
            display_name: "Value",
            type: "calculated",
            multi_input: "true"
        }, {
            name: "include_legend",
            display_name: "Include Legend",
            type: "boolean"
        }, {
            name: "legend",
            display_name: "Legend",
            type: "text",
            description: "Comma-separated for multiple sparklines"
        }],
        newInstance: function(a, b) {
            b(new j(a))
        }
    });

    // Text
    function a(a, b, c) {
        var d = $(b).text();
        if (d != a)
            if ($.isNumeric(a) && $.isNumeric(d)) {
                var e = a.toString().split("."),
                    f = 0;
                e.length > 1 && (f = e[1].length), e = d.toString().split(".");
                var g = 0;
                e.length > 1 && (g = e[1].length), jQuery({
                    transitionValue: Number(d),
                    precisionValue: g
                }).animate({
                    transitionValue: Number(a),
                    precisionValue: f
                }, {
                    duration: c,
                    step: function() {
                        $(b).text(this.transitionValue.toFixed(this.precisionValue))
                    },
                    done: function() {
                        $(b).text(a)
                    }
                })
            } else
                $(b).text(a)
    }

    function b(a, b) {
        for (var c = $("<div class='sparkline-legend'></div>"), d = 0; d < b.length; d++) {
            var f = e[d % e.length],
                g = b[d];
            c.append("<div class='sparkline-legend-value'><span style='color:" + f + "'>&#9679;</span>" + g + "</div>")
        }
        a.empty().append(c), freeboard.addStyle(".sparkline-legend", "margin:5px;"), freeboard.addStyle(".sparkline-legend-value", "color:white; font:10px arial,san serif; float:left; overflow:hidden; width:50%;"), freeboard.addStyle(".sparkline-legend-value span", "font-weight:bold; padding-right:5px;")
    }

    function c(a, b, c) {
        var f = $(a).data().values,
            g = $(a).data().valueMin,
            h = $(a).data().valueMax;
        f || (f = [], g = void 0, h = void 0);
        var i = function(a, b) {
            f[b] || (f[b] = []), f[b].length >= d && f[b].shift(), f[b].push(Number(a)), (void 0 === g || g > a) && (g = a), (void 0 === h || a > h) && (h = a)
        };
        _.isArray(b) ? _.each(b, i) : i(b, 0), $(a).data().values = f, $(a).data().valueMin = g, $(a).data().valueMax = h;
        var j = '<span style="color: {{color}}">&#9679;</span> {{y}}',
            k = !1;
        _.each(f, function(b, d) {
            $(a).sparkline(b, {
                type: "line",
                composite: k,
                height: "100%",
                width: "100%",
                fillColor: !1,
                lineColor: e[d % e.length],
                lineWidth: 2,
                spotRadius: 3,
                spotColor: !1,
                minSpotColor: "#78AB49",
                maxSpotColor: "#78AB49",
                highlightSpotColor: "#9D3926",
                highlightLineColor: "#9D3926",
                chartRangeMin: g,
                chartRangeMax: h,
                tooltipFormat: c && c[d] ? j + " (" + c[d] + ")" : j
            }), k = !0
        })
    }
    var d = 100,
        e = ["#FF9900", "#FFFFFF", "#B3B4B4", "#6B6B6B", "#28DE28", "#13F7F9", "#E6EE18", "#C41204", "#CA3CB8", "#0B1CFB"],
        f = freeboard.getStyleString("values");
    freeboard.addStyle(".widget-big-text", f + "font-size:75px;"), freeboard.addStyle(".tw-display", "width: 100%; height:100%; display:table; table-layout:fixed;"), freeboard.addStyle(".tw-tr", "display:table-row;"), freeboard.addStyle(".tw-tg", "display:table-row-group;"), freeboard.addStyle(".tw-tc", "display:table-caption;"), freeboard.addStyle(".tw-td", "display:table-cell;"), freeboard.addStyle(".tw-value", f + "overflow: hidden;display: inline-block;text-overflow: ellipsis;"), freeboard.addStyle(".tw-unit", "display: inline-block;padding-left: 10px;padding-bottom: 1.1em;vertical-align: bottom;"), freeboard.addStyle(".tw-value-wrapper", "position: relative;vertical-align: middle;height:100%;"), freeboard.addStyle(".tw-sparkline", "height:20px;");
    var g = function(b) {
        function d() {
            _.isUndefined(e.units) || "" == e.units ? h.css("max-width", "100%") : h.css("max-width", f.innerWidth() - i.outerWidth(!0) + "px")
        }
        var e = b,
            f = $('<div class="tw-display"></div>'),
            g = $('<h2 class="section-title tw-title tw-td"></h2>'),
            h = $('<div class="tw-value"></div>'),
            i = $('<div class="tw-unit"></div>'),
            j = $('<div class="tw-sparkline tw-td"></div>');
        this.render = function(a) {
            $(a).empty(), $(f).append($('<div class="tw-tr"></div>').append(g)).append($('<div class="tw-tr"></div>').append($('<div class="tw-value-wrapper tw-td"></div>').append(h).append(i))).append($('<div class="tw-tr"></div>').append(j)), $(a).append(f), d()
        }, this.onSettingsChanged = function(a) {
            e = a;
            var b = !_.isUndefined(a.title) && "" != a.title,
                c = !_.isUndefined(a.units) && "" != a.units;
            a.sparkline ? j.attr("style", null) : (delete j.data().values, j.empty(), j.hide()), b ? (g.html(_.isUndefined(a.title) ? "" : a.title), g.attr("style", null)) : (g.empty(), g.hide()), c ? (i.html(_.isUndefined(a.units) ? "" : a.units), i.attr("style", null)) : (i.empty(), i.hide());
            var f = 30;
            "big" == a.size && (f = 75, a.sparkline && (f = 60)), h.css({
                "font-size": f + "px"
            }), d()
        }, this.onSizeChanged = function() {
            d()
        }, this.onCalculatedValueChanged = function(b, d) {
            "value" == b && (e.animate ? a(d, h, 500) : h.text(d), e.sparkline && c(j, d))
        }, this.onDispose = function() {}, this.getHeight = function() {
            return "big" == e.size || e.sparkline ? 2 : 1
        }, this.onSettingsChanged(b)
    };
    freeboard.loadWidgetPlugin({
        type_name: "text_widget",
        display_name: "Text",
        external_scripts: ["/board-ui/plugins/thirdparty/jquery.sparkline.min.js"],
        settings: [{
            name: "title",
            display_name: "Title",
            type: "text"
        }, {
            name: "size",
            display_name: "Size",
            type: "option",
            options: [{
                name: "Regular",
                value: "regular"
            }, {
                name: "Big",
                value: "big"
            }]
        }, {
            name: "value",
            display_name: "Value",
            type: "calculated"
        }, {
            name: "sparkline",
            display_name: "Include Sparkline",
            type: "boolean"
        }, {
            name: "animate",
            display_name: "Animate Value Changes",
            type: "boolean",
            default_value: !0
        }, {
            name: "units",
            display_name: "Units",
            type: "text"
        }],
        newInstance: function(a, b) {
            b(new g(a))
        }
    });

    // Picture
    var l = function(a) {
        function b() {
            e && (clearInterval(e), e = null)
        }

        function c() {
            if (d && f) {
                var a = f + (-1 == f.indexOf("?") ? "?" : "&") + Date.now();
                $(d).css({
                    "background-image": "url(" + a + ")"
                })
            }
        }
        var d, e, f;
        this.render = function(a) {
            $(a).css({
                width: "100%",
                height: "100%",
                "background-size": "cover",
                "background-position": "center"
            }), d = a
        }, this.onSettingsChanged = function(a) {
            b(), a.refresh && a.refresh > 0 && (e = setInterval(c, 1e3 * Number(a.refresh)))
        }, this.onCalculatedValueChanged = function(a, b) {
            "src" == a && (f = b), c()
        }, this.onDispose = function() {
            b()
        }, this.getHeight = function() {
            return 4
        }, this.onSettingsChanged(a)
    };
    freeboard.loadWidgetPlugin({
        type_name: "picture",
        display_name: "Picture",
        fill_size: !0,
        settings: [{
            name: "src",
            display_name: "Image URL",
            type: "calculated"
        }, {
            type: "number",
            display_name: "Refresh every",
            name: "refresh",
            suffix: "seconds",
            description: "Leave blank if the image doesn't need to be refreshed"
        }],
        newInstance: function(a, b) {
            b(new l(a))
        }
    });
    
    // Google Map
    freeboard.addStyle(".gm-style-cc a", "text-shadow:none;");
    var n = function(a) {
        function b() {
            if (c && d && f.lat && f.lon) {
                var a = new google.maps.LatLng(f.lat, f.lon);
                d.setPosition(a), c.panTo(a)
            }
        }
        var c, d, e = a,
            f = {};
        this.render = function(a) {
            function e() {
                var e = {
                    zoom: 13,
                    center: new google.maps.LatLng(37.235, -115.811111),
                    disableDefaultUI: !0,
                    draggable: !1,
                    styles: [{
                        featureType: "water",
                        elementType: "geometry",
                        stylers: [{
                            color: "#2a2a2a"
                        }]
                    }, {
                        featureType: "landscape",
                        elementType: "geometry",
                        stylers: [{
                            color: "#000000"
                        }, {
                            lightness: 20
                        }]
                    }, {
                        featureType: "road.highway",
                        elementType: "geometry.fill",
                        stylers: [{
                            color: "#000000"
                        }, {
                            lightness: 17
                        }]
                    }, {
                        featureType: "road.highway",
                        elementType: "geometry.stroke",
                        stylers: [{
                            color: "#000000"
                        }, {
                            lightness: 29
                        }, {
                            weight: .2
                        }]
                    }, {
                        featureType: "road.arterial",
                        elementType: "geometry",
                        stylers: [{
                            color: "#000000"
                        }, {
                            lightness: 18
                        }]
                    }, {
                        featureType: "road.local",
                        elementType: "geometry",
                        stylers: [{
                            color: "#000000"
                        }, {
                            lightness: 16
                        }]
                    }, {
                        featureType: "poi",
                        elementType: "geometry",
                        stylers: [{
                            color: "#000000"
                        }, {
                            lightness: 21
                        }]
                    }, {
                        elementType: "labels.text.stroke",
                        stylers: [{
                            visibility: "on"
                        }, {
                            color: "#000000"
                        }, {
                            lightness: 16
                        }]
                    }, {
                        elementType: "labels.text.fill",
                        stylers: [{
                            saturation: 36
                        }, {
                            color: "#000000"
                        }, {
                            lightness: 40
                        }]
                    }, {
                        elementType: "labels.icon",
                        stylers: [{
                            visibility: "off"
                        }]
                    }, {
                        featureType: "transit",
                        elementType: "geometry",
                        stylers: [{
                            color: "#000000"
                        }, {
                            lightness: 19
                        }]
                    }, {
                        featureType: "administrative",
                        elementType: "geometry.fill",
                        stylers: [{
                            color: "#000000"
                        }, {
                            lightness: 20
                        }]
                    }, {
                        featureType: "administrative",
                        elementType: "geometry.stroke",
                        stylers: [{
                            color: "#000000"
                        }, {
                            lightness: 17
                        }, {
                            weight: 1.2
                        }]
                    }]
                };
                c = new google.maps.Map(a, e), google.maps.event.addDomListener(a, "mouseenter", function(a) {
                    a.cancelBubble = !0, c.hover || (c.hover = !0, c.setOptions({
                        zoomControl: !0
                    }))
                }), google.maps.event.addDomListener(a, "mouseleave", function(a) {
                    c.hover && (c.setOptions({
                        zoomControl: !1
                    }), c.hover = !1)
                }), d = new google.maps.Marker({
                    map: c
                }), b()
            }
            window.google && window.google.maps ? e() : (window.gmap_initialize = e, head.js("https://maps.googleapis.com/maps/api/js?key=AIzaSyCPFGeztk6vSPsEuc76sYZSbzvRYYiRdGM&callback=gmap_initialize"))
        }, this.onSettingsChanged = function(a) {
            e = a
        }, this.onCalculatedValueChanged = function(a, c) {
            "lat" == a ? f.lat = c : "lon" == a && (f.lon = c), b()
        }, this.onDispose = function() {}, this.getHeight = function() {
            return 4
        }, this.onSettingsChanged(a)
    };
    freeboard.loadWidgetPlugin({
        type_name: "google_map",
        display_name: "Google Map",
        fill_size: !0,
        settings: [{
            name: "lat",
            display_name: "Latitude",
            type: "calculated"
        }, {
            name: "lon",
            display_name: "Longitude",
            type: "calculated"
        }],
        newInstance: function(a, b) {
            b(new n(a))
        }
    }) 
}());