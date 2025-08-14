// Variáveis do jogo
let score = 0;
let timeLeft = 30;
let timerId;
let gameInterval;

// Elementos do DOM
const gameArea = document.getElementById('game-area');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const startImage = document.getElementById('start-image');

// Arrays de imagens para itens recicláveis e não recicláveis
const reciclaveis = [
    'https://cdn-icons-png.flaticon.com/512/3081/3081559.png',
    'https://cdn-icons-png.flaticon.com/512/3081/3081560.png',
    'https://cdn-icons-png.flaticon.com/512/3081/3081561.png',
    'https://cdn-icons-png.flaticon.com/512/3081/3081562.png',
    'https://cdn-icons-png.flaticon.com/512/3081/3081563.png',
    'https://cdn-icons-png.flaticon.com/512/3081/3081564.png'
];

const naoReciclaveis = [
    'https://cdn-icons-png.flaticon.com/512/3081/3081565.png',
    'https://cdn-icons-png.flaticon.com/512/3081/3081566.png',
    'https://cdn-icons-png.flaticon.com/512/3081/3081567.png',
    'https://cdn-icons-png.flaticon.com/512/3081/3081568.png',
    'https://cdn-icons-png.flaticon.com/512/3081/3081569.png',
    'https://cdn-icons-png.flaticon.com/512/3081/3081570.png'
];

// Estado inicial
if (stopBtn) stopBtn.disabled = true;
if (startImage) startImage.style.display = 'block';

// Event listeners
startBtn.addEventListener('click', startGame);
stopBtn.addEventListener('click', () => endGame(true));

// Função para iniciar o jogo
function startGame() {
    // Reset do jogo
    score = 0;
    timeLeft = 20; // respeita alteração do usuário

    // Atualiza displays
    updateScore();
    updateTimer();

    // Limpa área de jogo
    gameArea.innerHTML = '';

    // UI de botões e imagem inicial
    startBtn.disabled = true;
    stopBtn.disabled = false;
    if (startImage) startImage.style.display = 'none';

    // Inicia contador regressivo
    timerId = setInterval(() => {
        timeLeft--;
        updateTimer();
        if (timeLeft <= 0) {
            endGame(false);
        }
    }, 1000);

    // Inicia criação de itens
    gameInterval = setInterval(createItem, 800);
}

// Função para criar itens
function createItem() {
    const item = document.createElement('div');
    item.className = 'item';

    // 50% de chance de ser reciclável
    const isRecyclable = Math.random() < 0.5;

    if (isRecyclable) {
        item.classList.add('reciclavel');
        item.setAttribute('data-type', 'reciclavel');
        const randomImage = reciclaveis[Math.floor(Math.random() * reciclaveis.length)];
        item.style.backgroundImage = `url(${randomImage})`;
    } else {
        item.classList.add('nao-reciclavel');
        item.setAttribute('data-type', 'nao-reciclavel');
        const randomImage = naoReciclaveis[Math.floor(Math.random() * naoReciclaveis.length)];
        item.style.backgroundImage = `url(${randomImage})`;
    }

    // Posição aleatória robusta baseada no tamanho atual da área
    const itemSize = 60; // deve corresponder ao CSS
    const maxTop = gameArea.clientHeight - itemSize;
    const maxLeft = gameArea.clientWidth - itemSize;
    const top = Math.random() * Math.max(0, maxTop);
    const left = Math.random() * Math.max(0, maxLeft);

    item.style.top = top + 'px';
    item.style.left = left + 'px';

    // Event listener para clique (animações mais limpas)
    item.addEventListener('click', (ev) => {
        const rect = item.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        if (isRecyclable) {
            score += 10;
            showScoreFloat(x, y, '+10', '#1E7A46');
        } else {
            score -= 5;
            showScoreFloat(x, y, '-5', '#B02A37');
        }

        updateScore();

        // Remoção com fade/scale limpo
        item.style.transition = 'transform 0.25s ease, opacity 0.25s ease';
        item.style.transform = 'scale(0.9)';
        item.style.opacity = '0';
        setTimeout(() => item.remove(), 250);
    });

    // Adiciona item à área de jogo
    gameArea.appendChild(item);

    // Remove item automaticamente após 2s se não for clicado
    setTimeout(() => {
        if (item.parentNode) {
            item.style.transform = 'scale(0.9)';
            item.style.opacity = '0';
            setTimeout(() => item.parentNode && item.remove(), 200);
        }
    }, 2000);
}

// Floater de pontuação na posição do clique/item
function showScoreFloat(x, y, text, color) {
    const float = document.createElement('div');
    float.textContent = text;
    float.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        transform: translate(-50%, -50%);
        color: ${color};
        font-size: 1.25rem;
        font-weight: 800;
        pointer-events: none;
        z-index: 2000;
        background: rgba(255,255,255,0.9);
        padding: 4px 8px;
        border-radius: 12px;
        border: 2px solid rgba(255,255,255,0.7);
        box-shadow: 0 8px 16px rgba(0,0,0,0.15);
        opacity: 0;
        transition: transform 0.6s ease, opacity 0.6s ease;
    `;

    document.body.appendChild(float);
    requestAnimationFrame(() => {
        float.style.opacity = '1';
        float.style.transform = 'translate(-50%, -90%)';
    });
    setTimeout(() => {
        float.style.opacity = '0';
        float.style.transform = 'translate(-50%, -140%)';
        setTimeout(() => float.remove(), 300);
    }, 600);
}

// Função para atualizar placar
function updateScore() {
    scoreDisplay.textContent = `Pontos: ${score}`;
    if (score >= 0) {
        scoreDisplay.classList.add('score-up');
        setTimeout(() => scoreDisplay.classList.remove('score-up'), 450);
    } else {
        scoreDisplay.classList.add('score-down');
        setTimeout(() => scoreDisplay.classList.remove('score-down'), 450);
    }
}

// Função para atualizar timer
function updateTimer() {
    timerDisplay.textContent = `Tempo: ${timeLeft}`;
    if (timeLeft <= 10) {
        timerDisplay.style.color = '#B02A37';
        timerDisplay.style.animation = 'pulse 1s infinite';
    } else {
        timerDisplay.style.color = '#2C3E50';
        timerDisplay.style.animation = 'none';
    }
}

// Finaliza o jogo (stopped = true quando usuário clica em Parar)
function endGame(stopped = false) {
    clearInterval(timerId);
    clearInterval(gameInterval);

    startBtn.disabled = false;
    stopBtn.disabled = true;

    gameArea.innerHTML = '';
    if (startImage) startImage.style.display = 'block';

    let message = '';
    if (stopped) {
        message = `⏹️ Jogo parado!\nPontuação final: ${score}`;
    } else {
        if (score > 0) {
            message = `🎉 Parabéns! Você fez ${score} pontos!\n\n♻ Continue reciclando para salvar o planeta!\n🌍 Cada pequena ação faz a diferença!`;
        } else if (score === 0) {
            message = `🤔 Você fez ${score} pontos.\n\n♻ Tente novamente e lembre-se:\n🌱 Reciclar é fundamental para o futuro do planeta!`;
        } else {
            message = `💪 Você fez ${score} pontos.\n\n♻ Não desanime! A reciclagem é um hábito\n🌱 que se aprende com prática e dedicação!`;
        }
    }

    alert(message);
}

// CSS extra para animações do timer
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
`;
document.head.appendChild(style);
