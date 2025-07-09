// src/currentWeather.js

import { createSimpleChart } from "../services/simpleChart";
import { weatherIcons } from "../services/weatherIcons";

function renderCurrentWeather(data, appState) {
  appState.subscribe("temperatureUnit", (newTempUnit) => {
    renderTempuratureValue(data, newTempUnit);
  });

  appState.subscribe("selected-hourly-forcast", (selected) => {
    renderHourlyForcast(data, selected);
  });

  appState.subscribe("cityAddress", (address) => {
    renderHeaderInfo(address);
  });

  const weatherIcon = document.getElementById("current-weather-icon");
  weatherIcon.src = weatherIcons[data.icon].src;
  weatherIcon.alt = weatherIcons[data.icon].alt;

  // button and unit selection
  const tempUnitFahren = document.querySelector(".temp-unit.fahrenheit");
  const tempUnitCel = document.querySelector(".temp-unit.celsius");

  tempUnitFahren.addEventListener("click", () => {
    appState.setState("temperatureUnit", "F");
  });

  tempUnitCel.addEventListener("click", () => {
    appState.setState("temperatureUnit", "C");
  });

  appState.setState("temperatureUnit", "F");

  const hourlyButtons = document.querySelectorAll(".hourly-button");

  hourlyButtons.forEach((button) => {
    if (button.classList.contains("selected")) {
      let selected = "";
      switch (button.innerHTML.trim()) {
        case "Temperature":
          selected = "temp";
          break;
        case "Precipitation":
          selected = "precipprob";
          break;
        case "Wind":
          selected = "windspeed";
          break;
        default:
          console.log("No Matching Button");
          break;
      }
      appState.setState("selected-hourly-forcast", selected);
    }
    button.addEventListener("click", () => {
      removeSelectedCssFromButtons(hourlyButtons);
      button.classList.add("selected");
      let selected = "";
      switch (button.innerHTML.trim()) {
        case "Temperature":
          selected = "temp";
          break;
        case "Precipitation":
          selected = "precipprob";
          break;
        case "Wind":
          selected = "windspeed";
          break;
        default:
          console.log("No Matching Button");
          break;
      }
      appState.setState("selected-hourly-forcast", selected);
    });
  });

  renderDateAndCondtions(data);
  // Use it with your data
}

function renderTempuratureValue(data, tempUnit) {
  const temperatureValue = document.querySelector(".temp-value");

  const tempUnitFahren = document.querySelector(".temp-unit.fahrenheit");
  const tempUnitCel = document.querySelector(".temp-unit.celsius");

  const dataDate = new Date(data.datetime);
  const today = new Date();

  let tempValue = data.temp;

  if (dataDate.getDate() !== today.getDate()) {
    tempValue = Math.round(data.tempMax);
  }

  if (tempUnit === "C") {
    const converted = Math.round(((tempValue - 32) * 5) / 9);
    tempUnitFahren.classList.remove("selected");
    tempUnitCel.classList.add("selected");
    temperatureValue.innerHTML = converted;
    return;
  }
  tempUnitCel.classList.remove("selected");
  tempUnitFahren.classList.add("selected");
  temperatureValue.innerHTML = tempValue;
}

function renderHourlyForcast(data, selectedHourlyForcast) {
  createSimpleChart(data, "#hourly-temperature-chart", {
    width: 800,
    height: 150, // Much smaller height!
    gridStep: 10, // 10-degree grid steps
    lineColor: "yellow",
    showLabels: true,
    fillColor: "rgba(255, 255, 0, 0.2)",
    smoothing: 0.2,
    targetDataPoint: selectedHourlyForcast,
  });
}

function removeSelectedCssFromButtons(elements) {
  elements.forEach((element) => {
    element.classList.remove("selected");
  });
}

function renderHeaderInfo(address) {
  const header = document.getElementById("current-address");
  header.innerText = address;
}

function renderDateAndCondtions(data) {
  const weekday = new Date(data.datetime).toLocaleDateString("en-US", {
    weekday: "long",
  });

  const dateSpan = document.querySelector(".weather-app.date");
  const conditionsSpan = document.querySelector(".weather-app.conditions");

  dateSpan.innerText = weekday;
  conditionsSpan.innerText = data.conditions;
}

export { renderCurrentWeather };
