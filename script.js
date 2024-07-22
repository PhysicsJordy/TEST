const canvas = document.getElementById('simulationCanvas');
const ctx = canvas.getContext('2d');

const numParticles = 5;
const particleRadius = 10;
const springLength = 50;
const springConstant = 0.1;
const damping = 0.98;
const particles = [];

let draggingParticle = null;
let offsetX, offsetY;

// 초기 입자 위치 및 속도 설정
for (let i = 0; i < numParticles; i++) {
    for (let j = 0; j < numParticles; j++) {
        particles.push({
            x: 100 + j * springLength,
            y: 100 + i * springLength,
            vx: 0,
            vy: 0
        });
    }
}

function drawSpring(p1, p2) {
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 용수철 힘 계산 및 적용
    for (let i = 0; i < numParticles; i++) {
        for (let j = 0; j < numParticles; j++) {
            let p1 = particles[i * numParticles + j];

            if (i < numParticles - 1) {
                let p2 = particles[(i + 1) * numParticles + j];
                let dx = p2.x - p1.x;
                let dy = p2.y - p1.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                let force = springConstant * (dist - springLength);

                let fx = (force * dx) / dist;
                let fy = (force * dy) / dist;

                p1.vx += fx;
                p1.vy += fy;
                p2.vx -= fx;
                p2.vy -= fy;

                drawSpring(p1, p2);
            }

            if (j < numParticles - 1) {
                let p2 = particles[i * numParticles + (j + 1)];
                let dx = p2.x - p1.x;
                let dy = p2.y - p1.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                let force = springConstant * (dist - springLength);

                let fx = (force * dx) / dist;
                let fy = (force * dy) / dist;

                p1.vx += fx;
                p1.vy += fy;
                p2.vx -= fx;
                p2.vy -= fy;

                drawSpring(p1, p2);
            }
        }
    }

    // 입자 위치 업데이트
    for (let p of particles) {
        if (p !== draggingParticle) {
            p.vx *= damping;
            p.vy *= damping;
            p.x += p.vx;
            p.y += p.vy;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, particleRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'blue';
        ctx.fill();
        ctx.closePath();
    }

    requestAnimationFrame(update);
}

function getMousePos(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

canvas.addEventListener('mousedown', (e) => {
    const mousePos = getMousePos(canvas, e);
    for (let p of particles) {
        const dx = p.x - mousePos.x;
        const dy = p.y - mousePos.y;
        if (Math.sqrt(dx * dx + dy * dy) < particleRadius) {
            draggingParticle = p;
            offsetX = dx;
            offsetY = dy;
            break;
        }
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (draggingParticle) {
        const mousePos = getMousePos(canvas, e);
        draggingParticle.x = mousePos.x + offsetX;
        draggingParticle.y = mousePos.y + offsetY;
        draggingParticle.vx = 0;
        draggingParticle.vy = 0;
    }
});

canvas.addEventListener('mouseup', () => {
    draggingParticle = null;
});

canvas.addEventListener('mouseleave', () => {
    draggingParticle = null;
});

update();
