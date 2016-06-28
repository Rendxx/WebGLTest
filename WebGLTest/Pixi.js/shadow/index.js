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
        var grid = null;
        var stage = new PIXI.Container();
        var layer_grid = new PIXI.Container();
        var currentPos = [0,0];
        
        var setup = function () {
            setupGrid();
            drawLayer();
            animate();
        };

        var setupGrid = function () {
            grid = [];
            for (var i = 0; i < Data.height; i++) {
                grid[i] = [];
                for (var j = 0; j < Data.width; j++) {
                    grid[i][j] = -1;
                }
            }

            for (var k = 0; k < Data.item.length; k++) {
                var item = Data.item[k];
                for (var i = item[1]; i < item[1] + item[3]; i++) {
                    for (var j = item[0]; j < item[0] + item[2]; j++) {
                        grid[i][j] = k;
                    }
                }
            }
        };

        var setupMouse = function () {
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
        };

        var drawLayer = function () {
            for (var i = 0; i < Data.height; i++) {
                for (var j = 0; j < Data.width; j++) {
                    if (grid[i][j] === -1) {
                        var graphics = new PIXI.Graphics();
                        graphics.lineStyle(2, 0xeeeeee, 1);
                        graphics.beginFill(0xdddddd, 1);
                        graphics.drawRect(j * Data.size, i * Data.size, Data.size, Data.size);
                        layer_grid.addChild(graphics);
                    } else {
                    }
                }
            }
            for (var i = 0; i < Data.height; i++) {
                for (var j = 0; j < Data.width; j++) {
                    if (grid[i][j] === -1) {
                    } else {
                        var graphics = new PIXI.Graphics();
                        graphics.lineStyle(2, 0x333333, 1);
                        graphics.beginFill(0x444444, 1);
                        graphics.drawRect(j * Data.size, i * Data.size, Data.size, Data.size);
                        layer_grid.addChild(graphics);
                    }
                }
            }
            stage.addChild(layer_grid);
        };

        var drawShadow = function () {
            var graphics = new PIXI.Graphics();
            graphics.beginFill(0xdddddd, 1);
            graphics.drawCircle(currentPos[0], currentPos[1], Data.size * 8);
            graphics.endFill();
            layer_grid.addChild(graphics);

            for (var k = 0; k < Data.item.length; k++) {
                var item = Data.item[k];
                var r1 = 0,
                    r2 = 0;


            }
        };

        function animate() {
            requestAnimationFrame(animate);
            drawShadow();
            renderer.render(stage);
        }

        setup();
    };

    $window.Test = Main;
})(window);