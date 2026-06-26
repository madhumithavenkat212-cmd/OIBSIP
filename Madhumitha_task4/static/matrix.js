const canvas = document.getElementById("matrixCanvas");
const ctx = canvas.getContext("2d");

// Full screen canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Matrix characters
const letters =
    "01ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&@{}[]<>/\\|";

const chars = letters.split("");

const fontSize = 16;
const columns = Math.floor(canvas.width / fontSize);

// Array for drops
const drops = [];

for (let i = 0; i < columns; i++) {
    drops[i] = Math.random() * canvas.height;
}

function drawMatrix() {

    // Creates fading trail effect
    ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#00ff88";
    ctx.font = `${fontSize}px Share Tech Mono`;

    for (let i = 0; i < drops.length; i++) {

        const text =
            chars[Math.floor(Math.random() * chars.length)];

        ctx.fillText(
            text,
            i * fontSize,
            drops[i] * fontSize
        );

        // Reset drop randomly
        if (
            drops[i] * fontSize > canvas.height &&
            Math.random() > 0.975
        ) {
            drops[i] = 0;
        }

        drops[i]++;
    }
}

// Animation loop
setInterval(drawMatrix, 35);

// Resize support
window.addEventListener("resize", () => {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

});