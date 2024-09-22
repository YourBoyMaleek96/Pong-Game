/************************************************************************************************

* Name:         Malik Freeman
* Date:         9/29/2024
* Course:       SSE 657  Object-Oriented Methods
* Assignment:   Week 6 Recreate Pong in Javascript or another language of your choosing
* File Name:    pong.js
* Description:  This file contains the model, view, and controller for game of Pong

/********************************************************************************************/



/**
 * Model for game of Pong
 * The  model shows the stat e of the Pong Game.
 * It sets the position and speed of the paddles and the ball.
 * It also defines the score of the game.
 *              T
 */

const model = {
    canvas: document.getElementById('pongCanvas'),
    ctx: null,
    // defines Paddle and ball speed 
    paddleSpeed: 3,
    ballSpeed: 2,
    // Winning score 
    winningScore: 5,
    //defines Paddle position and velocity 
    leftPaddleY: 160,
    rightPaddleY: 160,
    leftPaddleVelocity: 0,
    rightPaddleVelocity: 0,
    //defines ball position and speed 
    ballX: 300,
    ballY: 200,
    ballXSpeed: 3,
    ballYSpeed: 3,
    leftPlayerScore: 0,
    rightPlayerScore: 0,
    player2IsComputer: false,
    gameStarted: false,

    resetGameState() 
    {
        this.leftPaddleY = 160;
        this.rightPaddleY = 160;
        this.ballX = this.canvas.width / 2;
        this.ballY = this.canvas.height / 2;
        this.leftPlayerScore = 0;
        this.rightPlayerScore = 0;
        this.gameStarted = false;
    }
};

// === View ===
const view = {
    init(ctx) {
        model.ctx = ctx;
    },

    drawGame() {
        const ctx = model.ctx;

        // Clear the canvas
        ctx.clearRect(0, 0, model.canvas.width, model.canvas.height);

        // Draw paddles
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, model.leftPaddleY, 10, 80); // Left paddle
        ctx.fillRect(model.canvas.width - 10, model.rightPaddleY, 10, 80); // Right paddle

        // Draw ball
        ctx.beginPath();
        ctx.arc(model.ballX, model.ballY, 10, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.closePath();

        // Draw score
        ctx.font = '30px Arial';
        ctx.fillText(model.leftPlayerScore + ' - ' + model.rightPlayerScore, model.canvas.width / 2 - 30, 30);
    },

    displayMenu(show) {
        document.getElementById('menu').style.display = show ? 'block' : 'none';
        model.canvas.style.display = show ? 'none' : 'block';
    },

    showWinner(winner) {
        alert(winner + " wins!");
    }
};

/**
 * Sets up the sounds used for starting the game,
 * ball hits wall, paddle, and point scored.        T
 */
const sounds = {
    start: document.getElementById('StartSound'),
    hitWall: document.getElementById('HitWallSound'),
    paddle: document.getElementById('PaddleSound'),
    score: document.getElementById('PointSound')
};


// === Controller ===
const controller = {
    startGame() {
        console.log("Start Game called");
        if (sounds.start) {
            sounds.start.play(); // Play the start game sound 
        } else {
            console.error("Start sound not found");
        }
        const modeSelect = document.getElementById('mode');
        model.player2IsComputer = modeSelect.value === 'single';
        model.gameStarted = true;
        view.displayMenu(false); // Hide menu
    
        // Check if canvas is visible
        model.canvas.style.display = 'block';
    
        // Start game loop
        controller.gameLoop();
    },
    
    gameLoop() {
        if (model.gameStarted) 
        {
            controller.updateGame();
            view.drawGame();
            requestAnimationFrame(controller.gameLoop);
        }
    },

    updateGame() 
    {
        // Update left paddle (player 1)
        model.leftPaddleY += model.leftPaddleVelocity;

        // AI for right paddle if player2IsComputer (when playing against the computer)
        if (model.player2IsComputer) 
        {
            // Move the right paddle based on the ball's Y position
            if (model.ballY > model.rightPaddleY + 40) 
            {
                model.rightPaddleVelocity = model.paddleSpeed;
            } 
            else if (model.ballY < model.rightPaddleY + 40) 
            {
                model.rightPaddleVelocity = -model.paddleSpeed;
            }    
            else 
            {
                model.rightPaddleVelocity = 0;
            }
        }

        // Update right paddle (either player-controlled or computer-controlled)
        model.rightPaddleY += model.rightPaddleVelocity;

        // Update ball position
        model.ballX += model.ballXSpeed;
        model.ballY += model.ballYSpeed;

        // Ball collision with wall
        if (model.ballY < 0 || model.ballY > model.canvas.height) {
            model.ballYSpeed = -model.ballYSpeed;
            sounds.hitWall.play(); //play sound when ball hits the wall 
        }

        // Ball collision with paddles or reset after scoring
        controller.checkPaddleCollision();
        controller.checkWin();
    },

    checkPaddleCollision() 
    {
        // Check if the ball passed the left paddle
        if (model.ballX < 0) 
        {
            if (model.ballY > model.leftPaddleY && model.ballY < model.leftPaddleY + 80) 
            {
                model.ballXSpeed = -model.ballXSpeed;
                sounds.paddle.play(); // play sound wqhen ball is hit with paddle
            } 
            else 
            {
                model.ballX = model.canvas.width / 2;
                model.ballY = model.canvas.height / 2;
                model.rightPlayerScore++;
                sounds.score.play(); //play a sound when a point is scored 
            }
        }

        // Check if the ball passed the right paddle
        if (model.ballX > model.canvas.width) {
            if (model.ballY > model.rightPaddleY && model.ballY < model.rightPaddleY + 80) 
            {
                model.ballXSpeed = -model.ballXSpeed;
                sounds.paddle.play(); // play sound wqhen ball is hit with paddle
            } 
            else 
            {
                model.ballX = model.canvas.width / 2;
                model.ballY = model.canvas.height / 2;
                model.leftPlayerScore++;
                sounds.score.play(); //play a sound when a point is scored 
            }
        }

        // Ensure paddles stay within canvas
        if (model.leftPaddleY < 0) model.leftPaddleY = 0;
        if (model.leftPaddleY > model.canvas.height - 80) model.leftPaddleY = model.canvas.height - 80;
        if (model.rightPaddleY < 0) model.rightPaddleY = 0;
        if (model.rightPaddleY > model.canvas.height - 80) model.rightPaddleY = model.canvas.height - 80;
    },

    checkWin() 
    {
        if (model.leftPlayerScore === model.winningScore || model.rightPlayerScore === model.winningScore) 
        {
            view.showWinner(model.leftPlayerScore === model.winningScore ? 'Left player' : 'Right player');
            model.resetGameState();
            view.displayMenu(true);
        }
    },

    // hadles keybord inputs 
    handleKeyPress(event) 
    {
        if (model.gameStarted) 
            {
            if (event.key === 'ArrowUp') 
            {
                model.rightPaddleVelocity = -model.paddleSpeed;
            } 
            else if (event.key === 'ArrowDown') 
            {
                model.rightPaddleVelocity = model.paddleSpeed;
            } 
            else if (event.key === 'w') 
            {
                model.leftPaddleVelocity = -model.paddleSpeed;
            } 
            else if (event.key === 's') 
            {
                model.leftPaddleVelocity = model.paddleSpeed;
            }
        }
    },

    handleKeyRelease(event) 
    {
        if (model.gameStarted) 
            {
            if (event.key === 'ArrowUp' || event.key === 'ArrowDown') 
            {
                model.rightPaddleVelocity = 0;
            } 
            else if (event.key === 'w' || event.key === 's') 
            {
                model.leftPaddleVelocity = 0;
            }
        }
    }
};

// Event listeners for key presses
document.addEventListener('keydown', controller.handleKeyPress);
document.addEventListener('keyup', controller.handleKeyRelease);

// Initialize canvas context
view.init(model.canvas.getContext('2d'));
