// services/weatherIcons.js
const baseUrl = import.meta.env.BASE_URL;

const weatherIcons = {
  // Icons1 set (default)
  "clear-day": {
    src: `${baseUrl}weather_icons/clear-day.svg`,
    alt: "Clear sunny day",
  },
  "clear-night": {
    src: `${baseUrl}weather_icons/clear-night.svg`,
    alt: "Clear night",
  },
  "partly-cloudy-day": {
    src: `${baseUrl}weather_icons/partly-cloudy-day.svg`,
    alt: "Partly cloudy day",
  },
  "partly-cloudy-night": {
    src: `${baseUrl}weather_icons/partly-cloudy-night.svg`,
    alt: "Partly cloudy night",
  },
  "cloudy": {
    src: `${baseUrl}weather_icons/cloudy.svg`,
    alt: "Cloudy",
  },
  "rain": {
    src: `${baseUrl}weather_icons/rain.svg`,
    alt: "Rain",
  },
  "snow": {
    src: `${baseUrl}weather_icons/snow.svg`,
    alt: "Snow",
  },
  "fog": {
    src: `${baseUrl}weather_icons/fog.svg`,
    alt: "Fog",
  },
  "wind": {
    src: `${baseUrl}weather_icons/wind.svg`,
    alt: "Windy",
  },
  // Icons2 set (extended)
  "snow-showers-day": {
    src: `${baseUrl}weather_icons/snow.svg`,
    alt: "Snow showers during day",
  },
  "snow-showers-night": {
    src: `${baseUrl}weather_icons/snow.svg`,
    alt: "Snow showers during night",
  },
  "thunder-rain": {
    src: `${baseUrl}weather_icons/thunder-rain.svg`,
    alt: "Thunderstorms",
  },
  "thunder-showers-day": {
    src: `${baseUrl}weather_icons/thunder-showers-day.svg`,
    alt: "Possible thunderstorms during day",
  },
  "thunder-showers-night": {
    src: `${baseUrl}weather_icons/thunder-showers-night.svg`,
    alt: "Possible thunderstorms during night",
  },
  "showers-day": {
    src: `${baseUrl}weather_icons/showers-day.svg`,
    alt: "Rain showers during day",
  },
  "showers-night": {
    src: `${baseUrl}weather_icons/showers-night.svg`,
    alt: "Rain showers during night",
  },
  // Fallback icon
  "unknown": {
    src: `${baseUrl}weather_icons/clear-day.svg`,
    alt: "Unknown weather condition",
  },
};

export { weatherIcons };
