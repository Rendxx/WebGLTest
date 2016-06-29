(function ($window) {
    var Para = {
    };

    var Data = {
        width: 30,
        height: 30,
        size: 16,
        visible: 200,
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
        var shadow = null;
        var mask = null;
        var shadowEdge = [];
        var fov = Math.PI / 3;
        var itemPos = [];

        var setup = function () {
            setupGrid();
            drawLayer();
            setupFunction();
            setupMask();
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
                itemPos[k] = [
                    item[0] * Data.size,
                    item[1] * Data.size,
                    (item[0] + item[2]) * Data.size,
                    (item[1] + item[3]) * Data.size,
                    (2 * item[0] + item[2]) / 2 * Data.size,
                    (2 * item[1] + item[3]) / 2 * Data.size
                ];
                for (var i = item[1]; i < item[1] + item[3]; i++) {
                    for (var j = item[0]; j < item[0] + item[2]; j++) {
                        map[i][j] = k;
                    }
                }
            }
        };

        var setupMask = function () {
            //mask = new PIXI.Container();
            //stage.addChild(mask);

            shadow = new PIXI.Graphics();
            stage.addChild(shadow);
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
                rotation = Math.atan2(mousePos[1] - lightPos[1], mousePos[0] - lightPos[0]);
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
                        graphics.endFill();
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
                        graphics.endFill();
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
            light.endFill();

            var graphics = shadowEdge[0];
            graphics.clear();
            graphics.beginFill();
            graphics.lineStyle(2, 0xFF0000);
            graphics.moveTo(x, y);
            graphics.lineTo(x + Math.cos(rotation - fov / 2) * Data.visible, y + Math.sin(rotation - fov / 2) * Data.visible);
            graphics.endFill();

            camera = 1;
            graphics = shadowEdge[1];
            graphics.clear();
            graphics.beginFill();
            graphics.lineStyle(2, 0xFF0000);
            graphics.moveTo(x, y);
            graphics.lineTo(x + Math.cos(rotation + fov / 2) * Data.visible, y + Math.sin(rotation + fov / 2) * Data.visible);
            graphics.endFill();

        };

        var drawShadow = function (x, y, block) {
            x = lightPos[0];
            y = lightPos[1];
            
            shadow.clear();
            shadow.lineStyle(0);
            shadow.beginFill(0xffffff, 0.5);
            shadow.drawPolygon([
                x, y,
                x + Math.cos(rotation - fov / 2) * Data.visible, y + Math.sin(rotation - fov / 2) * Data.visible,
                x + Math.cos(rotation + fov / 2) * Data.visible, y + Math.sin(rotation + fov / 2) * Data.visible
            ]);
            shadow.endFill();

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
                            graphics.endFill();
                        }
                    }

                    /*
                     *        (1)     (4)
                     *   [0,1] |       | [2,1] 
                     *   ----- +-------+ -----
                     *         | BLOCK | 
                     *   ----- +-------+ -----
                     *   [0,3] |       | [2,3] 
                     *        (2)     (3)
                     * 
                     * 
                     *          |      
                     *     -1   |    0
                     *          |
                     *  --------+--------->  [X]
                     *          |        
                     *     2    |    1
                     *          |
                     *          v  [Y]
                     *         
                     */
                    var _itemPos = itemPos[k];
                    var r = Math.ceil(Math.atan2(y - _itemPos[5], x - _itemPos[4]) * 2 / Math.PI),
                        p1 = null,
                        p2 = null,
                        drawList = [];

                    switch (r) {
                        case -1:
                            p1 = [_itemPos[0], _itemPos[3]]; // (2)
                            p2 = [_itemPos[2], _itemPos[1]]; // (4)

                            if (x >= _itemPos[0]) {
                                drawList.push(_itemPos[0]); // (1)
                                drawList.push(_itemPos[1]);
                                p1 = [_itemPos[0], _itemPos[1]];
                            }

                            drawList.push(_itemPos[0]); // (2)                 
                            drawList.push(_itemPos[3]);

                            drawList.push(_itemPos[2]); // (3)
                            drawList.push(_itemPos[3]);

                            drawList.push(_itemPos[2]); // (4)
                            drawList.push(_itemPos[1]);

                            if (y >= _itemPos[1]) {
                                drawList.push(_itemPos[0]); // (1)
                                drawList.push(_itemPos[1]);
                                p2 = [_itemPos[0], _itemPos[1]];
                            }
                            break;
                        case 0:
                            p1 = [_itemPos[0], _itemPos[1]]; // (1)
                            p2 = [_itemPos[2], _itemPos[3]]; // (3)

                            if (y >= _itemPos[1]) {
                                drawList.push(_itemPos[2]); // (4)
                                drawList.push(_itemPos[1]);
                                p1 = [_itemPos[2], _itemPos[1]];
                            }

                            drawList.push(_itemPos[0]); // (1)
                            drawList.push(_itemPos[1]);

                            drawList.push(_itemPos[0]); // (2)
                            drawList.push(_itemPos[3]);

                            drawList.push(_itemPos[2]); // (3)
                            drawList.push(_itemPos[3]);

                            if (x <= _itemPos[2]) {
                                drawList.push(_itemPos[2]); // (4)
                                drawList.push(_itemPos[1]);
                                p2 = [_itemPos[2], _itemPos[1]];
                            }
                            break;
                        case 1:
                            p1 = [_itemPos[2], _itemPos[1]]; // (4)
                            p2 = [_itemPos[0], _itemPos[3]]; // (2)

                            if (x <= _itemPos[2]) {
                                drawList.push(_itemPos[2]); // (3)
                                drawList.push(_itemPos[3]);
                                p1 = [_itemPos[2], _itemPos[3]];
                            }
                            drawList.push(_itemPos[2]); // (4)
                            drawList.push(_itemPos[1]);

                            drawList.push(_itemPos[0]); // (1)
                            drawList.push(_itemPos[1]);

                            drawList.push(_itemPos[0]); // (2)
                            drawList.push(_itemPos[3]);

                            if (y <= _itemPos[3]) {
                                drawList.push(_itemPos[2]); // (3)
                                drawList.push(_itemPos[3]);
                                p2 = [_itemPos[2], _itemPos[3]];
                            }
                            break;
                        case 2:
                            p1 = [_itemPos[2], _itemPos[3]]; // (3)
                            p2 = [_itemPos[0], _itemPos[1]]; // (1)

                            if (y <= _itemPos[3]) {
                                drawList.push(_itemPos[0]); // (2)
                                drawList.push(_itemPos[3]);
                                p1 = [_itemPos[0], _itemPos[3]];
                            }

                            drawList.push(_itemPos[2]); // (3)
                            drawList.push(_itemPos[3]);

                            drawList.push(_itemPos[2]); // (4)
                            drawList.push(_itemPos[1]);

                            drawList.push(_itemPos[0]); // (1)
                            drawList.push(_itemPos[1]);

                            if (x >= _itemPos[0]) {
                                drawList.push(_itemPos[0]); // (2)
                                drawList.push(_itemPos[3]);
                                p2 = [_itemPos[0], _itemPos[3]];
                            }
                            break;
                    }

                    var r1 = Math.atan2(p1[1] - y, p1[0] - x),
                        r2 = Math.atan2(p2[1] - y, p2[0] - x);

                    drawList.push(lightPos[0] + Data.visible * Math.cos(r2));
                    drawList.push(lightPos[1] + Data.visible * Math.sin(r2));
                    drawList.push(lightPos[0] + Data.visible * Math.cos(r1));
                    drawList.push(lightPos[1] + Data.visible * Math.sin(r1));

                    shadow.moveTo(x + Data.visible * Math.cos(r2), y + Data.visible * Math.sin(r2));
                    shadow.lineStyle(0);
                    shadow.beginFill(0x000000, 0.5);
                    shadow.arc(x, y, Data.visible, r2, r1);
                    shadow.endFill();

                    shadow.moveTo(drawList[0], drawList[1]);
                    shadow.lineStyle(0);
                    shadow.beginFill(0x000000, 0.5);
                    shadow.drawPolygon(drawList);
                    shadow.endFill();
                }
                else {
                    for (var i = item[1]; i < item[1] + item[3]; i++) {
                        for (var j = item[0]; j < item[0] + item[2]; j++) {
                            var graphics = graphicMap[i][j];
                            graphics.clear();
                            graphics.lineStyle(2, 0x333333, 1);
                            graphics.beginFill(0x444444, 1);
                            graphics.drawRect(j * Data.size, i * Data.size, Data.size, Data.size);
                            graphics.endFill();
                        }
                    }
                }
            }
        };

        function animate() {
            requestAnimationFrame(animate);
            drawLight(lightPos[0], lightPos[1], rotation, fov);
            RayCasting(lightPos[0] / Data.size, lightPos[1] / Data.size, rotation, fov, Data.visible / Data.size, map, 60, drawShadow);
            renderer.render(stage);
            if (that.onAnimate) that.onAnimate();
        }

        setup();
    };

    $window.Test = Main;
})(window);