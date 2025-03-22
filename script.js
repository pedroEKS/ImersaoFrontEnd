const canvas = document.getElementById('snake-canvas');
const ctx = canvas.getContext('2d');
const gridSize = 20;
const tileCount = canvas.width / gridSize;
let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 15 };
let dx = 0;
let dy = 0;
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
let gameRunning = false;

document.getElementById('high-score').textContent = highScore;

document.addEventListener('keydown', (e) => {
    if (!gameRunning && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        gameRunning = true;
        gameLoop();
    }
    if (e.key === 'ArrowUp' && dy === 0) { dx = 0; dy = -1; }
    if (e.key === 'ArrowDown' && dy === 0) { dx = 0; dy = 1; }
    if (e.key === 'ArrowLeft' && dx === 0) { dx = -1; dy = 0; }
    if (e.key === 'ArrowRight' && dx === 0) { dx = 1; dy = 0; }
});

function spawnFood() {
    food.x = Math.floor(Math.random() * tileCount);
    food.y = Math.floor(Math.random() * tileCount);
}

function gameLoop() {
    if (!gameRunning) return;

    setTimeout(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const head = { x: snake[0].x + dx, y: snake[0].y + dy };// Mover a cobre
        snake.unshift(head);

        if (head.x === food.x && head.y === food.y) {           // Verificar comida
            score += 10;
            document.getElementById('score').textContent = score;
            spawnFood();
        } else {
            snake.pop();
        }

        ctx.fillStyle = '#ff007f';        // Desenhar cobrinha
        snake.forEach(segment => {
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
        });

        ctx.fillStyle = '#00f0ff';        // Desenhar comida
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);


        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount ||        // Colide
            snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
            gameOver();
            return;
        }

        requestAnimationFrame(gameLoop);
    }, 100);
}

function gameOver() {
    gameRunning = false;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        document.getElementById('high-score').textContent = highScore;
    }
    alert(`Game Over! Pontuação: ${score}`);
    snake = [{ x: 10, y: 10 }];
    dx = 0;
    dy = 0;
    score = 0;
    document.getElementById('score').textContent = score;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ff007f';
    ctx.fillRect(snake[0].x * gridSize, snake[0].y * gridSize, gridSize - 2, gridSize - 2);
    ctx.fillStyle = '#00f0ff';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

let selectedStars = 0;
const stars = document.querySelectorAll('.star');
stars.forEach(star => {
    star.addEventListener('click', () => {
        selectedStars = parseInt(star.dataset.value);
        stars.forEach(s => s.classList.toggle('selected', parseInt(s.dataset.value) <= selectedStars));
    });
});

const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
reviews.forEach(displayReview);

function submitReview() {
    const title = document.getElementById('game-title').value;
    const comment = document.getElementById('game-comment').value;

    if (title && selectedStars > 0 && comment) {
        const review = { title, stars: selectedStars, comment };
        reviews.push(review);
        localStorage.setItem('reviews', JSON.stringify(reviews));
        displayReview(review);

        document.getElementById('game-title').value = '';
        document.getElementById('game-comment').value = '';
        stars.forEach(s => s.classList.remove('selected'));
        selectedStars = 0;
    } else {
        alert('Preencha todos os campos!');
    }
}

function displayReview(review) {
    const reviewItem = document.createElement('div');
    reviewItem.classList.add('review-item');
    reviewItem.innerHTML = `
        <h3>${review.title}</h3>
        <p>${'★'.repeat(review.stars)}${'☆'.repeat(5 - review.stars)}</p>
        <p>${review.comment}</p>
    `;
    document.getElementById('review-list').appendChild(reviewItem);
}