(function($, window, document, undefined){
    'use strict';
    var blocksWide = 6,
        blocksHigh = 6,
        blockSize = 40,
        blocks = [],
        blockClasses = ['puzzle-block-left', 'puzzle-block-top', 'puzzle-block-right', 'puzzle-block-bottom'],
        puzzleBlockTemplate = '<div class="puzzle-block"><div></div></div>',
        swapChain = [];

    function PuzzleBlock(options) {
        this.class = options.class;
        this.isHiddenBlock = false;
        this.$el = $(template(puzzleBlockTemplate, options));
        this.$el.addClass(this.class);
        this.moveTo(options.x, options.y);
        var me = this;
        this.$el.on('dblclick', function() {
            me.rotate();
            return false;
        }).on('click', function() {
            swapBlocks(me);
            return false;
        });
    }

    PuzzleBlock.prototype.rotate = function() {
        var nextClass = blockClasses[blockClasses.indexOf(this.class) + 1] || blockClasses[0];
        this.$el.toggleClass([this.class, nextClass].join(' '));
        this.class = nextClass;
    };

    PuzzleBlock.prototype.moveTo = function(x, y) {
        this.x = x;
        this.y = y;
        this.$el.css({left: x * blockSize, top: y * blockSize});
    };

    function swapBlocks(block) {
        if (swapChain.length === 0) {
            swapChain.push(block);
            return;
        }
        if (isAdjacent(swapChain[swapChain.length - 1], block)) {
            swapChain.push(block);
        }
        if (swapChain.length >= 2) {
            var containsHiddenBlock = false;
            for (var i = 0; i < swapChain.length; i++) {
                if (swapChain[i].isHiddenBlock) {
                    containsHiddenBlock = true;
                }
            }
            if (containsHiddenBlock) {
                var firstBlock = {x: swapChain[0].x, y: swapChain[0].y};
                for (var i = 0, nextBlock; i < swapChain.length; i++) {
                    nextBlock = swapChain[i+1] || firstBlock;
                    swapChain[i].moveTo(nextBlock.x, nextBlock.y);
                }                
            }
            swapChain = [];
        }
    }

    function isAdjacent(block1, block2) {
        var xDiff = Math.abs(block1.x - block2.x),
            yDiff = Math.abs(block1.y - block2.y);
        return ((xDiff === 1 || yDiff === 1) && (xDiff + yDiff) === 1);
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
        var hiddenBlockIndex = {x: Math.floor(Math.random()*blocksHigh), y: Math.floor(Math.random()*blocksWide)};
        for (var x = 0; x < blocksHigh; x++) {
            for (var y = 0; y < blocksWide; y++) {
                puzzleBlock = new PuzzleBlock({
                    x: x,
                    y: y,
                    class: blockClasses[Math.floor(Math.random()*blockClasses.length)]
                });
                if (x === hiddenBlockIndex.x && y === hiddenBlockIndex.y) {
                    puzzleBlock.isHiddenBlock = true;
                    puzzleBlock.$el.addClass('hidden-block');
                }
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