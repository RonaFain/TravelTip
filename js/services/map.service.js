import { api } from '../../api.js';
import { locService } from './services/loc.service.js';

export const mapService = {
  initMap,
  addMarker,
  panTo,
  moveToMap
};

var gMap;

function initMap(lat = 32.0749831, lng = 34.9120554) {
  return _connectGoogleApi().then(() => {
    gMap = new google.maps.Map(document.querySelector('#map'), {
      center: { lat, lng },
      zoom: 15,
    });
    let posToMark = { lat: lat, lng: lng };
    addMarker(posToMark);
    addLocsToMap();
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
  locService.getLocs().then(locs => console.log(locs));
}

function panTo(loc) {
  const laLatLng = new google.maps.LatLng(loc.lat, loc.lng);
  addMarker(loc);
  gMap.panTo(laLatLng);
}

function _connectGoogleApi() {
  if (window.google) return Promise.resolve();
  // const API_KEY = 'AIzaSyDJT_0I2p9RrSIS-V3tvG0XChzgDjkyODA';
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

function moveToMap(loc) {
  gMap.setCenter({lat: loc.lat, lng: loc.lng})
}
