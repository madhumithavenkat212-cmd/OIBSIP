// ================= LIVE CLOCK =================

function updateClock() {

    const now = new Date();

    document.getElementById("clock").innerText =
        now.toLocaleTimeString();
}

setInterval(updateClock, 1000);
updateClock();


// ================= LENGTH DISPLAY =================

const lengthSlider = document.getElementById("length");
const lengthValue = document.getElementById("lengthValue");

lengthSlider.addEventListener("input", () => {
    lengthValue.innerText = lengthSlider.value;
});


// ================= TYPING EFFECT =================

const typingText = document.querySelector(".typing-text");

const messages = [
    "Initializing Cyber Security Protocol...",
    "AI Encryption Module Activated...",
    "Generating Military Grade Passwords...",
    "System Status : SECURE",
    "Cyber Defense Shield Online..."
];

let msgIndex = 0;
let charIndex = 0;

function typeEffect() {

    if (charIndex < messages[msgIndex].length) {

        typingText.textContent +=
            messages[msgIndex].charAt(charIndex);

        charIndex++;

        setTimeout(typeEffect, 60);

    } else {

        setTimeout(eraseEffect, 1500);
    }
}

function eraseEffect() {

    if (typingText.textContent.length > 0) {

        typingText.textContent =
            typingText.textContent.slice(0, -1);

        setTimeout(eraseEffect, 30);

    } else {

        msgIndex = (msgIndex + 1) % messages.length;
        charIndex = 0;

        setTimeout(typeEffect, 300);
    }
}

typeEffect();


// ================= PASSWORD GENERATION =================

const generateBtn = document.getElementById("generateBtn");

generateBtn.addEventListener("click", async () => {

    const length = document.getElementById("length").value;

    const upper =
        document.getElementById("uppercase").checked;

    const numbers =
        document.getElementById("numbers").checked;

    const symbols =
        document.getElementById("symbols").checked;

    const response = await fetch("/generate", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            length,
            upper,
            numbers,
            symbols
        })
    });

    const data = await response.json();

    document.getElementById("passwordOutput").value =
        data.password;

    document.getElementById("strengthText").innerText =
        data.strength;

    updateHistory(data.history);

    showNotification("Password Generated Successfully");
});


// ================= HISTORY =================

function updateHistory(history) {

    const historyList =
        document.getElementById("historyList");

    historyList.innerHTML = "";

    history.forEach(item => {

        const li = document.createElement("li");

        li.innerHTML =
            `[${item.time}] → ${item.password}`;

        historyList.appendChild(li);
    });
}


// ================= COPY BUTTON =================

document.getElementById("copyBtn")
.addEventListener("click", () => {

    const output =
        document.getElementById("passwordOutput");

    if (output.value === "") {
        showNotification("Generate a password first!");
        return;
    }

    navigator.clipboard.writeText(output.value);

    showNotification("Password Copied");
});


// ================= CYBER NOTIFICATION =================

function showNotification(message) {

    const notify = document.createElement("div");

    notify.className = "notify";

    notify.innerText = message;

    document.body.appendChild(notify);

    setTimeout(() => {
        notify.classList.add("show");
    }, 100);

    setTimeout(() => {

        notify.classList.remove("show");

        setTimeout(() => {
            notify.remove();
        }, 500);

    }, 2500);
}


// ================= RANDOM SCANNER STATUS =================

const statusText =
    document.querySelector(".scan-status");

const statuses = [

    "Scanning Security Layers...",
    "Firewall Integrity : 100%",
    "No Vulnerabilities Detected",
    "Encryption Module Running...",
    "Cyber Shield Activated",
    "Threat Level : LOW",
    "AI Monitoring Enabled"
];

setInterval(() => {

    const random =
        statuses[Math.floor(Math.random()
        * statuses.length)];

    statusText.innerText = random;

}, 3000);