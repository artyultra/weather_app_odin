import "./style.css";
import { getWeatherData, getWeatherDataByLatLong } from "../api/weather";
import { AppState } from "../services/state";
import { renderCurrentWeather } from "./currentWeather";
import { renderUpcomingForecast } from "./upcomingWeather";

let app = new AppState();

app.subscribe("weatherData", (day) => {
  renderWeatherData(day);
});

app.subscribe("selectedDay", (day) => {
  app.setState("weatherData", day);
});

app.subscribe("daysData", (days) => {
  renderUpcomingForecast(days, app);
});

document.addEventListener("DOMContentLoaded", () => {
  onFirstRender();

  const cityInput = document.getElementById("city-input");
  cityInput.addEventListener("input", (event) => {
    app.setState("cityQuery", event.target.value);
  });

  const getWeatherButton = document.getElementById("get-weather");
  getWeatherButton.addEventListener("click", async () => {
    const cityQuery = app.getState("cityQuery");
    const data = await getWeatherData(cityQuery, app);
    app.setState("weatherData", data.days[0]);
  });
});

function renderWeatherData(data) {
  renderCurrentWeather(data, app);
}

async function onFirstRender() {
  let data = await getWeatherDataByLatLong(app);
  if (!data) {
    let cityQuery = "Los Angeles, CA";
    data = await getWeatherData(cityQuery, app);
    app.setState("weatherData", data.days[0]);
    return;
  }
  app.setState("weatherData", data.days[0]);
}
