import { api } from '../../api.js';
import { locService } from './loc.service.js';

export const mapService = {
  initMap,
  addMarker,
  panTo,
  moveToMap,
  getWeather,
  getLastLoc,
};

let gMap;
let gLastLoc;

function initMap(lat = 32.0749831, lng = 34.9120554) {
  const urlParams = new URLSearchParams(window.location.search);
  const urlLat = urlParams.get('lat');
  const urlLng = urlParams.get('lng');
  if (urlLat && urlLng) {
    lat = +urlLat;
    lng = +urlLng;
  }
  return _connectGoogleApi().then(() => {
    gMap = new google.maps.Map(document.querySelector('#map'), {
      center: { lat, lng },
      zoom: 15,
    });
    let posToMark = { lat: lat, lng: lng };
    gLastLoc = { lat, lng };
    addMarker(posToMark);
    addLocsToMap();
    const locBtn = document.querySelector('.my-pos-btn');
    gMap.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(locBtn);
    google.maps.event.addListener(gMap, 'click', function (event) {
      addMarker(event.latLng);
    });
  });
}

function addMarker(loc) {
  var marker = new google.maps.Marker({
    position: loc,
    map: gMap,
    title: 'Hello World!',
  });
  return marker;
}

function addLocsToMap() {
  locService.getLocs().then((locs) => {
    locs.forEach((loc) => {
      addMarker({ lat: loc.lat, lng: loc.lng });
    });
  });
}

function panTo(loc) {
  const laLatLng = new google.maps.LatLng(loc.lat, loc.lng);
  addMarker(loc);
  gLastLoc = { lat: loc.lat, lng: loc.lng };
  gMap.panTo(laLatLng);
}

function _connectGoogleApi() {
  if (window.google) return Promise.resolve();
  const API_KEY = api.APIKEY;
  var elGoogleApi = document.createElement('script');
  elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`;
  elGoogleApi.async = true;
  document.body.append(elGoogleApi);

  return new Promise((resolve, reject) => {
    elGoogleApi.onload = resolve;
    elGoogleApi.onerror = () => reject('Google script failed to load');
  });
}

function getLastLoc() {
  return gLastLoc;
}

function moveToMap(loc) {
  gMap.setCenter({ lat: +loc.lat, lng: +loc.lng });
}

function getWeather(lat, lang) {
  const W_KEY = api.WEATHERKEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lang}&appid=${api.WEATHERKEY}`;
  return axios.get(url).then((res) => {
    const weather = {
      temp: (res.data.main.temp - 273).toFixed(2),
      wind: res.data.wind.speed + ' 🌀 ',
    };
    return weather;
  });
}
