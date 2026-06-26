const canvas = document.getElementById("matrixCanvas");
const ctx = canvas.getContext("2d");

// Canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Characters for Matrix effect
const letters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*(){}[]<>/\\|";

const chars = letters.split("");

const fontSize = 16;
let columns = Math.floor(canvas.width / fontSize);

// Store drop positions
let drops = [];

for (let i = 0; i < columns; i++) {
    drops[i] = Math.random() * canvas.height;
}

// Draw Matrix
function drawMatrix() {

    // Trail effect
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

        // Randomly restart drops
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

// Handle window resize
window.addEventListener("resize", () => {

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    columns = Math.floor(canvas.width / fontSize);

    drops = [];

    for (let i = 0; i < columns; i++) {
        drops[i] = Math.random() * canvas.height;
    }

});