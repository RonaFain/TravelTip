import { locService } from './services/loc.service.js';
import { mapService } from './services/map.service.js';

window.onload = onInit;
window.onAddMarker = onAddMarker;
window.onGoToLoc = onGoToLoc;
window.onGetLocs = onGetLocs;
window.onGetUserPos = onGetUserPos;

function onInit() {
  mapService
    .initMap()
    .then(() => {
      console.log('Map is ready');
    })
    .catch(() => console.log('Error: cannot init map'));
  // console.log('hello')
  renderLocTable()
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
  console.log('Getting Pos');
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

function onAddMarker() {
  console.log('Adding a marker');
  mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
}

function onGetLocs() {
  locService.getLocs().then((locs) => {
    console.log('Locations:', locs);
    document.querySelector('.locs').innerText = JSON.stringify(locs);
  });
}

function onGetUserPos() {
  getPosition()
    .then((pos) => {
      console.log('User position is:', pos.coords);
      document.querySelector(
        '.user-pos'
      ).innerText = `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`;
    })
    .catch((err) => {
      console.log('err!!!', err);
    });
}
function onGoToLoc(ev) {
  console.log(ev);
  ev.preventDefault();
  const elInput = document.querySelector('input[name="loc"]');
  const inputValue = elInput.value;
  locService.getGeoCode(inputValue).then(mapService.panTo);
 
}









function renderLocTable() {
  const locs = locService.getLocs()
  var strHtmls = locations.map((loc) => {
    return `<tr><td>${loc.id}</td><td>${loc.name}</td><td>${loc.lat}</td>
    <td>${loc.lng}</td><td>${loc.weather}</td><td>${loc.createdAt}</td><td>${loc.updatedAt}</td></tr>`
  }).join('')

  document.querySelector('tbody').innerHTML=renderLocTable()

}