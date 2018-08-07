let Locaiton;
const APPID = "380a0e7bca104feab04ab8ef03983a40"
const ClientID = '6fec2d525e4745f4b653315d0b92f11917359b3cb5c5784235f82bc8234f4b63';
let input;
function init() {
  input = document.getElementById("Input");
  fetch(`https://api.unsplash.com/photos/random?client_id=${ClientID}&query=weather`)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    document.getElementById("background").style.backgroundImage = `url("${data.urls.regular}")`;
  });
  input.addEventListener("keyup", (e) => {
    if(e.code === "Enter"){
      submit();
    }
  });
}
function submit() {
  if(input.value){
    Locaiton = input.value;
    initWeatherData();
  } else {
    submitErrorNotification(input);
  }
}

function submitErrorNotification() {
  input.classList.add("Error");
  document.getElementById("Error-Notification").classList.add("Error");
}

function initWeatherData() {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${Locaiton}&APPID=${APPID}&units=imperial`)
  .then((response) => {
    if(response.ok){
      return response.json();
    } else {
      throw Error(resizeBy.statusText);
    }
  })
  .then((data) => {
    fetch(`https://api.unsplash.com/photos/random?client_id=${ClientID}&query=weather-${data.weather[0].main.toLowerCase()}`)
    .then((response) => {
      return response.json();
    })
    .then((splashData) => {
      document.getElementById("background").style.backgroundImage = `url("${splashData.urls.regular}")`;
    });
    document.getElementById("temp").innerHTML = Math.round(data.main.temp);
    document.getElementById("tempMin").innerHTML = Math.round(data.main.temp_min);
    document.getElementById("tempMax").innerHTML = Math.round(data.main.temp_max);
    document.getElementById("windSpeed").innerHTML = Math.round(data.wind.speed);
    document.getElementById("city").innerHTML = data.name;
    document.getElementById("humd").innerHTML = data.main.humidity;
    if(data.weather[0].main == "Smoke"){
      document.getElementById("main").innerHTML = "Vape";
    }else{
      document.getElementById("main").innerHTML = data.weather[0].main;
    }
    document.getElementById("InputForm").remove();
    let windDegree = data.wind.deg;
    let directionElement = document.getElementById("windDirection");
    directionElement.innerHTML = CalcWindDirection(windDegree);
    document.getElementById("windDirectionParent").addEventListener("mouseover", (event) => {
      directionElement.innerHTML = Math.round(windDegree) + "&deg;";
    });
    document.getElementById("windDirectionParent").addEventListener("mouseout", (event) => {
      directionElement.innerHTML = CalcWindDirection(windDegree);
    });
    document.getElementById("WeatherData").classList.remove("Hidden");
  })
  .catch((error) => {
    submitErrorNotification();
  });
}

function CalcWindDirection(windDeg){
  if(windDeg >= 0 && windDeg <= 90){
    return "North";
  }
  else if(windDeg >= 90 && windDeg <= 180){
    return "East";
  }
  else if(windDeg >= 180 && windDeg <= 270){
    return "South";
  }
  else if(windDeg >= 270 && windDeg <= 360){
    return "West";
  }
}
