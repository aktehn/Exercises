const canvas = document.getElementById("canvas1");
const cgc = canvas.getContext("2d"); // canvasın türünü belirtiyoruz
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;

let mouse = {
    x: null,
    y: null,
    radius: (canvas.height / 80) * (canvas.width / 80) // Oluşacak yayın yarıçapı
}

window.addEventListener('mousemove',
    function (event) {
        mouse.x = event.x;
        mouse.y = event.y;
    }
);

// parçacık oluşturma
class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }
    // bireysel parçacıklar çizme yöntemi
    draw() {
        cgc.beginPath();
        cgc.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        cgc.fillStyle = "#003049";
        cgc.fill();
    }
    // parçacık konumunu kontrol et, fare konumunu kontrol et, parçacığı hareket ettir, parçacığı çiz.
    update() {
        // parçacığın hala tuval içinde olup olmadığını kontrol et
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }

        // çarpışmayı kontrol et - fare konumu / parçacık konumu
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius + this.size) {
            if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                this.x += 10;
            }
            if (mouse.x > this.x && this.x > this.size * 10) {
                this.x -= 10;
            }
            if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                this.y += 10;
            }
            if (mouse.y > this.y && this.y > this.size * 10) {
                this.y -= 10;
            }
        }
        // parçacığı hareket ettir
        this.x += this.directionX;
        this.y += this.directionY;
        // parçacıklar çiz
        this.draw();
    }
}

// parçacık dizisi oluştur 
function init() {
    particlesArray = [];
    let numberOfParticles = (canvas.height * canvas.width) / 9000;
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 5) + 1;
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 5) - 2.5;
        let directionY = (Math.random() * 5) - 2.5;
        let color = "#003049";

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

// parçacıkların aralarında çizgi çekecek kadar yakın olup olmadığını kontrol edin
function connect() {
    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
            let distance = ((particlesArray[a].x - particlesArray[b].x)
                * (particlesArray[a].x - particlesArray[b].x))
                + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
            if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                cgc.strokeStyle = "003049";
                cgc.lineWidth = 1;
                cgc.beginPath();
                cgc.moveTo(particlesArray[a].x, particlesArray[a].y)
                cgc.lineTo(particlesArray[b].x, particlesArray[b].y)
                cgc.stroke();
            }
        }
    }
}

// animasyon döngüsü
function animate() {
    requestAnimationFrame(animate);
    cgc.clearRect(0, 0, innerWidth, innerHeight);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
    connect();
}

// Yeniden boyutlandırma
window.addEventListener("resize",
    function () {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        mouse.radius = ((canvas.height / 80) * (canvas.height / 80));
        init();
    }
);

// mouseout event
window.addEventListener("mouseout",
    function () {
        mouse.x = undefined;
        mouse.y = undefined;
    }
);

init();
animate();