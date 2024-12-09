document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('scoreValue');

    // Set canvas size and initial background
    canvas.width = 600;
    canvas.height = 400;

    // Add background pattern function
    function drawBackground() {
        // Fill main background
        ctx.fillStyle = '#0A1520';  // Darker blue-black background
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw subtle grid
        ctx.strokeStyle = 'rgba(13, 192, 157, 0.1)';  // Very faint Nextflow green
        ctx.lineWidth = 1;
        
        // Draw vertical lines
        for (let x = 0; x < canvas.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
        
        // Draw horizontal lines
        for (let y = 0; y < canvas.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
    }

    // Game constants
    const gridSize = 30;  // Increased grid size
    const tickRate = 120;
    const iconSize = 40;  // Size for both snake and food icons
    
    // Create SVG images
    const snakeHead = new Image();
    snakeHead.src = 'assets/nextflow_icon_color.svg';
    
    const processIcon = new Image();
    processIcon.src = 'assets/nf-core-logo-square.svg';

    // Game state
    let snake = [{x: 10, y: 10}];
    let food = getRandomPosition();
    let direction = 'right';
    let nextDirection = 'right';
    let score = 0;
    let gameLoop;
    let gameActive = true;
    let gameOverScreen = false;

    // Input handling
    document.addEventListener('keydown', (e) => {
        if (!gameActive && e.code === 'Space') {
            startGame();
            return;
        }

        switch(e.key) {
            case 'ArrowUp':
            case 'w':
                if (direction !== 'down') nextDirection = 'up';
                break;
            case 'ArrowDown':
            case 's':
                if (direction !== 'up') nextDirection = 'down';
                break;
            case 'ArrowLeft':
            case 'a':
                if (direction !== 'right') nextDirection = 'left';
                break;
            case 'ArrowRight':
            case 'd':
                if (direction !== 'left') nextDirection = 'right';
                break;
        }
    });

    function drawSnake() {
        snake.forEach((segment, index) => {
            const x = segment.x * gridSize + (gridSize - iconSize)/2;
            const y = segment.y * gridSize + (gridSize - iconSize)/2;
            
            if (index === 0) {
                // Draw head with rotation
                ctx.save();
                ctx.translate(segment.x * gridSize + gridSize/2, segment.y * gridSize + gridSize/2);
                ctx.rotate(getRotationAngle());
                ctx.drawImage(snakeHead, -iconSize/2, -iconSize/2, iconSize, iconSize);
                ctx.restore();
            } else {
                // Draw body segment as Nextflow logo
                ctx.drawImage(snakeHead, x, y, iconSize, iconSize);
            }
        });
    }

    function getRotationAngle() {
        switch(direction) {
            case 'up': return -Math.PI/2;
            case 'down': return Math.PI/2;
            case 'left': return Math.PI;
            case 'right': return 0;
        }
    }

    function drawFood() {
        // Center the food icon in its grid cell
        const x = food.x * gridSize + (gridSize - iconSize)/2;
        const y = food.y * gridSize + (gridSize - iconSize)/2;
        ctx.drawImage(processIcon, x, y, iconSize, iconSize);
    }

    function moveSnake() {
        if (!gameActive) return;

        direction = nextDirection;
        const head = {x: snake[0].x, y: snake[0].y};
        
        switch(direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }

        // Check for collisions
        if (head.x < 0 || head.x >= canvas.width/gridSize || 
            head.y < 0 || head.y >= canvas.height/gridSize ||
            snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            gameOver();
            return;
        }

        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {
            score += 10;
            scoreElement.textContent = score;
            food = getRandomPosition();
        } else {
            snake.pop();
        }
    }

    function gameOver() {
        gameActive = false;
        gameOverScreen = true;
        clearInterval(gameLoop);
        drawGameOver();
    }

    function drawGameOver() {
        // Solid background for game over screen
        ctx.fillStyle = '#0A1520';  // Match the game background
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw game over text with shadow
        ctx.fillStyle = '#22A699';
        ctx.shadowColor = 'rgba(13, 192, 157, 0.5)';
        ctx.shadowBlur = 10;
        
        // Main title with emojis
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🎄 Game Over! 🎄', canvas.width/2, canvas.height/2 - 40);
        
        // Score with gift emoji
        ctx.font = '28px Arial';
        ctx.fillText(`🎁 Score: ${score} 🎁`, canvas.width/2, canvas.height/2 + 20);
        
        // Reset shadow for restart text
        ctx.shadowBlur = 0;
        ctx.font = '24px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText('Press Space to try again!', canvas.width/2, canvas.height/2 + 70);

        // Add festive message based on score
        if (score >= 300) {  // Lowered from 300 for testing
            // Draw background for password
            ctx.fillStyle = 'rgba(13, 192, 157, 0.2)';
            ctx.fillRect(canvas.width/2 - 200, canvas.height/2 + 90, 400, 40);
            
            // Draw password message
            ctx.font = 'bold 20px Arial';
            ctx.fillStyle = '#FFD700';
            ctx.shadowColor = 'rgba(255, 215, 0, 0.5)';
            ctx.shadowBlur = 5;
            const message = "🌟 SECRET PASSWORD: SantaFlowHoHoHo 🌟";
            ctx.fillText(message, canvas.width/2, canvas.height/2 + 110);
        } else if (score >= 20) {
            ctx.font = '20px Arial';
            ctx.fillStyle = '#0DC09D';
            ctx.fillText("Ho Ho Ho! Almost there!", canvas.width/2, canvas.height/2 + 110);
        } else {
            ctx.font = '20px Arial';
            ctx.fillStyle = '#0DC09D';
            ctx.fillText("Keep spreading the holiday cheer!", canvas.width/2, canvas.height/2 + 110);
        }
    }

    function getRandomPosition() {
        return {
            x: Math.floor(Math.random() * (canvas.width / gridSize)),
            y: Math.floor(Math.random() * (canvas.height / gridSize))
        };
    }

    function update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBackground();  // Add background before drawing game elements
        drawFood();
        drawSnake();
        
        if (gameOverScreen) {
            drawGameOver();
        }
        
        requestAnimationFrame(update);
    }

    function startGame() {
        snake = [{x: 10, y: 10}];
        food = getRandomPosition();
        direction = 'right';
        nextDirection = 'right';
        score = 0;
        scoreElement.textContent = score;
        gameActive = true;
        gameOverScreen = false;
        
        if (gameLoop) clearInterval(gameLoop);
        gameLoop = setInterval(moveSnake, tickRate);
        requestAnimationFrame(update);
    }

    // Start the game when SVGs are loaded
    Promise.all([
        new Promise(resolve => snakeHead.onload = resolve),
        new Promise(resolve => processIcon.onload = resolve)
    ]).then(() => {
        startGame();
    });
}); 