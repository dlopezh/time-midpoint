window.Mapnificent = (function (f, h, c, b) {
    var k = function () {
        return new google.maps.ImageMapType({
            getTileUrl: function (m, l) {
                return "http://tile.openstreetmap.org/" + l + "/" + m.x + "/" + m.y + ".png"
            },
            tileSize: new google.maps.Size(256, 256),
            isPng: true,
            maxZoom: 18,
            name: "OSM"
        })
    };
    var d = (function () {
        function l(m, p, n, o) {
            this.point = m;
            this.addclb = n;
            this.canvasID = p;
            this.hidden = false;
            this.map_ = o;
            this.div_ = null;
            this.setMap(o)
        }
        l.prototype = new google.maps.OverlayView();
        l.prototype.onAdd = function () {
            var o = h.createElement("DIV");
            o.style.border = "none";
            o.style.borderWidth = "0px";
            o.style.position = "absolute";
            var n = h.createElement("canvas");
            n.id = this.canvasID;
            n.width = 20;
            n.height = 20;
            o.appendChild(n);
            this.div_ = o;
            this.hasCalledCallback = false;
            var m = this.getPanes();
            m.mapPane.appendChild(o)
        };
        l.prototype.draw = function () {
            var n = this.getProjection().fromLatLngToDivPixel(this.point);
            var m = parseInt(this.div_.clientHeight, 10);
            this.div_.style.left = (n.x) + "px";
            this.div_.style.top = (n.y - m) + "px";
            if (!this.hasCalledCallback) {
                this.hasCalledCallback = true;
                this.addclb()
            }
        };
        l.prototype.fromLatLngToDivPixel = function (m) {
            return this.getProjection().fromLatLngToDivPixel(m)
        };
        l.prototype.fromDivPixelToLatLng = function (m) {
            return this.getProjection().fromDivPixelToLatLng(m)
        };
        l.prototype.setPoint = function (m) {
            this.point = m;
            this.draw()
        };
        l.prototype.getPoint = function () {
            return this.point
        };
        l.prototype.onRemove = function () {
            this.div_.parentNode.removeChild(this.div_);
            this.div_ = null
        };
        l.prototype.hide = function () {
            if (this.div_) {
                this.div_.style.visibility = "hidden"
            }
        };
        l.prototype.show = function () {
            if (this.div_) {
                this.div_.style.visibility = "visible"
            }
        };
        l.prototype.toggle = function () {
            if (this.div_) {
                if (this.div_.style.visibility == "hidden") {
                    this.show()
                } else {
                    this.hide()
                }
            }
        };
        l.prototype.toggleDOM = function () {
            if (this.getMap()) {
                this.setMap(null)
            } else {
                this.setMap(this.map_)
            }
        };
        return l
    }());
    var e = 0;
    var j = {};
    var i = 5;
    var g = {};
    var a = function (t) {
        var r = {};
        var q = {};
        var l = false;
        var s = false;
        var m = false;
        var n = false;
        var w = t || {};
        var p = {
            mapStartZoom: 11,
            dataUrlPrefix: "http://mapnificent.stefanwehrmeyer.com/data/",
            mapStartCenter: {
                lat: 52.51037058766109,
                lng: 13.333282470703125
            },
            mapStyles: {
                Night: [{
                    featureType: "all",
                    elementType: "all",
                    stylers: [{
                        invert_lightness: true
                    }]
                }]
            },
            startMapStyle: null,
            mapTypes: {
                OSM: k()
            },
            startMapType: google.maps.MapTypeId.ROADMAP,
            mapTypeIds: [google.maps.MapTypeId.ROADMAP],
            heightCacheFactor: 4,
            widthCacheFactor: 4,
            layerSettings: {}
        };
        r.env = {};
        for (var v in p) {
            if (w[v] !== b) {
                r.env[v] = w[v]
            } else {
                r.env[v] = p[v]
            }
        }
        if (w.layerSettings !== b) {
            r.env.layerSettings = w.layerSettings
        }
        r.env.mapGStartCenter = new google.maps.LatLng(r.env.mapStartCenter.lat, r.env.mapStartCenter.lng);
        r.env.circleRadians = (Math.PI / 180) * 360;
        r.DegToRadFactor = Math.PI / 180;
        r.RadToDegFactor = 180 / Math.PI;
        r.offsetActive = false;
        c(f).resize(function () {
            r.resize()
        });
        r.createLayer = function () {
            return {
                getTitle: function () {
                    return ""
                },
                activate: function () {},
                deactivate: function () {},
                getDrawingLevel: function () {
                    return 20
                },
                redraw: function (x) {},
                setup: function (x) {},
                destroy: function () {}
            }
        };
        var o = function () {
            return c(f).height() - c("#topnav").height()
        };
        r.initMap = function (z) {
            n = true;
            var B, A;
            r.mapID = z;
            r.env.ie = false;
            for (B in r.env.mapStyles) {
                r.env.mapTypeIds.push(B)
            }
            for (A in r.env.mapTypes) {
                r.env.mapTypeIds.push(A)
            }
            var y = {
                zoom: r.env.mapStartZoom,
                center: r.env.mapGStartCenter,
                mapTypeId: r.env.startMapType,
                mapTypeControlOptions: {
                    mapTypeIds: r.env.mapTypeIds
                },
                scaleControl: true,
                scaleControlOptions: {
                    position: google.maps.ControlPosition.BOTTOM_LEFT
                }
            };
            c("#" + r.mapID).height(o());
            r.map = new google.maps.Map(h.getElementById(r.mapID), y);
            for (B in r.env.mapStyles) {
                var x = new google.maps.StyledMapType(r.env.mapStyles[B], {
                    name: B
                });
                r.map.mapTypes.set(B, x)
            }
            for (A in r.env.mapTypes) {
                r.map.mapTypes.set(A, r.env.mapTypes[A])
            }
            if (r.env.startMapStyle) {
                r.map.setMapTypeId(r.env.startMapStyle)
            }
            google.maps.event.addListener(r.map, "maptypeid_changed", function () {
                if (r.map.getMapTypeId() === "OSM") {
                    c("#osm-copyright").show().parent().show()
                } else {
                    c("#osm-copyright").hide()
                } if (l) {
                    r.moveMapPosition();
                    u.trigger("redraw")
                }
            });
            r.addToMap(r.map)
        };
        r.addToMap = function (y) {
            r.map = y;
            r.canvas_id = "mapnificent-canvas";
            while (h.getElementById(r.canvas_id) !== null) {
                r.canvas_id += "0"
            }
            r.mapSize = {
                width: c(r.map.getDiv()).width(),
                height: o()
            };
            r.heightCacheOffset = (r.mapSize.height * (r.env.heightCacheFactor - 1)) / 2;
            r.widthCacheOffset = (r.mapSize.width * (r.env.widthCacheFactor - 1)) / 2;
            var x = function () {
                l = true;
                r.canvas = h.getElementById(r.canvas_id);
                if (typeof G_vmlCanvasManager !== "undefined") {
                    r.env.ie = true;
                    alert("Your browser might or might not work. Rather use a better one.");
                    G_vmlCanvasManager.initElement(r.canvas)
                }
                if (typeof r.canvas.getContext === "undefined") {
                    r.showMessage("Please Use a more modern browser", true);
                    return
                }
                r.setCanvasDimensions();
                r.ctx = r.canvas.getContext("2d");
                r.checkCompositing();
                r.moveMapPosition();
                r.setup();
                u.trigger("initDone")
            };
            r.canvasoverlay = new d(r.env.mapGStartCenter, r.canvas_id, x, r.map);
            google.maps.event.addListener(r.map, "zoom_changed", function (A, z) {
                r.ctx.clearRect(0, 0, r.canvas.width, r.canvas.height);
                f.setTimeout(function () {
                    if (r.map.getZoom() >= i) {
                        r.moveMapPosition();
                        u.trigger("zoom");
                        u.trigger("redraw")
                    }
                }, 500)
            });
            google.maps.event.addListener(r.map, "dragend", function () {
                if (r.map.getZoom() >= i) {
                    if (r.moveMapPosition()) {
                        u.trigger("redraw")
                    }
                }
            })
        };
        r.destroy = function () {
            r.canvasoverlay.setMap(null);
            for (var x in q) {
                q[x].layerObject.destroy()
            }
        };
        r.hide = function () {
            r.canvasoverlay.hide();
            m = true
        };
        r.show = function () {
            r.canvasoverlay.show();
            m = false;
            mapnificent.trigger("redraw")
        };
        r.moveMapPosition = function () {
            r.mapBounds = r.map.getBounds();
            r.mapBoundsXY = r.canvasoverlay.fromLatLngToDivPixel(r.mapBounds.getSouthWest());
            r.canvasoverlayxy = r.canvasoverlay.fromLatLngToDivPixel(r.canvasoverlay.getPoint());
            var y = r.canvasoverlay.fromLatLngToDivPixel(r.mapBounds.getNorthEast());
            var x = false;
            if ((r.mapBoundsXY.x - r.widthCacheOffset * (1 / 3)) < r.canvasoverlayxy.x) {
                x = true
            } else {
                if ((y.x + r.widthCacheOffset * (1 / 3)) > r.canvasoverlayxy.x + r.canvas.width) {
                    x = true
                } else {
                    if ((r.mapBoundsXY.y + r.heightCacheOffset * (1 / 3)) > r.canvasoverlayxy.y) {
                        x = true
                    } else {
                        if ((y.y - r.heightCacheOffset * (1 / 3)) < r.canvasoverlayxy.y - r.canvas.height) {
                            x = true
                        }
                    }
                }
            } if (x) {
                r.setCanvasPosition();
                return true
            }
            return false
        };
        r.setCanvasPosition = function () {
            var x = r.getCanvasPosition();
            r.canvasoverlay.setPoint(x);
            r.canvasoverlayxy = r.canvasoverlay.fromLatLngToDivPixel(x)
        };
        r.getCanvasPosition = function () {
            var x = new google.maps.Point(r.mapBoundsXY.x - r.widthCacheOffset, r.mapBoundsXY.y + r.heightCacheOffset);
            return r.canvasoverlay.fromDivPixelToLatLng(x)
        };
        r.setCanvasDimensions = function () {
            r.mapSize = {
                width: c(r.map.getDiv()).width(),
                height: o()
            };
            r.heightCacheOffset = (r.mapSize.height * (r.env.heightCacheFactor - 1)) / 2;
            r.widthCacheOffset = (r.mapSize.width * (r.env.widthCacheFactor - 1)) / 2;
            r.canvas.width = r.mapSize.width * r.env.widthCacheFactor;
            r.canvas.height = r.mapSize.height * r.env.heightCacheFactor
        };
        r.resize = function () {
            c("#" + r.mapID).height(o());
            if (r.map) {
                google.maps.event.trigger(r.map, "resize");
                r.setCanvasDimensions();
                r.moveMapPosition();
                u.trigger("resize");
                u.trigger("redraw")
            }
        };
        r.setNightTime = function () {
            r.map.setMapTypeId("Night")
        };
        r.setDayTime = function () {
            r.map.setMapTypeId(google.maps.MapTypeId.ROADMAP)
        };
        r.checkCompositing = function () {
            if (typeof r.ctx.getImageData === "undefined") {
                r.env.hasCompositing = false;
                return
            }
            r.env.hasCompositing = true;
            r.ctx.save();
            r.ctx.clearRect(0, 0, r.canvas.width, r.canvas.height);
            r.ctx.fillStyle = "rgba(255,255,255,1)";
            r.ctx.fillRect(0, 0, 3, 3);
            r.ctx.globalCompositeOperation = "destination-in";
            r.ctx.fillRect(2, 2, 3, 3);
            r.ctx.globalCompositeOperation = "source-out";
            r.ctx.fillStyle = "rgba(75,75,75,0.75)";
            r.ctx.fillRect(0, 0, 5, 5);
            var x = r.ctx.getImageData(1, 1, 1, 1).data;
            if (x[3] === 0) {
                r.env.hasCompositing = false
            }
            r.ctx.restore();
            r.ctx.clearRect(0, 0, r.canvas.width, r.canvas.height)
        };
        var u = (function () {
            var x = {};
            return {
                trigger: function (A, z) {
                    if (x[A] !== b) {
                        for (var y = 0; y < x[A].length; y++) {
                            x[A][y](z)
                        }
                    }
                },
                bind: function (z, y) {
                    if (x[z] === b) {
                        x[z] = []
                    }
                    x[z].push(y)
                },
                unbind: function (B, z) {
                    if (x[B] !== b) {
                        var A = [];
                        for (var y = 0; y < x[B].length; y++) {
                            if (x[B][y] != z) {
                                A.push(x[B][y])
                            }
                        }
                        x[B] = A
                    }
                }
            }
        }());
        r.trigger = function (x) {
            u.trigger(x)
        };
        r.bind = function (x, y) {
            u.bind(x, y)
        };
        r.unbind = function (x, y) {
            u.unbind(x, y)
        };
        r.getControls = function (x) {
            return c("#controls")
        };
        r.getDrawingContext = function () {
            return r.ctx
        };
        r.redraw = function () {
            var z, y;
            f.clearTimeout(s);
            r.ctx.globalCompositeOperation = "source-over";
            r.ctx.globalAlpha = 1;
            r.ctx.clearRect(0, 0, r.canvas.width, r.canvas.height);
            if (e > 0) {
                var x = [];
                for (z in q) {
                    x.push(q[z])
                }
                x.sort(function (B, A) {
                    return B.layerObject.getDrawingLevel() - A.layerObject.getDrawingLevel()
                });
                for (y = 0; y < x.length; y++) {
                    x[y].layerObject.redraw(r.ctx)
                }
            } else {
                for (z in q) {
                    q[z].layerObject.redraw(r.ctx)
                }
            }
            r.canvasoverlay.draw();
            s = f.setTimeout(function () {
                r.trigger("idleAfterRedrawing")
            }, 500)
        };
        r.getDistanceInKm = function (A, x) {
            var z = 6371,
                y = Math.PI / 180;
            return Math.acos(Math.sin(A.lat * y) * Math.sin(x.lat * y) + Math.cos(A.lat * y) * Math.cos(x.lat * y) * Math.cos((x.lng - A.lng) * y)) * z
        };
        r.setup = function () {
            r.bind("redraw", r.redraw);
            for (var x in q) {
                r.setupLayer(x)
            }
            r.resize()
        };
        r.addLayer = function (x, y) {
            q[x] = g[x] || {};
            q[x]["ui"] = y
        };
        r.setupLayer = function (z, y) {
            q[z].idname = z;
            q[z].layerObject = q[z].create(r);
            if (q[z].ui) {
                q[z].ui(r, q[z].layerObject, c, f)
            }
            var x = r.getControls(z);
            var A = {};
            if (r.env.layerSettings[z] !== b) {
                A = r.env.layerSettings[z]
            }
            // DEPRECATED SHIT!!!!!!
            // A.isOpera = c.browser.opera;
            q[z].layerObject.setup(x, A)
        };
        r.getCanvasXY = function (C) {
            var A = r.canvasoverlay.fromLatLngToDivPixel(new google.maps.LatLng(C.lat, C.lng));
            var z = A.x - (r.canvasoverlayxy.x);
            var B = A.y - (r.canvasoverlayxy.y - r.canvas.height);
            return {
                x: z,
                y: B
            }
        };
        r.getDivXY = function (x) {
            return r.canvasoverlay.fromLatLngToDivPixel(new google.maps.LatLng(x.lat, x.lng))
        };
        r.getLatLngFromWindowXY = function (z, B) {
            var A = r.canvasoverlay.getProjection().fromContainerPixelToLatLng(new google.maps.Point(z, B), true);
            return {
                lat: A.lat(),
                lng: A.lng()
            }
        };
        r.getLatLngFromCanvasXY = function (z, B) {
            z = z + r.canvasoverlayxy.x;
            B = B + (r.canvasoverlayxy.y - r.canvas.height);
            var A = r.canvasoverlay.getProjection().fromDivPixelToLatLng(new google.maps.Point(z, B), true);
            return {
                lat: A.lat(),
                lng: A.lng()
            }
        };
        r.getLayerData = function (y, x) {
            return j[y][x]
        };
        r.getLayer = function (x) {
            return q[x].layerObject
        };
        return r
    };
    a.addLayer = function (l, m) {
        g[l] = g[l] || {};
        g[l] = {
            create: m
        };
        e += 1
    };
    a.addLayerData = function (l, m) {
        if (!j[l]) {
            j[l] = []
        }
        j[l].push(m)
    };
    a.isBrowserSupported = function () {
        return !!f.Worker && !! f.postMessage
    };
    a.forCoordinates = function (l, m) {
        c.getJSON("http://www.mapnificent.net/api/checkCoordinates/?callback=?", l, function (n) {
            m(n)
        })
    };
    return a
}(window, document, $));
Mapnificent.addLayer("urbanDistance", function (c) {
    var d = false;
    var H = (function () {
        var P = {};
        return {
            trigger: function (S, R) {
                if (P[S] !== undefined) {
                    for (var Q = 0; Q < P[S].length; Q++) {
                        P[S][Q](R)
                    }
                }
            },
            bind: function (R, Q) {
                if (P[R] === undefined) {
                    P[R] = []
                }
                P[R].push(Q)
            },
            unbind: function (T, R) {
                if (P[T] !== undefined) {
                    var S = [];
                    for (var Q = 0; Q < P[T].length; Q++) {
                        if (P[T][Q] != R) {
                            S.push(P[T][Q])
                        }
                    }
                    P[T] = S
                }
            }
        }
    }());
    var F = c.createLayer();
    F.idname = "urbanDistance";
    F.calculationLoopCount = 0;
    var A = {
        secondsPerKmWalking: 13 * 60,
        secondsPerKmBiking: 6 * 60,
        colorMaxAcceptableTime: 120,
        colorBaseGradientColor: 120,
        colorMaxGradientColor: 240,
        maxWalkTime: 15 * 60,
        maxWalkTravelTime: 180,
        dayTimeEnabled: true,
        intervalKey: "m1",
        animateAreaGrowth: false,
        animatedAreaOpacity: false,
        defaultStartAtPosition: {
            lat: c.map.getCenter().lat(),
            lng: c.map.getCenter().lng()
        },
        darkOverlayColor: "rgba(50,50,50,0.4)",
        availableTimes: ["0", "1", "2", "3", "4"],
        drawColor: "rgba(0,0,0,1)",
        estimatedMaxCalculateCalls: 50000,
        cityData: "berlin",
        calculateOnDrag: false,
        dataSize: 9509991,
        dataUrlPrefix: c.env.dataUrlPrefix,
        intersection: false,
        color: false,
        isOpera: false,
        northwest: {
            lat: 52.754364,
            lng: 12.882953
        },
        southeast: {
            lat: 52.29693,
            lng: 13.908883
        },
        workerURL: "http://www.mapnificent.net/media/js/worker.js",
        apiVersion: 1,
        copyright: ""
    };
    if (d) {
        A.workerURL = "/media/js/worker.js"
    }
    var h = {};
    for (var s in A) {
        h[s] = A[s]
    }
    A.secondsPerKm = A.secondsPerKmWalking;
    A.reportInterval = Math.round(A.estimatedMaxCalculateCalls / 20);
    var t = false,
        e = 0,
        j = false,
        a = -1,
        w = [],
        N = undefined,
        I = {}, D = {}, v = {}, o = undefined,
        m = undefined,
        q = 0.5,
        J = null,
        b = false;
    var k = function () {
        return function (P) {
            return new window.Worker(P)
        }
    };
    var E = function () {
        var S = false,
            R = {}, P = false;
        var Q = function (X) {
            var T = {}, V = false,
                U = [];
            T.postToWorkerFunction = function (Y) {
                S({
                    data: Y
                })
            };
            T.postMessage = function (Y) {
                if (!V) {
                    U.push(Y);
                    return
                }
                T.postToWorkerFunction(Y)
            };
            R = T;
            var W = document.createElement("SCRIPT");
            W.src = X;
            W.type = "text/javascript";
            W.onload = function () {
                V = true;
                while (U.length > 0) {
                    T.postToWorkerFunction(U[0]);
                    U.shift()
                }
            };
            document.body.appendChild(W);
            return T
        };
        Q.fake = true;
        Q.add = function (U, T) {
            S = T;
            return function (V) {
                R.onmessage({
                    data: V
                })
            }
        };
        Q.toString = function () {
            return "FakeWorker('" + path + "')"
        };
        return Q
    };
    var u = function () {
        var R = false,
            P = {}, S = 0,
            V = "mapnificentCrossDomain",
            Q = "http://www.mapnificent.net";
        var T = window.frames[V];
        if (T === undefined) {
            T = document.createElement("iframe");
            T.onload = function () {
                R = true;
                for (var W in P) {
                    P[W].processQueue()
                }
            };
            T.id = V;
            T.name = V;
            T.src = "http://www.mapnificent.net/media/api/" + A.apiVersion + "/mapnificent.html";
            T.style.position = "absolute";
            T.style.left = "-100000px";
            T.style.visibility = "hidden";
            T.width = "1";
            T.height = "1";
            document.body.appendChild(T);
            T = window.frames[V]
        }
        var U = function (W) {
            if (W.origin !== Q) {
                return
            }
            var X = JSON.parse(W.data);
            P[X.index][X.command]({
                data: X.payload
            })
        };
        window.addEventListener("message", U, false);
        return function (Y) {
            var W = [],
                X = {
                    index: S,
                    processQueue: function () {
                        var Z;
                        Z = W.pop();
                        while (Z !== undefined) {
                            this.postMessage(Z);
                            Z = W.pop()
                        }
                    },
                    postMessage: function (Z) {
                        if (!R) {
                            W.push(Z);
                            return
                        }
                        T.postMessage(JSON.stringify({
                            index: this.index,
                            command: "postMessage",
                            payload: Z
                        }), Q)
                    },
                    terminate: function () {
                        T.postMessage(JSON.stringify({
                            index: this.index,
                            command: "terminate"
                        }), Q)
                    },
                    ping: function () {
                        T.postMessage(JSON.stringify({
                            index: this.index,
                            command: "ping"
                        }), Q)
                    }
                };
            P[S++] = X;
            return X
        }
    };
    Workerfacade = undefined;
    if ( !! window.Worker) {
        if (document.location.hostname.indexOf("www.mapnificent.net") != -1 || d) {
            WorkerFacade = k()
        } else {
            WorkerFacade = u()
        }
    } else {
        WorkerFacade = E()
    }
    var y = {
        log: function () {
            if ( !! console) {
                console.log(Array.prototype.slice.call(arguments))
            }
        },
        error: function () {
            if ( !! console) {
                console.error(Array.prototype.slice.call(arguments))
            }
        }
    };
    var G = {
        merge: function (S, Q) {
            var R = S.length,
                P = 0;
            while (Q[P] !== undefined) {
                S[R++] = Q[P++]
            }
            S.length = R;
            return S
        },
        extend: function (R, Q) {
            for (var P in Q) {
                R[P] = Q[P]
            }
            return R
        }
    };
    var l = (function () {
        var U = 0,
            R = {}, S = -1,
            T = 0,
            P = false,
            Q = 0;
        return {
            add: function (X, V) {
                S += 1;
                T += 1;
                var W = {
                    time: V === undefined ? A.maxWalkTime : V,
                    latlng: X,
                    running: false,
                    ready: false,
                    animatedOpacity: 0,
                    animatedSeconds: 0,
                    stationMap: {},
                    calculationProgress: 0,
                    doneCallback: false,
                    updateCallback: false,
                    currentTime: undefined,
                    index: S,
                    setTime: function (Y) {
                        b = false;
                        this.time = Y;
                        this.animatedSeconds = Y
                    },
                    getTime: function () {
                        return this.time
                    },
                    startCalculation: function (aa, Z) {
                        if (this.running) {
                            if (A.calculateOnDrag) {
                                return
                            }
                            var Y = this;
                            this.killWorker()
                        }
                        this.ready = false;
                        if (j) {
                            this.running = true;
                            H.trigger("calculationStarted", this);
                            this.calculate(aa, Z)
                        }
                    },
                    calculate: function (ai, af) {
                        Q += 1;
                        b = false;
                        this.stationMap = {};
                        this.doneCallback = ai;
                        this.updateCallback = af;
                        this.currentTime = new Date().getTime();
                        var ae = 3,
                            ah = [],
                            aa = [],
                            Z = 0,
                            Y, ac = [],
                            ad = [],
                            ag;
                        try {
                            while (Z <= 1 || ac.length == 0) {
                                ag = g(this["latlng"], Z);
                                for (Y = 0; Y < ag.length; Y += 1) {
                                    if (N[ag[Y][0]][ag[Y][1]].length > 0) {
                                        ac = G.merge(ac, N[ag[Y][0]][ag[Y][1]])
                                    }
                                }
                                Z += 1;
                                if (ac.length > 10) {
                                    Z += 1
                                }
                            }
                        } catch (ab) {}
                        for (Z = 0; Z < ac.length; Z++) {
                            ad.push(c.getDistanceInKm(this["latlng"], {
                                lat: I[ac[Z]]["a"],
                                lng: I[ac[Z]]["n"]
                            }))
                        }
                        this.webworker.postMessage({
                            fromStations: ac,
                            blockGrid: N,
                            position: this["latlng"],
                            stations: I,
                            lines: D,
                            distances: ad,
                            reportInterval: A.reportInterval,
                            intervalKey: A.intervalKey,
                            maxWalkTime: A.maxWalkTime,
                            secondsPerKm: A.secondsPerKm
                        })
                    },
                    afterCalculate: function () {
                        P = false;
                        Q -= 1;
                        U += 1;
                        if (A.animatedAreaOpacity) {
                            this.animatedOpacity = 0
                        } else {
                            this.animatedOpacity = 1
                        } if (A.animateAreaGrowth) {
                            this.animatedSeconds = 0
                        } else {
                            this.animatedSeconds = this.time
                        }
                        this.running = false;
                        this.ready = true;
                        if (this.doneCallback) {
                            this.doneCallback.call(this)
                        }
                        H.trigger("calculationDone", this)
                    },
                    createWorker: function () {
                        this.webworker = WorkerFacade(A.workerURL);
                        this.webworker.onmessage = W.workerMessage;
                        this.webworker.onerror = W.workerError
                    },
                    killWorker: function () {
                        this.webworker.terminate();
                        Q -= 1;
                        this.createWorker();
                        this.running = false
                    },
                    remove: function () {
                        if (this.running) {
                            this.killWorker()
                        }
                        this.webworker = null
                    },
                    move: function (Z, Y) {
                        this["latlng"] = {
                            lat: Z.lat,
                            lng: Z.lng
                        };
                        if (!F.inRange(Z)) {
                            this.stationMap = {};
                            return false
                        }
                        if (Y) {
                            H.trigger("positionMoved", this)
                        }
                        return true
                    },
                    draw: function (ah, ae, ab, aa, af, Y) {
                        if (ab) {
                            if (this.stationMap[ab] == undefined) {
                                return
                            }
                            if (this.stationMap[ab] >= this.animatedSeconds) {
                                return
                            }
                        }
                        ae = ae || {
                            lat: this["latlng"].lat,
                            lng: this["latlng"].lng
                        };
                        if (!af && !A.intersection) {
                            ah.beginPath()
                        }
                        var Z = !! ab ? this.stationMap[ab] : 0;
                        var ac = Math.min((this.animatedSeconds - Z), A.maxWalkTime);
                        var ad = Math.max(ac * aa, 1);
                        var ag = c.getCanvasXY(ae);
                        if (Y) {
                            Y(ah, ae, Z, ac, ag, ad)
                        }
                        ah.moveTo(ag.x, ag.y);
                        ah.arc(ag.x, ag.y, ad, 0, c.env.circleRadians, true);
                        if (!af && !A.intersection) {
                            ah.fill()
                        }
                    },
                    getGeoJson: function () {
                        var Y = {
                            type: "FeatureCollection",
                            features: null
                        };
                        var aa = [];
                        var ad = Math.min(this.animatedSeconds, A.maxWalkTime);
                        var ae = ad * (1 / A.secondsPerKm) * 1000;
                        aa.push({
                            type: "Feature",
                            properties: {
                                radius: ae
                            },
                            geometry: {
                                type: "Point",
                                coordinates: [this["latlng"].lng, this["latlng"].lat],
                            },
                        });
                        for (var ac = 0; ac < w.length; ac++) {
                            var ab = w[ac];
                            var ag = I[ab];
                            if (ag.a === undefined) {
                                continue
                            }
                            if (ab) {
                                if (this.stationMap[ab] == undefined) {
                                    continue
                                }
                                if (this.stationMap[ab] >= this.animatedSeconds) {
                                    continue
                                }
                            }
                            W = W || {
                                lat: this["latlng"].lat,
                                lng: this["latlng"].lng
                            };
                            var Z = !! ab ? this.stationMap[ab] : 0;
                            ad = Math.min((this.animatedSeconds - Z), A.maxWalkTime);
                            ae = ad * (1 / A.secondsPerKm) * 1000;
                            aa.push({
                                type: "Feature",
                                properties: {
                                    radius: ae
                                },
                                geometry: {
                                    type: "Point",
                                    coordinates: [ag.n, ag.a],
                                },
                            })
                        }
                        Y.features = aa;
                        var af = window.open("", "wnd");
                        af.document.body.innerHTML = JSON.stringify(Y)
                    }
                };
                W.workerMessage = function (Y) {
                    if (Y.data.status == "done") {
                        W.stationMap = Y.data.stationMap;
                        W.afterCalculate()
                    } else {
                        if (Y.data.status == "working") {
                            W.calculationProgress = Y.data.at;
                            if (W.updateCallback) {
                                W.updateCallback.call(W, Y.data.at)
                            }
                            H.trigger("calculationUpdated", W)
                        }
                    }
                };
                W.workerError = function (Y) {
                    y.error(W, "Worker: " + Y.message, Y);
                    throw Y
                };
                W.createWorker();
                R[S] = W;
                return W
            },
            remove: function (V) {
                if (!R[V]) {
                    return false
                }
                T -= 1;
                P = false;
                R[V]["remove"]();
                delete R[V];
                H.trigger("positionRemoved", V);
                return true
            },
            calculateAll: function () {
                for (var V in R) {
                    R[V]["startCalculation"]()
                }
            },
            killAll: function () {
                for (var V in R) {
                    R[V]["killWorker"]()
                }
            },
            calculateNeeded: function () {
                for (var V in R) {
                    if (!R[V].ready && !R[V].running) {
                        R[V]["startCalculation"]()
                    }
                }
            },
            draw: function (ad, ac) {
                var X = 0;
                var aa = (1 / A.secondsPerKm) * A.pixelPerKm;
                for (var Y in R) {
                    var Z = R[Y];
                    if (!Z.ready) {
                        continue
                    }
                    ad.fillStyle = A.drawColor;
                    if (X == 1 && A.intersection) {
                        ad.globalCompositeOperation = "destination-in"
                    }
                    ad.beginPath();
                    Z.draw(ad, null, null, aa, true);
                    if (!ac && !A.intersection) {
                        ad.fill()
                    }
                    for (var W = 0; W < w.length; W++) {
                        var V = w[W];
                        var ab = I[V];
                        if (ab.a === undefined) {
                            continue
                        }
                        Z.draw(ad, {
                            lat: ab.a,
                            lng: ab.n
                        }, V, aa, ac)
                    }
                    if (ac || A.intersection) {
                        ad.fill()
                    }
                    X += 1
                }
            },
            getFastestStationsWithIndex: function () {
                var V = [];
                for (var Y = 0; Y < w.length; Y++) {
                    var X = false,
                        Z = Infinity;
                    for (var W in R) {
                        if (typeof (R[W].stationMap[w[Y]]) !== "undefined" && R[W].stationMap[w[Y]] < Z) {
                            Z = R[W].stationMap[w[Y]];
                            X = W
                        }
                    }
                    if (X !== false) {
                        V.push([X, Z, w[Y]])
                    }
                }
                return V
            },
            drawColor: function (V) {
                if (P == false) {
                    P = this.getFastestStationsWithIndex();
                    P.sort(function (ad, ac) {
                        return ((ad[1] < ac[1]) ? -1 : ((ad[1] > ac[1]) ? 1 : 0))
                    })
                }
                var aa = (1 / A.secondsPerKm) * A.pixelPerKm;
                var W = function (ad, ai, ag, ae, af, ac) {
                    var ah = ad.createRadialGradient(af.x, af.y, 0, af.x, af.y, ac);
                    ah.addColorStop(0, B(ag));
                    ah.addColorStop(0.5, B(Math.floor(ag + (ae / 2))));
                    ah.addColorStop(1, B(ag + ae));
                    ad.fillStyle = ah
                };
                for (var Y = (P.length - 1); Y >= 0; Y--) {
                    var ab = P[Y][2];
                    var X = P[Y][0];
                    var Z = I[ab];
                    if (Z.a == undefined) {
                        continue
                    }
                    if (R[X].stationMap[ab] > P[Y][1]) {
                        continue
                    }
                    V.beginPath();
                    R[X].draw(V, {
                        lat: Z.a,
                        lng: Z.n
                    }, ab, aa, false, W);
                    V.fill()
                }
            },
            getCalculationsInProgress: function () {
                return Q
            },
            getStationMapData: function () {
                var W = [];
                for (var V in R) {
                    W.push(R[V].stationMap)
                }
                return W
            }
        }
    }());
    F.getStationMapData = l.getStationMapData;
    F.search = (function (Q) {
        var P = function () {
            var T = {}, V = {}, S = {}, U = {}, R = 0;
            return {
                insertObjects: function (X) {
                    for (var W = 0; W < X.length; W++) {
                        this.find(X[W])
                    }
                },
                find: function (W) {
                    if (U[W] === undefined) {
                        T[R] = 1;
                        U[W] = R;
                        S[R] = W;
                        V[R] = R;
                        R += 1;
                        return W
                    }
                    var Z = [U[W]];
                    var Y = V[Z[Z.length - 1]];
                    while (Y != Z[Z.length - 1]) {
                        Z.push(Y);
                        Y = V[Y]
                    }
                    for (var X = 0; X < Z.length; X++) {
                        V[Z[X]] = Y
                    }
                    return S[Y]
                },
                union: function (ad, ac) {
                    var W = this.find(ad);
                    var ae = this.find(ac);
                    if (W != ae) {
                        var ab = U[W];
                        var aa = U[ae];
                        var Z = T[ab];
                        var Y = T[aa];
                        if (Z < Y) {
                            var X;
                            X = ae;
                            ae = W;
                            W = X;
                            X = aa;
                            aa = ab;
                            ab = X;
                            X = Y;
                            Y = Z;
                            Z = X
                        }
                        T[ab] = Z + Y;
                        delete T[aa];
                        V[aa] = ab
                    }
                },
                getRegions: function () {
                    var Y = {}, X;
                    for (X = 0; X < R; X++) {
                        Y[X] = []
                    }
                    for (X in U) {
                        Y[U[this.find(X)]].push(X)
                    }
                    var W = [];
                    for (X in Y) {
                        if (Y[X].length > 0) {
                            W.push(Y[X])
                        }
                    }
                    return W
                }
            }
        };
        return {
            detectBlobs: function () {
                var ad = Q.getImageData();
                var ao = {};
                var S = ad.data;
                var ac = ad.width;
                var al = ad.height;
                var W = 0;
                var ae = P();
                var am;
                if (Q.getOption("color")) {
                    am = function (aq) {
                        return aq !== 0
                    }
                } else {
                    am = function (aq) {
                        return aq === 0
                    }
                }
                for (var ah = 0; ah < al; ah++) {
                    for (var aj = 0; aj < ac; aj++) {
                        var af = aj * 4 + ah * ac * 4 + 3;
                        if (am(S[af])) {
                            if (am(S[af - 4]) && am(S[af - (ac * 4)])) {
                                if (ae.find(af - 4) === ae.find(af - (ac * 4))) {
                                    ae.find(af);
                                    ae.union(af, af - 4)
                                } else {
                                    ae.union(af - 4, af - (ac * 4));
                                    ae.find(af);
                                    ae.union(af, af - 4)
                                }
                            } else {
                                if (am(S[af - 4])) {
                                    ae.find(af);
                                    ae.union(af, af - 4)
                                } else {
                                    if (am(S[af - (ac * 4)])) {
                                        ae.find(af);
                                        ae.union(af, af - (ac * 4))
                                    } else {
                                        ae.find(af)
                                    }
                                }
                            }
                        }
                    }
                }
                var R = ae.getRegions();
                var ap = [];
                for (aj = 0; aj < R.length; aj++) {
                    var V = -Infinity,
                        T = -Infinity,
                        X = Infinity,
                        U = Infinity;
                    var Z = 0,
                        Y = 0;
                    var ai = [];
                    for (ah = 0; ah < R[aj].length; ah++) {
                        var ag = parseInt(R[aj][ah], 10);
                        var aa = Math.floor(((ag - 3) / 4) / ac);
                        var ab = ((ag - 3) / 4) % ac;
                        V = Math.max(ab, V);
                        T = Math.max(aa, T);
                        X = Math.min(ab, X);
                        U = Math.min(aa, U);
                        Z += ab;
                        Y += aa;
                        ai.push([ab, aa])
                    }
                    var an = Z / R[aj].length;
                    var ak = Y / R[aj].length;
                    ap.push({
                        points: ai,
                        maxx: V,
                        minx: X,
                        maxy: T,
                        miny: U,
                        midx: an,
                        midy: ak,
                        sum: R[aj].length,
                        sqkm: Q.numberOfPixelsToSqkm(ai.length),
                        midgeo: c.getCanvasXY(an, ak)
                    })
                }
                return ap
            }
        }
    }(F));
    F.addPosition = function (Q, P) {
        if (!F.inRange({
            lat: Q.lat,
            lng: Q.lng
        })) {
            return false
        }
        return l.add(Q, P)
    };
    F.inRange = function (P) {
        if (P.lat > A.northwest["lat"] || P.lat < A.southeast["lat"] || P.lng < A.northwest["lng"] || P.lng > A.southeast["lng"]) {
            return false
        }
        return true
    };
    F.getCalculationsInProgress = function () {
        return l.getCalculationsInProgress()
    };
    var i = function (S, Q) {
        var R = Math.floor((A.widthInKm / A.latLngDiffs["lng"] * (Q - A.northwest["lng"])) / q);
        var P = Math.floor((A.heightInKm / A.latLngDiffs["lat"] * (A.northwest["lat"] - S)) / q);
        return [R, P]
    };
    var K = function (S, Q) {
        var R = Math.floor(c.getDistanceInKm(pos, {
            lat: S,
            lng: A.northwest["lng"]
        }) / q);
        var P = Math.floor(c.getDistanceInKm(pos, {
            lat: A.northwest["lat"],
            lng: Q
        }) / q);
        return [R, P]
    };
    var g = function (W, V, Y) {
        var aa = i(W.lat, W.lng);
        if (V === 0) {
            return [aa]
        }
        var S = [],
            Z = [],
            P, X, U, T;
        if ( !! Y) {
            P = 0
        } else {
            P = V
        }
        var R = P;
        for (var Q = -R; Q < (R + 1); Q++) {
            U = aa[0] - R;
            T = aa[1] + Q;
            if (U >= 0 && T < m && T > 0) {
                S.push([U, T])
            }
            U = aa[0] + R;
            T = aa[1] + Q;
            if (U < o && T < m && T > 0) {
                S.push([U, T])
            }
            if (Q > -R && Q < R) {
                U = aa[0] + Q;
                T = aa[1] - R;
                if (U < o && U > 0 && T >= 0) {
                    S.push([U, T])
                }
                U = aa[0] + Q;
                T = aa[1] - R;
                if (U < o && U > 0 && T >= 0) {
                    S.push([U, T])
                }
            }
        }
        return S
    };
    F.setOption = function (P, Q) {
        A[P] = Q
    };
    F.setOptions = function (P) {
        G.extend(A, P)
    };
    F.getOption = function (P) {
        return A[P]
    };
    F.getDefaultOption = function (P) {
        return h[P]
    };
    F.hasOptionChanged = function (P) {
        return A[P] === h[P]
    };
    F.getTitle = function () {
        return "Urban Distance"
    };
    F.bind = function (P, Q) {
        H.bind(P, Q)
    };
    F.unbind = function (P, Q) {
        H.unbind(P, Q)
    };
    F.getCoveredArea = function () {
        if (b === false) {
            var V = F.getImageData();
            var T = V.data;
            var P = V.width;
            var U = V.height;
            var S = 0;
            for (var Q = 0; Q < U; Q++) {
                for (var R = 0; R < P; R++) {
                    if (T[R * 4 + Q * P * 4 + 3] === 0) {
                        S += 1
                    }
                }
            }
            b = S
        }
        return b
    };
    F.getImageData = function () {
        if (!J) {
            J = c.ctx.getImageData(0, 0, c.canvas.width, c.canvas.height)
        }
        return J
    };
    F.isHighlighted = function (P, S) {
        var R = F.getImageData();
        P = Math.floor(P);
        S = Math.floor(S);
        var Q = R.data[((S * (R.width * 4)) + (P * 4)) + 3];
        if (F.getOption("color")) {
            return Q !== 0
        } else {
            return Q === 0
        }
    };
    F.getDrawingLevel = function () {
        return 0
    };
    F.setup = function (P, R) {
        for (var Q in R) {
            A[Q] = R[Q]
        }
        A.reportInterval = Math.round(A.estimatedMaxCalculateCalls / 20);
        A.southwest = {
            lat: A.southeast["lat"],
            lng: A.northwest["lng"]
        };
        A.northeast = {
            lat: A.northwest["lat"],
            lng: A.southeast["lng"]
        };
        A.latLngDiffs = {
            lat: Math.abs(A.northwest["lat"] - A.southeast["lat"]),
            lng: Math.abs(A.northwest["lng"] - A.southeast["lng"])
        };
        A.widthInKm = c.getDistanceInKm(A.northwest, A.northeast);
        A.heightInKm = c.getDistanceInKm(A.northwest, A.southwest);
        o = Math.ceil(A.widthInKm / q);
        m = Math.ceil(A.heightInKm / q);
        F.calculatePixelPerKm();
        c.bind("zoom", F.calculatePixelPerKm);
        H.trigger("setup", F);
        p()
    };
    F.calculatePixelPerKm = function () {
        A.southeastxy = c.getDivXY(A.southeast);
        A.northwestxy = c.getDivXY(A.northwest);
        A.southwestxy = c.getDivXY(A.southwest);
        A.northeastxy = c.getDivXY(A.northeast);
        A.map_width = Math.abs(A.southwestxy["x"] - A.northeastxy["x"]);
        A.map_height = Math.abs(A.southwestxy["y"] - A.northeastxy["y"]);
        A.pixelPerKm = A.map_width / A.widthInKm
    };
    F.numberOfPixelsToSqkm = function (P) {
        return Math.round(P * ((1 / A.pixelPerKm) * (1 / A.pixelPerKm)) * 100) / 100
    };
    F.removePosition = function (P) {
        l.remove(P)
    };
    var M = function () {
        var P;
        if ( !! localStorage) {
            try {
                P = localStorage.getItem(A.cityData)
            } catch (Q) {
                return false
            }
            if (P != null) {
                try {
                    P = JSON.parse(P);
                    I = P[0];
                    D = P[1]
                } catch (Q) {
                    return false
                }
                x(true);
                return true
            }
        }
        return false
    };
    var p = function () {
        if (!M()) {
            z(1)
        }
    };
    var z = function (P) {
        L(A.dataUrlPrefix + A.cityData + "-" + P + ".json", function () {
            O(P)
        })
    };
    var O = function (P) {
        var R = c.getLayerData(F.idname, P - 1);
        if ( !! R[2]) {
            I = G.extend(I, R[2])
        }
        if ( !! R[3]) {
            D = G.extend(D, R[3])
        }
        var Q = Math.round(R[0] / R[1] * 100);
        if (R[0] < R[1]) {
            H.trigger("loadProgress", Q);
            z(R[0] + 1)
        } else {
            H.trigger("loadProgress", Q);
            window.setTimeout(function () {
                x()
            }, 100)
        }
    };
    var L = function (R, S, Q) {
        var P = document.createElement("SCRIPT");
        P.type = "text/javascript";
        P.async = "true";
        P.src = R;
        if (Q) {
            P.onerror = Q
        }
        P.onload = S;
        document.getElementsByTagName("head")[0].appendChild(P)
    };
    var x = function (R) {
        if (R === undefined && !! localStorage) {
            try {
                localStorage.clear();
                localStorage.setItem(A.cityData, JSON.stringify([I, D]))
            } catch (U) {}
        }
        N = [];
        for (var Q = 0; Q <= o; Q += 1) {
            N.push([]);
            for (var P = 0; P <= m; P += 1) {
                N[Q].push([])
            }
        }
        w = [];
        for (var T in I) {
            w.push(T);
            var S = i(I[T]["a"], I[T]["n"]);
            N[S[0]][S[1]].push(T)
        }
        j = true;
        l.calculateNeeded();
        H.trigger("dataLoaded", F)
    };
    var B = function (P) {
        min = Math.floor(P / 60);
        if (min == 0) {
            min = 1
        }
        if (v[min] === undefined) {
            v[min] = "hsla(" + (A.colorBaseGradientColor - Math.floor(min / A.colorMaxAcceptableTime * (A.colorBaseGradientColor + A.colorMaxGradientColor))) + ", 100%, 50%, 0.75)"
        }
        return v[min]
    };
    var C = function (P) {
        if (A.intersection) {
            P.globalCompositeOperation = "source-out"
        } else {
            P.globalCompositeOperation = "source-over"
        } if (c.map.getMapTypeId() === "Night") {
            A.darkOverlayColor = "rgba(0,0,0,0.8)"
        } else {
            if (A.dayTimeEnabled) {
                if (A.intervalKey[1] === "0" || A.intervalKey[1] === "4") {
                    A.darkOverlayColor = "rgba(0,0,0,0.8)"
                } else {
                    A.darkOverlayColor = h.darkOverlayColor
                }
            }
        }
        P.fillStyle = A.darkOverlayColor;
        P.fillRect(0, 0, c.canvas.width, c.canvas.height)
    };
    var r = function (S, R) {
        S.save();
        S.globalAlpha = 0.7;
        if (!R) {
            S.strokeStyle = "#333"
        } else {
            S.strokeStyle = "#fff"
        }
        S.lineWidth = 1;
        S.beginPath();
        var T = c.getCanvasXY(A.northwest),
            P = c.getCanvasXY(A.northeast),
            U = c.getCanvasXY(A.southeast),
            Q = c.getCanvasXY(A.southwest);
        S.moveTo(T.x, T.y);
        S.lineTo(P.x, P.y);
        S.lineTo(U.x, U.y);
        S.lineTo(Q.x, Q.y);
        S.lineTo(T.x, T.y);
        S.stroke();
        S.restore()
    };
    var f = function (P) {
        if (!A.intersection) {
            C(P);
            r(P);
            P.globalCompositeOperation = "destination-out"
        } else {
            P.globalCompositeOperation = "source-over"
        }
        var Q = A.isOpera ? true : false;
        l.draw(P, Q);
        if (A.intersection) {
            C(P)
        }
    };
    F.calculateAll = function () {
        l.calculateAll()
    };
    var n = function (P) {
        r(P, true);
        l.drawColor(P);
        P.save();
        P.globalAlpha = 0.5;
        P.globalCompositeOperation = "destination-out";
        P.fillStyle = "rgba(255,255,255,1)";
        P.fillRect(0, 0, c.canvas.width, c.canvas.height);
        P.restore()
    };
    F.redraw = function (P) {
        J = null;
        P.save();
        if (A.color) {
            n(P)
        } else {
            f(P)
        }
        P.restore()
    };
    F.destroy = function () {
        l.killAll()
    };
    return F
});