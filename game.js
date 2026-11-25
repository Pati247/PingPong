
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const speedSelect = document.getElementById("speed");
const ballColorSelect = document.getElementById("ballColor");
const paddleColorSelect = document.getElementById("paddleColor");
const skin1Select = document.getElementById("skin1");
const skin2Select = document.getElementById("skin2");
const startButton = document.getElementById("startButton");

const score1Display = document.getElementById("score1");
const score2Display = document.getElementById("score2");

const table = { left: 90, right: 710, top: 125, bottom: 405 };

let speed = Number(speedSelect.value);
let ballColor = ballColorSelect.value;
let paddleColor = paddleColorSelect.value;

let skin1 = skin1Select.value;
let skin2 = skin2Select.value;

const keys = {};

const left = { x: 25, y: 220, score: 0 };
const right = { x: 710, y: 220, score: 0 };

const ball = { x: 400, y: 265, vx: 5, vy: 2, radius: 8 };

document.addEventListener("keydown", event => {
    keys[event.key.toLowerCase()] = true;
});

document.addEventListener("keyup", event => {
    keys[event.key.toLowerCase()] = false;
});

function resetBall(direction) {
    ball.x = 400;
    ball.y = 265;
    ball.vx = speed * direction;
    ball.vy = (Math.random() - 0.5) * speed;
}

function skinColors(skin) {
    if (skin === "dark") {
        return {
            body: "#302522",
            ears: "#211916",
            muzzle: "#e5a36f",
            paws: "#d99562",
            outline: "#211916",
            eyes: "#171313",
            blush: "#e98c83",
            fluffy: false,
            blue: false
        };
    }

    if (skin === "fluffy") {
        return {
            body: "#f5e9d1",
            ears: "#b88c69",
            muzzle: "#fff1df",
            paws: "#ead4b5",
            outline: "#66534e",
            eyes: "#283d55",
            blush: "#f2a5b1",
            fluffy: true,
            blue: true
        };
    }

    return {
        body: "#75452f",
        ears: "#513022",
        muzzle: "#e9c29a",
        paws: "#d6a77d",
        outline: "#352219",
        eyes: "#21140f",
        blush: "#e89a8d",
        fluffy: false,
        blue: false
    };
}

function ellipse(x, y, rx, ry, color, outline, rotation = 0) {
    ctx.fillStyle = color;
    ctx.strokeStyle = outline;
    ctx.lineWidth = 2.5;

    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, rotation, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
}

function drawDog(x, y, facingRight, skin) {
    const c = skinColors(skin);

    ctx.save();

    if (!facingRight) {
        ctx.translate(x + 65, 0);
        ctx.scale(-1, 1);
        x = 0;
    }

    // Ogon
    ctx.strokeStyle = c.outline;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x + 12, y + 60);
    ctx.quadraticCurveTo(x - 2, y + 50, x + 3, y + 43);
    ctx.stroke();

    // Długi tułów
    ellipse(x + 32, y + 58, 30, 17, c.body, c.outline);

    // Kudłate futerko
    if (c.fluffy) {
        for (let i = 0; i < 12; i++) {
            const px = x + 7 + i * 4.5;
            const py = y + 45 + Math.sin(i * 1.5) * 5;
            ellipse(px, py, 5, 5, c.body, c.outline);
        }
    }

    // Krótkie łapki
    ellipse(x + 13, y + 73, 7, 10, c.paws, c.outline);
    ellipse(x + 48, y + 73, 7, 10, c.paws, c.outline);

    // Szyja
    ellipse(x + 18, y + 42, 13, 19, c.body, c.outline);

    // Klapnięte uszy
    ellipse(x + 7, y + 20, 10, 21, c.ears, c.outline, -0.3);
    ellipse(x + 53, y + 20, 10, 21, c.ears, c.outline, 0.3);

    // Głowa
    ellipse(x + 31, y + 25, 27, 25, c.body, c.outline);

    // Pyszczek
    ellipse(x + 40, y + 36, 16, 11, c.muzzle, c.outline);

    // Oczy
    if (skin === "dark") {
        // Zabawne, lekko rozkojarzone spojrzenie
        ellipse(x + 22, y + 23, 3, 3, c.eyes, c.outline);
        ellipse(x + 43, y + 27, 3, 3, c.eyes, c.outline);

        ctx.strokeStyle = c.outline;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + 17, y + 15);
        ctx.lineTo(x + 25, y + 16);
        ctx.moveTo(x + 40, y + 19);
        ctx.lineTo(x + 48, y + 17);
        ctx.stroke();
    } else {
        // Duże, błyszczące oczy
        ellipse(x + 22, y + 23, 5, 6, c.eyes, c.outline);
        ellipse(x + 43, y + 23, 5, 6, c.eyes, c.outline);

        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(x + 23, y + 21, 2, 0, Math.PI * 2);
        ctx.arc(x + 44, y + 21, 2, 0, Math.PI * 2);
        ctx.fill();

        if (c.blue) {
            ctx.fillStyle = "#77bce8";
            ctx.beginPath();
            ctx.arc(x + 20, y + 25, 2, 0, Math.PI * 2);
            ctx.arc(x + 41, y + 25, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    // Nos
    ellipse(x + 51, y + 34, 4, 3, c.outline, c.outline);

    // Uśmiech
    ctx.strokeStyle = c.outline;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + 44, y + 43);
    ctx.quadraticCurveTo(x + 49, y + 48, x + 54, y + 42);
    ctx.stroke();

    // Rumieńce
    ctx.fillStyle = c.blush;
    ctx.beginPath();
    ctx.arc(x + 14, y + 37, 4, 0, Math.PI * 2);
    ctx.fill();

    // Rakietka
    ctx.save();
    ctx.translate(x + 59, y + 53);
    ctx.rotate(-0.25);

    ellipse(2, 0, 7, 15, paddleColor, c.outline);

    ctx.restore();
    ctx.restore();
}

function update() {
    // Sterowanie
    if (keys["w"]) left.y -= 5;
    if (keys["s"]) left.y += 5;
    if (keys["arrowup"]) right.y -= 5;
    if (keys["arrowdown"]) right.y += 5;

    left.y = Math.max(table.top, Math.min(table.bottom - 85, left.y));
    right.y = Math.max(table.top, Math.min(table.bottom - 85, right.y));

    // Ruch piłki
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Górna i dolna krawędź stołu
    if (ball.y - ball.radius <= table.top) {
        ball.y = table.top + ball.radius;
        ball.vy = Math.abs(ball.vy);
    }

    if (ball.y + ball.radius >= table.bottom) {
        ball.y = table.bottom - ball.radius;
        ball.vy = -Math.abs(ball.vy);
    }

    // Odbicie od lewego jamnika
    if (
        ball.vx < 0 &&
        ball.x - ball.radius <= 100 &&
        ball.x > 75 &&
        ball.y >= left.y + 25 &&
        ball.y <= left.y + 75
    ) {
        ball.vx = Math.abs(ball.vx);
        ball.x = 101;
    }

    // Odbicie od prawego jamnika
    if (
        ball.vx > 0 &&
        ball.x + ball.radius >= 700 &&
        ball.x < 725 &&
        ball.y >= right.y + 25 &&
        ball.y <= right.y + 75
    ) {
        ball.vx = -Math.abs(ball.vx);
        ball.x = 699;
    }

    // Punkt dla prawego gracza
    if (ball.x < table.left) {
        right.score++;
        score2Display.textContent = right.score;
        resetBall(1);
    }

    // Punkt dla lewego gracza
    if (ball.x > table.right) {
        left.score++;
        score1Display.textContent = left.score;
        resetBall(-1);
    }
}

function draw() {
    // Tło
    ctx.fillStyle = "#f5e8d5";
    ctx.fillRect(0, 0, 800, 500);

    // Podłoga
    ctx.fillStyle = "#e8c99c";
    ctx.fillRect(0, 420, 800, 80);

    ctx.strokeStyle = "#d5b487";
    ctx.lineWidth = 2;

    for (let y = 440; y < 500; y += 25) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(800, y);
        ctx.stroke();
    }

    // Stół
    ctx.fillStyle = "#729db5";
    ctx.strokeStyle = "#66534e";
    ctx.lineWidth = 5;

    ctx.beginPath();
    ctx.moveTo(105, 125);
    ctx.lineTo(695, 125);
    ctx.quadraticCurveTo(710, 125, 710, 140);
    ctx.lineTo(710, 390);
    ctx.quadraticCurveTo(710, 405, 695, 405);
    ctx.lineTo(105, 405);
    ctx.quadraticCurveTo(90, 405, 90, 390);
    ctx.lineTo(90, 140);
    ctx.quadraticCurveTo(90, 125, 105, 125);
    ctx.fill();
    ctx.stroke();

    // Linia środkowa
    ctx.strokeStyle = "#fffaf2";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(400, 125);
    ctx.lineTo(400, 405);
    ctx.stroke();

    // Siatka
    ctx.fillStyle = "#fffaf2";
    ctx.fillRect(394, 125, 12, 280);

    // Jamniki
    drawDog(left.x, left.y, true, skin1);
    drawDog(right.x, right.y, false, skin2);

    // Piłeczka
    ctx.fillStyle = ballColor;
    ctx.strokeStyle = "#66534e";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Rozpoczęcie nowej gry
startButton.addEventListener("click", () => {
    speed = Number(speedSelect.value);
    ballColor = ballColorSelect.value;
    paddleColor = paddleColorSelect.value;

    skin1 = skin1Select.value;
    skin2 = skin2Select.value;

    left.score = 0;
    right.score = 0;

    left.y = 220;
    right.y = 220;

    score1Display.textContent = "0";
    score2Display.textContent = "0";

    resetBall(Math.random() < 0.5 ? -1 : 1);
});

resetBall(1);
gameLoop();
