(function($, window, document, undefined){
    'use strict';
    var blocksWide = 6,
        blocksHigh = 6,
        blockSize = 40,
        blocks = [],
        blockClasses = ['puzzle-block-left', 'puzzle-block-top', 'puzzle-block-right', 'puzzle-block-bottom'],
        puzzleBlockTemplate = '<div class="puzzle-block {{class}}" style="left:{{x}}px;top:{{y}}px;"><div></div></div>';

    function PuzzleBlock(options) {
        this.x = options.x;
        this.y = options.y;
        this.class = options.class;
        this.$el = $(template(puzzleBlockTemplate, options));
        var me = this;
        this.$el.on('click', function() {
            var nextClass = blockClasses[blockClasses.indexOf(me.class) + 1] || blockClasses[0];
            $(this).toggleClass([me.class, nextClass].join(' '));
            me.class = nextClass;
        });
    }

    function template(templateString, data) {
        var p;
        for (p in data) {
            if (data.hasOwnProperty(p)) {
                templateString = templateString.replace(new RegExp('\\{\\{' + p + '\\}\\}', 'g'), data[p]);
            }
        }
        return templateString;
    }

    function initPuzzle() {
        var puzzleBlock;
        for (var high = 0; high < blocksHigh; high++) {
            for (var wide = 0; wide < blocksWide; wide++) {
                puzzleBlock = new PuzzleBlock({
                    x: blockSize * wide,
                    y: blockSize * high,
                    class: blockClasses[Math.floor(Math.random()*blockClasses.length)]
                });
                blocks.push(puzzleBlock);
                $('.puzzle').append(puzzleBlock.$el);
            }
        }
        
    }

    $(function() {
        initPuzzle();
        // $('.puzzle').on('click', function(event) {
        //     handleClick(event);
        // });
    });

})(jQuery, window, document);