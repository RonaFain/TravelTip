import { storageService } from './storage.service.js';
import { api } from '../../api.js';

export const locService = {
  getLocs,
  getGeoCode,
  removeLoc,
};

const STORAGE_KEY = 'locsDB';
const gLocs = storageService.load(STORAGE_KEY) || [];

// const locs = [
//   { name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
//   { name: 'Neveragain', lat: 32.047201, lng: 34.832581 },
// ];

function getLocs() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(gLocs);
    }, 2000);
  });
}

function getGeoCode(value) {
  const API_KEY = api.APIKEY;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${value}&key=${API_KEY}`;
  return axios.get(url).then((res) => {
    const newLoc = {
      id: res.data.results[0].place_id,
      name: res.data.results[0].address_components[0].short_name,
      lat: res.data.results[0].geometry.location.lat,
      lng: res.data.results[0].geometry.location.lng,
      weather: 'weather',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    gLocs.push(newLoc);
    storageService.save(STORAGE_KEY, gLocs);
    return newLoc;
  });
}

function removeLoc(locId) {
  const locIdx = gLocs.findIndex((loc) => loc.id === locId);
  gLocs.splice(locIdx, 1);
  storageService.save(STORAGE_KEY, gLocs);
}
