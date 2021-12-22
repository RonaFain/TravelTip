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
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

function onAddMarker() {
  console.log('Adding a marker');
  mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 });
}

function onGetLocs() {
  locService.getLocs().then(renderLocTable)
};


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
  locService.getGeoCode(inputValue).then(mapService.panTo)
  // mapService.panTo(35.6895, 139.6917);
  onGetLocs()
}




function renderLocTable(locs) {
  console.log('the locs', locs)
  var strHtmls = locs.map((loc) => {
    return `<tr><td>${loc.id}</td><td>${loc.name}</td><td>${loc.lat}</td>
    <td>${loc.lng}</td><td>${loc.weather}</td><td>${loc.createdAt}</td><td>${loc.updatedAt}</td></tr>`
  }).join('')

  document.querySelector('tbody').innerHTML = strHtmls

}
