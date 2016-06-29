(function ($window) {
    var Para = {
    };

    var Data = {
        width:30,
        height: 30,
        size:16,
        item: [
            [2, 5, 6, 1],
            [4, 8, 1, 8],
            [6, 11, 2, 2],
            [8, 15, 2, 2],
            [10, 10, 2, 2],
            [12, 8, 1, 1],
            [20, 5, 1, 8],
            [6, 15, 12, 1]
        ]
    };

    var Main = function () {
        // callback
        this.onAnimate = null;

        // ----------------------------------------------------------------
        var renderer = PIXI.autoDetectRenderer(800, 600, { backgroundColor: 0x1099bb });
        document.body.appendChild(renderer.view);

        // create the root of the scene graph
        var that = this;
        var map = null;
        var graphicMap = null;
        var stage = new PIXI.Container();
        var layer_grid = new PIXI.Container();
        var mousePos = [0, 0];
        var lightPos = [0, 0];
        var rotation = 0;
        var light = null;
        var shadowEdge = [];
        var fov = Math.PI / 2;
        
        var setup = function () {
            setupGrid();
            drawLayer();
            setupFunction();
            animate();
        };

        var setupGrid = function () {
            map = [];
            graphicMap = [];
            for (var i = 0; i < Data.height; i++) {
                map[i] = [];
                graphicMap[i] = [];
                for (var j = 0; j < Data.width; j++) {
                    map[i][j] = -1;
                    graphicMap[i][j] = null;
                }
            }

            for (var k = 0; k < Data.item.length; k++) {
                var item = Data.item[k];
                for (var i = item[1]; i < item[1] + item[3]; i++) {
                    for (var j = item[0]; j < item[0] + item[2]; j++) {
                        map[i][j] = k;
                    }
                }
            }
        };

        var setupFunction = function () {
            var _getMousePos = null;
            var _setupMousePosFunc = function (e) {
                if (e.pageX == undefined) {
                    return function (e) { return [e.originalEvent.touches[0].pageX, e.originalEvent.touches[0].pageY]; };
                } else {
                    return function (e) { return [e.pageX, e.pageY]; };
                }
            };
            document.body.addEventListener('mousemove', function (e) {
                if (_getMousePos === null) _getMousePos = _setupMousePosFunc(e);
                mousePos = _getMousePos(e);
                rotation = Math.atan2(-mousePos[1] + lightPos[1], mousePos[0] - lightPos[0]);
            });


            var keyCode = {
                'w': 87,
                's': 83,
                'a': 65,
                'd': 68
            };

            document.body.addEventListener('keydown', function (e) {
                if (e.keyCode == keyCode['w']) {
                    lightPos[1] -= 4;
                }
                if (e.keyCode == keyCode['s']) {
                    lightPos[1] += 4;
                }
                if (e.keyCode == keyCode['a']) {
                    lightPos[0] -= 4;
                }
                if (e.keyCode == keyCode['d']) {
                    lightPos[0] += 4;
                }
            });
        };

        var drawLayer = function () {
            for (var i = 0; i < Data.height; i++) {
                for (var j = 0; j < Data.width; j++) {
                    if (map[i][j] === -1) {
                        var graphics = new PIXI.Graphics();
                        graphics.lineStyle(2, 0xeeeeee, 1);
                        graphics.beginFill(0xdddddd, 1);
                        graphics.drawRect(j * Data.size, i * Data.size, Data.size, Data.size);
                        layer_grid.addChild(graphics);
                        graphicMap[i][j] = graphics;
                    } else {
                    }
                }
            }
            for (var i = 0; i < Data.height; i++) {
                for (var j = 0; j < Data.width; j++) {
                    if (map[i][j] === -1) {
                    } else {
                        var graphics = new PIXI.Graphics();
                        graphics.lineStyle(2, 0x333333, 1);
                        graphics.beginFill(0x444444, 1);
                        graphics.drawRect(j * Data.size, i * Data.size, Data.size, Data.size);
                        layer_grid.addChild(graphics);
                        graphicMap[i][j] = graphics;
                    }
                }
            }
            stage.addChild(layer_grid);

            light = new PIXI.Graphics();
            stage.addChild(light);

            shadowEdge[0] = new PIXI.Graphics();
            stage.addChild(shadowEdge[0]);
            shadowEdge[1] = new PIXI.Graphics();
            stage.addChild(shadowEdge[1]);
        };

        var drawLight = function (x, y, rotation, fov) {
            light.clear();
            light.lineStyle(2, 0xffffff, 1);
            light.beginFill(0xcc6666, 1);
            light.drawCircle(x, y, 10);

            var graphics = shadowEdge[0];
            graphics.clear();
            graphics.beginFill();
            graphics.lineStyle(2, 0xFF0000);
            graphics.moveTo(x, y);
            graphics.lineTo(x + Math.cos(rotation - fov / 2) * 100, y - Math.sin(rotation - fov / 2) * 100);

            camera = 1;
            graphics = shadowEdge[1];
            graphics.clear();
            graphics.beginFill();
            graphics.lineStyle(2, 0xFF0000);
            graphics.moveTo(x, y);
            graphics.lineTo(x + Math.cos(rotation + fov / 2) * 100, y - Math.sin(rotation + fov / 2) * 100);

        };

        var drawShadow = function (x, y, block) {
            for (var k = 0; k < Data.item.length; k++) {
                var item = Data.item[k];
                if (block.hasOwnProperty(k)) {
                    for (var i = item[1]; i < item[1] + item[3]; i++) {
                        for (var j = item[0]; j < item[0] + item[2]; j++) {
                            var graphics = graphicMap[i][j];
                            graphics.clear();
                            graphics.lineStyle(2, 0x006666, 1);
                            graphics.beginFill(0x008888, 1);
                            graphics.drawRect(j * Data.size, i * Data.size, Data.size, Data.size);
                        }
                    }
                }
                else {
                    for (var i = item[1]; i < item[1] + item[3]; i++) {
                        for (var j = item[0]; j < item[0] + item[2]; j++) {
                            var graphics = graphicMap[i][j];
                            graphics.clear();
                            graphics.lineStyle(2, 0x333333, 1);
                            graphics.beginFill(0x444444, 1);
                            graphics.drawRect(j * Data.size, i * Data.size, Data.size, Data.size);
                        }
                    }
                }
            }
        };

        function animate() {
            requestAnimationFrame(animate);
            drawLight(lightPos[0], lightPos[1], rotation, fov);
            RayCasting(lightPos[0] / Data.size, lightPos[1] / Data.size, rotation, fov, map, 30, drawShadow);
            renderer.render(stage);
            if (that.onAnimate) that.onAnimate();
        }

        setup();
    };

    $window.Test = Main;
})(window);