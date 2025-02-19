
const road = document.querySelector('.road');
const scoreDisplay = document.querySelector('.score');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');

let carPositionX = 50; // Initial horizontal position (percentage)
let carPositionY = 80; // Initial vertical position (percentage)
let score = 0;
let obstacleSpeed = 5;
let obstacleCreationInterval;
let obstacles = [];
let gameOver = false;
const speedIncreaseInterval = 10;

// Create the car element
const car = document.createElement('div');
car.classList.add('car');
road.appendChild(car);

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && carPositionX > 0) {
        carPositionX -= 30;
        if (carPositionX < 0) carPositionX = 0; // Prevent moving beyond the left boundary
    } else if (e.key === 'ArrowRight' && carPositionX < 95) {
        carPositionX += 30;
        if (carPositionX > 95) carPositionX = 95; // Prevent moving beyond the right boundary
    } else if (e.key === 'ArrowUp' && carPositionY > 0) {
        carPositionY -= 5;
        if (carPositionY < 0) carPositionY = 0; // Prevent moving beyond the top boundary
    } else if (e.key === 'ArrowDown' && carPositionY < 90) {
        carPositionY += 5;
        if (carPositionY > 90) carPositionY = 90; // Prevent moving beyond the bottom boundary
    }

    updateCarPosition(); // Update the car's position on the screen
});

function updateCarPosition() {
    car.style.left = carPositionX + '%';
    car.style.top = carPositionY + '%';
}

function startGame() {
    gameOver = false;
    score = 0;
    scoreDisplay.textContent = `Score: ${score}`;
    startBtn.style.display = 'none';
    restartBtn.style.display = 'none';

    road.innerHTML = '';
    road.appendChild(car);
    carPositionX = 50;
    carPositionY = 80;
    updateCarPosition();
    car.classList.remove('crash');

    obstacles = [];
    obstacleCreationInterval = setInterval(createObstacle, 2000);
    gameLoop();
}

function restartGame() {
    clearInterval(obstacleCreationInterval);
    startGame();
}

function createObstacle() {
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    obstacle.style.left = Math.random() * (road.clientWidth - 50) + 'px';
    obstacle.style.top = '-100px';
    road.appendChild(obstacle);
    obstacles.push(obstacle);
}

function gameLoop() {
    if (gameOver) return;

    obstacles.forEach((obstacle, index) => {
        let obstacleTop = parseInt(obstacle.style.top);
        obstacleTop += obstacleSpeed;

        if (obstacleTop > road.clientHeight) {
            // Remove the obstacle if it moves out of view
            obstacle.remove();
            obstacles.splice(index, 1);
            score++;
            scoreDisplay.textContent = `Score: ${score}`;

            // **Increase speed based on score**
            if (score % speedIncreaseInterval === 0) {
                obstacleSpeed += 5; // Increase speed every 10 points
            }
        } else if (isCollision(obstacle)) {
            endGame();
        } else {
            obstacle.style.top = obstacleTop + 'px';
        }
    });

    requestAnimationFrame(gameLoop);
}

function isCollision(obstacle) {
    const carRect = car.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();

    return !(
        carRect.right < obstacleRect.left ||
        carRect.left > obstacleRect.right ||
        carRect.bottom < obstacleRect.top ||
        carRect.top > obstacleRect.bottom
    );
}

function endGame() {
    clearInterval(obstacleCreationInterval);
    gameOver = true;
    car.classList.add('crash');
    setTimeout(() => {
        alert(`Game Over! Score: ${score}`);
        restartBtn.style.display = 'block';
    }, 500);
}
