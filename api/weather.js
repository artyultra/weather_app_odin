// api/weather.js
// This file contains the code for the weather API

import { getCurrentLocation } from "../services/currentLocation";

const api_key = import.meta.env.VITE_API_KEY;

const base_url =
  "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/";

async function getWeatherData(city, appState) {
  try {
    const resp = await fetch(`${base_url}${city}/?key=${api_key}`, {
      mode: "cors",
    });
    const data = await resp.json();

    const weatherData = {
      address: data.resolvedAddress,
      description: data.description,
      days: data.days.map((day) => ({
        datetime: day.datetime,
        conditions: day.conditions,
        description: day.description,
        feelsLike: day.feelslike,
        icon: day.icon,
        tempMax: day.tempmax,
        tempMin: day.tempmin,
        temp: Math.round(day.temp),
        windspeed: day.windspeed,
        humidity: day.humidity,
        precipprob: day.precipprob,
        uvindex: day.uvindex,
        sunrise: day.sunrise,
        sunset: day.sunset,
        hours: day.hours,
      })),
      currentConditions: {
        conditions: data.currentConditions.conditions, // Added this
        cloudCover: data.currentConditions.cloudcover,
        datetime: data.currentConditions.datetime,
        feelsLike: data.currentConditions.feelslike,
        humidity: data.currentConditions.humidity,
        icon: data.currentConditions.icon,
        precip: data.currentConditions.precip,
        precipprob: data.currentConditions.precipprob,
        preciptype: data.currentConditions.preciptype,
        sunrise: data.currentConditions.sunrise, // Fixed typo
        sunset: data.currentConditions.sunset,
        temp: data.currentConditions.temp,
        windspeed: data.currentConditions.windspeed,
        pressure: data.currentConditions.pressure, // You might want this
        visibility: data.currentConditions.visibility, // And this
        uvindex: data.currentConditions.uvindex, // UV index is useful
      },
    };
    appState.setState("cityAddress", weatherData.address);
    appState.setState("daysData", weatherData.days);
    return weatherData;
  } catch (error) {
    console.error(error);
  }
}

async function getWeatherDataByLatLong(appState) {
  try {
    const location = await getCurrentLocation();

    const resp = await fetch(
      `${base_url}${location.latitude},${location.longitude}/?key=${api_key}`,
      {
        mode: "cors",
      },
    );
    const data = await resp.json();
    const weatherData = {
      address: data.resolvedAddress,
      description: data.description,
      days: data.days.map((day) => ({
        datetime: day.datetime,
        conditions: day.conditions,
        description: day.description,
        feelsLike: day.feelslike,
        icon: day.icon,
        tempMax: day.tempmax,
        tempMin: day.tempmin,
        temp: Math.round(day.temp),
        windspeed: day.windspeed,
        humidity: day.humidity,
        precipprob: day.precipprob,
        uvindex: day.uvindex,
        sunrise: day.sunrise,
        sunset: day.sunset,
        hours: day.hours,
      })),
      currentConditions: {
        conditions: data.currentConditions.conditions, // Added this
        cloudCover: data.currentConditions.cloudcover,
        datetime: data.currentConditions.datetime,
        feelsLike: data.currentConditions.feelslike,
        humidity: data.currentConditions.humidity,
        icon: data.currentConditions.icon,
        precip: data.currentConditions.precip,
        precipprob: data.currentConditions.precipprob,
        preciptype: data.currentConditions.preciptype,
        sunrise: data.currentConditions.sunrise, // Fixed typo
        sunset: data.currentConditions.sunset,
        temp: data.currentConditions.temp,
        windspeed: data.currentConditions.windspeed,
        pressure: data.currentConditions.pressure, // You might want this
        visibility: data.currentConditions.visibility, // And this
        uvindex: data.currentConditions.uvindex, // UV index is useful
      },
    };
    appState.setState("cityAddress", weatherData.address);
    appState.setState("daysData", weatherData.days);
    return weatherData;
  } catch (error) {
    console.error(error);
  }
}

export { getWeatherData, getWeatherDataByLatLong };
