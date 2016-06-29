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
        var map = null;
        var graphicMap = null;
        var stage = new PIXI.Container();
        var layer_grid = new PIXI.Container();
        var currentPos = [0, 0];
        var lightPos = [0, 0];
        var light = null;
        var shadowEdge = [];
        
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
                currentPos = _getMousePos(e);
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

        var drawLight = function (x, y) {
            light.clear();
            light.lineStyle(2, 0xffffff, 1);
            light.beginFill(0xcc6666, 1);
            light.drawCircle(x, y, 10);
        };

        var drawShadow = function (x, y, block) {
            for (var k = 0; k < Data.item.length; k++) {
                var item = Data.item[k];
                if (block.hasOwnProperty(k)) {
                    for (var i = item[1]; i < item[1] + item[3]; i++) {
                        for (var j = item[0]; j < item[0] + item[2]; j++) {
                            var graphics = graphicMap[i][j];
                            graphics.clear();
                            graphics.lineStyle(2, 0x003333, 1);
                            graphics.beginFill(0x004444, 1);
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

        var rayCasting = function (x, y, rotation) {
            var cos_rotspeedp = Math.cos(rotation);
            var cos_rotspeedn = Math.cos(-rotation);
            var sin_rotspeedp = Math.sin(rotation);
            var sin_rotspeedn = Math.sin(-rotation);

            var dx = 1.0,
                dy = 0.0,
                cameraX = 0,
                cameraY = 0.66,
                dx2 = dx,
                cameraX2 = cameraX;

            dx = dx2 * cos_rotspeedn - dy * sin_rotspeedn;
            dy = dx2 * sin_rotspeedn + dy * cos_rotspeedn;

            cameraX = cameraX2 * cos_rotspeedn - cameraY * sin_rotspeedn;
            cameraY = cameraX2 * sin_rotspeedn + cameraY * cos_rotspeedn;


            var graphics = shadowEdge[0];
            var camera = - 1;
            graphics.clear();
            graphics.beginFill();
            graphics.lineStyle(2, 0xFF0000);
            graphics.moveTo(x, y);
            graphics.lineTo(x + (dx + cameraX * camera)*100, y + (dy + cameraY * camera)*100);

            camera = 1;
            graphics = shadowEdge[1];
            graphics.clear();
            graphics.beginFill();
            graphics.lineStyle(2, 0xFF0000);
            graphics.moveTo(x, y);
            graphics.lineTo(x + (dx + cameraX * camera)*100, y + (dy + cameraY * camera)*100);



            var col,
                _wid = 60,
                block = {};

            for (col = 0; col < _wid; col++) {
                var camera, ray_x, ray_y, ray_dx, ray_dy, map_x, map_y, delta_x,
                delta_y, step_x, step_y, horiz, wall_dist, wall_height,
                wall_x, draw_start, tex;

                camera = 2 * col / _wid - 1;
                ray_x = x;
                ray_y = y;
                ray_dx = dx + cameraX * camera;
                ray_dy = dy + cameraY * camera;
                map_x = Math.floor(ray_x / Data.size);
                map_y = Math.floor(ray_y / Data.size);
                delta_x = Math.sqrt(Data.size + (ray_dy * ray_dy) / (ray_dx * ray_dx));
                delta_y = Math.sqrt(Data.size + (ray_dx * ray_dx) / (ray_dy * ray_dy));

                // initial step for the ray
                if (ray_dx < 0) {
                    step_x = -Data.size;
                    dist_x = (ray_x - map_x * Data.size) * delta_x;
                } else {
                    step_x = Data.size;
                    dist_x = ((map_x + 1) * Data.size - ray_x) * delta_x;
                }
                if (ray_dy < 0) {
                    step_y = -Data.size;
                    dist_y = (ray_y - map_y * Data.size) * delta_y;
                } else {
                    step_y = Data.size;
                    dist_y = ((map_y + 1) * Data.size - ray_y) * delta_y;
                }

                // DDA
                while (true) {
                    if (dist_x < dist_y) {
                        dist_x += delta_x;
                        map_x += step_x;
                        horiz = true;
                    } else {
                        dist_y += delta_y;
                        map_y += step_y;
                        horiz = false;
                    }

                    if (map_x >= Data.width || map_x < 0 ||
                        map_y >= Data.height || map_y < 0)
                        break;

                    if (map[map_x][map_y] !== -1) {
                        block[map[map_x][map_y]] = true;
                        break;
                    }
                }

                drawShadow(x,y, block);
            }
        };

        function animate() {
            requestAnimationFrame(animate);
            drawLight(lightPos[0], lightPos[1]);
            rayCasting(lightPos[0], lightPos[1],0);
            renderer.render(stage);
        }

        setup();
    };

    $window.Test = Main;
})(window);