import { locService } from './services/loc.service.js';
import { mapService } from './services/map.service.js';

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onGoToLoc = onGoToLoc;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;
window.onShowLoc = onShowLoc;
window.onRemoveLoc = onRemoveLoc;
window.onCopyQueryString = onCopyQueryString;

function onInit() {
  mapService
    .initMap()
    .then(() => {
      console.log('Map is ready');
    })
    .catch(() => console.log('Error: cannot init map'));
  onGetLocs();
  mapService.getWeather(32.0749831, 34.9120554).then(renderWeather);
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

function onAddMarker(lat, lng) {
  console.log('Adding a marker');
  mapService.addMarker({ lat, lng });
}

function onGetLocs() {
  locService.getLocs().then(renderLocTable);
}

function onGetUserPos() {
  getPosition()
    .then((pos) => {
      let userPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      mapService.initMap(userPos.lat, userPos.lng);
    })
    .catch((err) => {
      console.log('err!!!', err);
    });
}

function onGoToLoc(ev) {
  ev.preventDefault();
  const elInput = document.querySelector('input[name="loc"]');
  const inputValue = elInput.value;
  locService.getGeoCode(inputValue).then(mapService.panTo);
  onGetLocs();
}

function renderLocTable(locs) {
  var strHtmls = locs
    .map((loc) => {
      return `<tr>
              <td>${loc.id}</td>
              <td>${loc.name}</td>
              <td>${loc.lat}</td>
              <td>${loc.lng}</td>
              <td>${loc.weather}</td>
              <td>${loc.createdAt}</td>
              <td>${loc.updatedAt}</td>
              <td><button onclick="onShowLoc('${loc.lat}' , '${loc.lng}')">Go</button></td>
              <td><button onclick="onRemoveLoc('${loc.id}')">Delete</button></td>
            </tr>`;
    })
    .join('');

  document.querySelector('tbody').innerHTML = strHtmls;
}

function onShowLoc(lat, lng) {
  mapService.moveToMap({ lat: +lat, lng: +lng });
  onGetLocs();
}

function onRemoveLoc(locId) {
  locService.removeLoc(locId);
  mapService.initMap();
  onGetLocs();
}

function renderWeather(weather) {
  console.log('weather', weather);
  const strHtml = `
      <p>Temp:<span>${weather.temp}</span></p>
      <p>Wind:<span>${weather.wind}</span></p>
  `;
  document.querySelector('.weather-container').innerHTML = strHtml;
}

function onCopyQueryString() {
  const lastPos = mapService.getLastLoc();
  console.log('the last pos', lastPos);

  navigator.clipboard.writeText(
    `https://ronafain.github.io/TravelTip/index.html?lat=${lastPos.lat}&lng=${lastPos.lng}`
  );
}
