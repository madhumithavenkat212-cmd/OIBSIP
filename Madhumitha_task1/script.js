const cityInput=document.getElementById("cityInput");
const searchBtn=document.getElementById("searchBtn");
const locationBtn=document.getElementById("locationBtn");

const cityName=document.getElementById("cityName");
const countryName=document.getElementById("countryName");
const temperature=document.getElementById("temperature");
const weatherCondition=document.getElementById("weatherCondition");
const humidity=document.getElementById("humidity");
const wind=document.getElementById("wind");
const visibility=document.getElementById("visibility");
const pressure=document.getElementById("pressure");
const sunrise=document.getElementById("sunrise");
const sunset=document.getElementById("sunset");

const weatherIcon=document.getElementById("weatherIcon");

const rainContainer=document.getElementById("rainContainer");
const snowContainer=document.getElementById("snowContainer");
const stars=document.getElementById("stars");

const aqi=document.getElementById("aqi");
const aqiText=document.getElementById("aqiText");

const uvIndex=document.getElementById("uvIndex");
const uvText=document.getElementById("uvText");

function updateClock(){
const now=new Date();
document.getElementById("liveTime").innerHTML=now.toLocaleTimeString();
document.getElementById("liveDate").innerHTML=now.toDateString();
}
setInterval(updateClock,1000);
updateClock();

/* WEATHER ICON */
function weatherEmoji(code){
if(code===0) return "☀️";
if(code<=3) return "☁️";
if(code<=65) return "🌧️";
if(code<=75) return "❄️";
return "⛈️";
}

/* TEXT */
function weatherText(code){
if(code===0) return "Clear";
if(code<=3) return "Cloudy";
if(code<=65) return "Rain";
if(code<=75) return "Snow";
return "Storm";
}

/* SEARCH */
searchBtn.onclick=()=>{
const city=cityInput.value.trim();
if(city) searchCity(city);
};

locationBtn.onclick=()=>{
navigator.geolocation.getCurrentPosition(p=>{
fetchWeather(p.coords.latitude,p.coords.longitude,"Current Location");
});
};

async function searchCity(city){
const res=await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`);
const data=await res.json();
if(!data.results) return alert("City not found");
const r=data.results[0];
fetchWeather(r.latitude,r.longitude,r.name,r.country);
}

async function fetchWeather(lat,lon,city,country){
const res=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,pressure_msl,visibility&daily=weather_code,temperature_2m_max,sunrise,sunset&timezone=auto`);
const data=await res.json();

const c=data.current;

cityName.innerHTML=city;
countryName.innerHTML=country;
temperature.innerHTML=Math.round(c.temperature_2m)+"°C";
weatherCondition.innerHTML=weatherText(c.weather_code);
weatherIcon.innerHTML=weatherEmoji(c.weather_code);

humidity.innerHTML=c.relative_humidity_2m+"%";
wind.innerHTML=c.wind_speed_10m+" km/h";
pressure.innerHTML=c.pressure_msl+" hPa";
visibility.innerHTML=Math.round(c.visibility/1000)+" km";

sunrise.innerHTML=data.daily.sunrise[0].split("T")[1];
sunset.innerHTML=data.daily.sunset[0].split("T")[1];

updateForecast(data);
applyTheme(c.weather_code);
}

/* FORECAST SAFE */
function updateForecast(data){
const cards=document.querySelectorAll(".forecastCard");
for(let i=0;i<Math.min(7,cards.length);i++){
cards[i].innerHTML=`
<h3>${data.daily.time[i]}</h3>
<div style="font-size:30px">${weatherEmoji(data.daily.weather_code[i])}</div>
<h2>${Math.round(data.daily.temperature_2m_max[i])}°C</h2>
`;
}
}

/* EFFECTS */
function createRain(){
rainContainer.innerHTML="";
for(let i=0;i<120;i++){
const d=document.createElement("div");
d.style.position="absolute";
d.style.width="2px";
d.style.height="20px";
d.style.left=Math.random()*100+"%";
d.style.animation="fall 1s linear infinite";
rainContainer.appendChild(d);
}
}

function createSnow(){
snowContainer.innerHTML="";
for(let i=0;i<80;i++){
const s=document.createElement("div");
s.innerHTML="•";
s.style.position="absolute";
s.style.left=Math.random()*100+"%";
s.style.animation="fall 3s linear infinite";
snowContainer.appendChild(s);
}
}

function flash(){
document.body.style.opacity="0.5";
setTimeout(()=>document.body.style.opacity="1",100);
}

/* THEME */
function applyTheme(code){
rainContainer.innerHTML="";
snowContainer.innerHTML="";

if(code===0){
document.body.style.background="linear-gradient(#4facfe,#00f2fe)";
}
else if(code<=3){
document.body.style.background="linear-gradient(#4b6584,#778ca3)";
}
else if(code<=65){
document.body.style.background="linear-gradient(#2c3e50,#4ca1af)";
createRain();
}
else if(code<=75){
document.body.style.background="linear-gradient(#d7d2cc,#304352)";
createSnow();
}
else{
document.body.style.background="linear-gradient(#232526,#414345)";
createRain();
flash();
}
}

/* GEO LOAD */
navigator.geolocation.getCurrentPosition(p=>{
fetchWeather(p.coords.latitude,p.coords.longitude,"Current Location");
});