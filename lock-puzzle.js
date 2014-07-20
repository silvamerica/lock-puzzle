(function($, window, document, undefined){
    'use strict';
    var blocksWide = 2,
        blocksHigh = 2,
        blockSize = 40,
        blocks = {},
        answerBlocks = {},
        blockClasses = ['puzzle-block-left', 'puzzle-block-top', 'puzzle-block-right', 'puzzle-block-bottom'],
        blockStrengths = ['puzzle-block-low', 'puzzle-block-med', 'puzzle-block-high'],
        puzzleBlockTemplate = '<div class="puzzle-block"><div></div></div>',
        swapChain = [],
        score = 0,
        level = 1;

    function PuzzleBlock(options) {
        this.class = options.class;
        this.strength = options.strength;
        this.$el = $(template(puzzleBlockTemplate, options));
        this.$el.addClass(this.class);
        this.$el.addClass(this.strength);
        this.moveTo(options.x, options.y);
        if (!options.answer) {
            var me = this;
            this.$el.on('dblclick', function() {
                swapChain = [];
                me.rotate();
                return false;
            }).on('click', function() {
                swapBlocks(me);
                return false;
            });
        }
    }

    PuzzleBlock.prototype.rotate = function() {
        var nextClass = blockClasses[blockClasses.indexOf(this.class) + 1] || blockClasses[0];
        this.$el.toggleClass([this.class, nextClass].join(' '));
        this.class = nextClass;
        incrementScore();
        checkEquality();
    };

    PuzzleBlock.prototype.moveTo = function(x, y) {
        this.x = x;
        this.y = y;
        this.$el.css({left: x * blockSize, top: y * blockSize});
    };

    function checkEquality() {
        var location, x, y;
        for (x = 0; x < blocksHigh; x++) {
            for (y = 0; y < blocksWide; y++) {
                location = x + '-' + y;
                if (blocks[location].strength !== answerBlocks[location].strength ||
                    blocks[location].class !== answerBlocks[location].class) {
                        return false;
                }
            }
        }
        // If we make it this far, reset.
        increaseDifficulty();
    }

    function increaseDifficulty() {
        setTimeout(function() {
            blocksHigh = blocksHigh + 1;
            blocksWide = blocksWide + 1;
            level = level + 1;
            $('.level').text(level);
            initPuzzle();
        }, 750);
    }

    function incrementScore() {
        score = score + 1;
        $('.score').text(score);
    }

    function swapBlocks(block) {
        if (swapChain.length === 0) {
            swapChain.push(block);
            return;
        }
        if (isAdjacent(swapChain[swapChain.length - 1], block)) {
            swapChain.push(block);
        } else {
            swapChain = [];
        }
        if (swapChain.length >= 2) {
            if (true) {
                var firstBlock = {x: swapChain[0].x, y: swapChain[0].y};
                for (var i = 0, nextBlock; i < swapChain.length; i++) {
                    nextBlock = swapChain[i+1] || firstBlock;
                    swapChain[i].moveTo(nextBlock.x, nextBlock.y);
                    // Move the blocks around in the block list so we can check for equality
                    blocks[nextBlock.x + '-' + nextBlock.y] = swapChain[i];
                }                
            }
            swapChain = [];
            incrementScore();
            checkEquality();
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
        var puzzleBlock, x, y;
        blocks = {};
        answerBlocks = {};
        $('.puzzle, .puzzle-answer').empty().css({width:blockSize * blocksWide + 'px', height: blockSize * blocksHigh + 'px'});
        $('.puzzle-container').css({width:(blockSize * blocksWide * 2) + 90 + 'px'});
        for (x = 0; x < blocksHigh; x++) {
            for (y = 0; y < blocksWide; y++) {
                puzzleBlock = new PuzzleBlock({
                    x: x,
                    y: y,
                    class: blockClasses[Math.floor(Math.random()*blockClasses.length)],
                    strength: blockStrengths[Math.floor(Math.random()*blockStrengths.length)],
                });
                blocks[x + '-' + y] = puzzleBlock;
                $('.puzzle').append(puzzleBlock.$el);
            }
        }
        // Set up the answer blocks
        var randomLocations = [],
            randomLocation,
            answerBlock;
        for (x = 0; x < blocksHigh; x++) {
            for (y = 0; y < blocksWide; y++) {
                randomLocations.push(x + '-' + y);
            }
        }
        for (x = 0; x < blocksHigh; x++) {
            for (y = 0; y < blocksWide; y++) {
                randomLocation = randomLocations.splice(Math.floor( Math.random() * randomLocations.length ), 1)[0];
                answerBlock = new PuzzleBlock({
                    x: x,
                    y: y,
                    class: blockClasses[Math.floor(Math.random()*blockClasses.length)],
                    strength: blocks[randomLocation].strength,
                    answer: true
                });
                answerBlocks[x + '-' + y] = answerBlock;
                $('.puzzle-answer').append(answerBlock.$el);
            }
        }
    }

    $(function() {
        initPuzzle();
    });

})(jQuery, window, document);