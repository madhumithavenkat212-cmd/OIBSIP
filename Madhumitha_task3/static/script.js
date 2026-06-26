// ---------- ELEMENTS ----------

const bmiValue =
    document.getElementById(
        "bmiValue"
    );

const category =
    document.getElementById(
        "category"
    );

const tip =
    document.getElementById(
        "tip"
    );

const water =
    document.getElementById(
        "water"
    );

const calories =
    document.getElementById(
        "calories"
    );

const users =
    document.getElementById(
        "users"
    );

const historyTable =
    document.getElementById(
        "historyTable"
    );


// ---------- BMI CALCULATE ----------

async function calculateBMI(){

    const name =
        document.getElementById(
            "name"
        ).value;

    const age =
        document.getElementById(
            "age"
        ).value;

    const gender =
        document.getElementById(
            "gender"
        ).value;

    const height =
        document.getElementById(
            "height"
        ).value;

    const weight =
        document.getElementById(
            "weight"
        ).value;

    if(
        !name ||
        !age ||
        !height ||
        !weight
    ){
        alert(
            "Please fill all fields."
        );
        return;
    }

    const response =
        await fetch(
            "/calculate",
            {
                method:"POST",
                headers:{
                    "Content-Type":
                    "application/json"
                },
                body:JSON.stringify({
                    name,
                    age,
                    gender,
                    height,
                    weight
                })
            }
        );

    const data =
        await response.json();

    bmiValue.innerHTML =
        data.bmi;

    category.innerHTML =
        data.category;

    tip.innerHTML =
        data.tip;

    water.innerHTML =
        data.water + " L";

    calories.innerHTML =
        data.calories + " kcal";

    loadHistory();
    loadStats();

    animateCircle(
        data.category
    );
}


// ---------- CIRCLE COLOR ----------

function animateCircle(cat){

    const circle =
        document.querySelector(
            ".circle"
        );

    if(
        cat ===
        "Underweight"
    ){

        circle.style.background =
            "linear-gradient(45deg,#f59e0b,#fde68a)";
    }

    else if(
        cat ===
        "Normal"
    ){

        circle.style.background =
            "linear-gradient(45deg,#00ff88,#22c55e)";
    }

    else if(
        cat ===
        "Overweight"
    ){

        circle.style.background =
            "linear-gradient(45deg,#fb923c,#f97316)";
    }

    else{

        circle.style.background =
            "linear-gradient(45deg,#ef4444,#b91c1c)";
    }
}


// ---------- HISTORY ----------

async function loadHistory(){

    const response =
        await fetch(
            "/get_history"
        );

    const data =
        await response.json();

    if(
        data.length === 0
    ){

        historyTable.innerHTML =
            "No records.";

        return;
    }

    let html =
        `
        <table
        width="100%">

        <tr>
            <th>Name</th>
            <th>BMI</th>
            <th>Category</th>
            <th>Date</th>
        </tr>
        `;

    data.forEach(
        row => {

            html +=
            `
            <tr>
                <td>${row.name}</td>
                <td>${row.bmi}</td>
                <td>${row.category}</td>
                <td>${row.created_at}</td>
            </tr>
            `;
        }
    );

    html += "</table>";

    historyTable.innerHTML =
        html;
}


// ---------- STATS ----------

async function loadStats(){

    const response =
        await fetch(
            "/stats"
        );

    const data =
        await response.json();

    users.innerHTML =
        data.total_users;
}


// ---------- CHART ----------

async function loadChart(){

    const response =
        await fetch(
            "/chart"
        );

    const data =
        await response.json();

    document
        .getElementById(
            "chartImg"
        )
        .src =
        data.chart
        + "?t="
        + new Date().getTime();
}






// ---------- THEME ----------

const themeBtn =
    document.getElementById(
        "themeBtn"
    );

themeBtn.addEventListener(
    "click",
    () => {

        document.body.classList
            .toggle(
                "light-mode"
            );
    }
);


// ---------- ENTER KEY ----------

document.addEventListener(
    "keydown",
    function(e){

        if(
            e.key ===
            "Enter"
        ){

            calculateBMI();
        }
    }
);


// ---------- AUTO LOAD ----------

loadStats();
loadHistory();