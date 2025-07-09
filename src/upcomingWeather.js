// src/upcomingWeather.js

import { weatherIcons } from "../services/weatherIcons";

function renderUpcomingForecast(data, appState) {
  const upcomingForcast = document.getElementById("upcoming-weather-forecast");
  const upcomingForcastFrame = document.getElementById(
    "upcoming-weather-forecast-frame",
  );
  upcomingForcast.appendChild(upcomingForcastFrame);
  upcomingForcastFrame.style.width = `${100 * 2}%`;
  upcomingForcastFrame.innerHTML = "";

  for (let i = 0; i < data.length; i++) {
    if (i === 0) {
      continue;
    }

    const forecastCard = document.createElement("div");
    forecastCard.id = `forecast-card`;
    forecastCard.classList.add(`day${i}`);
    forecastCard.width = `${100 / data.length - 1}%`;
    if (i === 1) {
      forecastCard.classList.add("selected");
    }

    const forecastCardHeader = document.createElement("p");
    forecastCardHeader.classList.add("forecast-card-header");
    const weekday = new Date(data[i].datetime).toLocaleDateString("en-US", {
      weekday: "short",
    });
    forecastCardHeader.innerHTML = `${weekday}`;
    forecastCard.appendChild(forecastCardHeader);
    forecastCard.addEventListener("click", () => {
      removeSelectedCssFromAllForecastCards(forecastCards);
      forecastCard.classList.add("selected");
      appState.setState("selectedDay", data[i]);
    });

    const dailyWeatherIcon = document.createElement("img");
    dailyWeatherIcon.classList.add("daily-weather-icon");
    dailyWeatherIcon.src = weatherIcons[data[i].icon].src;
    forecastCard.appendChild(dailyWeatherIcon);

    const dailyWeatherTempContainer = document.createElement("div");
    dailyWeatherTempContainer.id = `daily-weather-temp-container`;

    const dailyHighTemp = document.createElement("span");
    dailyHighTemp.classList.add("daily-high-temp");
    dailyHighTemp.innerHTML = `${data[i].tempMax.toFixed(0)}°`;
    dailyWeatherTempContainer.appendChild(dailyHighTemp);

    const dailyLowTemp = document.createElement("span");
    dailyLowTemp.innerHTML = `${data[i].tempMin.toFixed(0)}°`;
    dailyLowTemp.classList.add("daily-low-temp");
    dailyWeatherTempContainer.appendChild(dailyLowTemp);

    forecastCard.appendChild(dailyWeatherTempContainer);

    upcomingForcastFrame.appendChild(forecastCard);
  }

  const forecastCards = document.querySelectorAll("#forecast-card");
  forecastCards.forEach((card, i) => {
    card.addEventListener("click", () => {});
  });
}

function removeSelectedCssFromAllForecastCards(cards) {
  cards.forEach((card) => {
    card.classList.remove("selected");
  });
}

export { renderUpcomingForecast };
