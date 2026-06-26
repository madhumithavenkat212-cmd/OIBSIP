// ================= LIVE CLOCK =================

function updateClock() {
    const now = new Date();

    document.getElementById("clock").innerText =
        now.toLocaleTimeString();
}

setInterval(updateClock, 1000);
updateClock();


// ================= TYPING EFFECT =================

const typingText = document.querySelector(".typing-text");

const messages = [
    "Initializing Cyber AI Engine...",
    "Neural Network Online...",
    "Cyber Security Layer Activated...",
    "AI Core Running Successfully...",
    "System Status : SECURE"
];

let messageIndex = 0;
let charIndex = 0;

function typeEffect() {

    if (charIndex < messages[messageIndex].length) {

        typingText.textContent +=
            messages[messageIndex].charAt(charIndex);

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

        messageIndex =
            (messageIndex + 1) % messages.length;

        charIndex = 0;

        setTimeout(typeEffect, 300);
    }
}

typeEffect();


// ================= CHAT FUNCTION =================

const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");


async function sendMessage() {

    const message = userInput.value.trim();

    if (message === "") return;

    // USER MESSAGE

    const userDiv = document.createElement("div");

    userDiv.className = "user-message";

    userDiv.innerHTML = `
        <strong>YOU</strong><br>
        ${message}
    `;

    chatBox.appendChild(userDiv);

    userInput.value = "";

    scrollBottom();


    // BOT TYPING EFFECT

    const typingDiv = document.createElement("div");

    typingDiv.className = "bot-message";

    typingDiv.id = "typing";

    typingDiv.innerHTML =
        "<span class='bot-tag'>CYBER AI</span>Typing...";

    chatBox.appendChild(typingDiv);

    scrollBottom();


    try {

        const response = await fetch("/chat", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                message: message
            })
        });

        const data = await response.json();

        document.getElementById("typing").remove();


        const botDiv = document.createElement("div");

        botDiv.className = "bot-message";

        botDiv.innerHTML = `
            <span class="bot-tag">
                CYBER AI
            </span>

            ${data.response}
        `;

        chatBox.appendChild(botDiv);

        scrollBottom();

    }

    catch (error) {

        document.getElementById("typing").remove();

        const errorDiv = document.createElement("div");

        errorDiv.className = "bot-message";

        errorDiv.innerHTML = `
            <span class="bot-tag">
                CYBER AI
            </span>

            Error connecting to server.
        `;

        chatBox.appendChild(errorDiv);

        scrollBottom();
    }
}


// ================= BUTTON CLICK =================

sendBtn.addEventListener(
    "click",
    sendMessage
);


// ================= ENTER KEY =================

userInput.addEventListener("keypress", function(e){

    if(e.key === "Enter"){
        sendMessage();
    }

});


// ================= AUTO SCROLL =================

function scrollBottom(){

    chatBox.scrollTop =
        chatBox.scrollHeight;
}


// ================= CYBER NOTIFICATION =================

function showNotification(text){

    const note =
        document.createElement("div");

    note.className = "notification";

    note.innerText = text;

    document.body.appendChild(note);

    setTimeout(()=>{
        note.classList.add("show");
    },100);

    setTimeout(()=>{

        note.classList.remove("show");

        setTimeout(()=>{
            note.remove();
        },500);

    },2500);
}


// Welcome notification

window.onload = ()=>{

    showNotification(
        "Cyber AI Initialized Successfully"
    );

};