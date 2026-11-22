const canvas = document.getElementById('Main-Canva');
const ctx = canvas.getContext('2d');
const imgMario = new Image();
imgMario.src = "mario.png";
const imgMoneda = new Image();
imgMoneda.src = "Trozo_de_Estrella.png";
alert("Instrucciones: Usa espacio para dar un salto normal, y después da click para dar un salto giro");

function play_musica() {
    document.getElementById("musica").play();
};
play_musica();

const player = {
    x: canvas.width / 2,
    y:400,
    radius: 20,
    vy: 0,
    gravedad: 0.5,
    piso: false,
    girar: false
};
let puntos = 0;
const moneda = {
    x: canvas.width / 2,
    y: 250,
    radius: 12
};
function crearMonedas() {
    moneda.y = Math.floor(Math.random() * 100) + 220;
};
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space' && player.piso) {
        console.log('Salto!');
        player.vy = -11;
        player.piso = false;
        player.girar = true;
    };
});
canvas.addEventListener('click', () => {
    if (!player.piso === true && player.girar === true) {
        console.log('Salto giro!');
        player.vy = -9;
        player.girar = false;
    };
});
function bucle() {
    player.vy += player.gravedad;
    player.y += player.vy;
    if (player.y >= 400) {
        player.y = 400;
        player.vy = 0;
        player.piso = true;
        player.girar = false;
    };
    const distY = Math.abs(player.y - moneda.y);
    if (distY < player.radius + moneda.radius) {
      puntos++;
      crearMonedas();
    };

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Moneda
    ctx.drawImage(imgMoneda, moneda.x - moneda.radius, moneda.y - moneda.radius, moneda.radius * 2, moneda.radius * 2);

    // El Mario
    ctx.drawImage(imgMario, player.x - player.radius, player.y - player.radius, player.radius * 2, player.radius * 2);    

    // Los puntos
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px Arial';
    ctx.fillText('Puntos: ' + puntos, 20, 30);

    requestAnimationFrame(bucle);
};

bucle();