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


        function animate() {
            requestAnimationFrame(animate);
            renderer.render(stage);
        }

        setup();
    };

    $window.Test = Main;
})(window);