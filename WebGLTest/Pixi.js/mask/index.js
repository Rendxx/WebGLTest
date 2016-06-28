(function ($window) {
    var Para = {
    };

    var Data = {
    };

    var Main = function () {
        // callback
        this.onAnimate = null;

        // ----------------------------------------------------------------
        var renderer = PIXI.autoDetectRenderer(800, 600, { backgroundColor: 0x1099bb });
        document.body.appendChild(renderer.view);

        // create the root of the scene graph
        var stage = new PIXI.Container();

        var container = new PIXI.Container();

        var line = null,
            line_bg = null,
            mask = null;
        
        PIXI.loader
        .add('energy_line.png')
        .add('energy_line_bg.png')
        .load(function (loader, resources) {

            line_bg = new PIXI.Sprite(PIXI.Texture.fromImage('energy_line_bg.png'));
            line_bg.position.set(0, 0);
            stage.addChild(line_bg);

            mask = new PIXI.Graphics();
            mask.beginFill(0xffffff,1);
            mask.drawRect(0, 0, 512, 20);
            mask.endFill();

            line = new PIXI.Sprite(PIXI.Texture.fromImage('energy_line.png'));
            line.position.set(0, 0);

            line.mask = mask;
            stage.addChild(mask);
            stage.addChild(line);
            // start animating
            animate();
        });
        
        function animate() {
            requestAnimationFrame(animate);

            mask.scale.x += 0.01;
            if (mask.scale.x > 1) mask.scale.x = 0;
            renderer.render(stage);
        }
    };

    $window.Test = Main;
})(window);