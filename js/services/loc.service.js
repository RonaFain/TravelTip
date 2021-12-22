// import { storageService } from './storage.service.js';
import { api } from '../../api.js';
import{storageService} from './storage.service.js'

export const locService = {
  getLocs,
  getGeoCode,
};

const STORAGE_KEY = 'locDB';

const locs = [
  { name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
  { name: 'Neveragain', lat: 32.047201, lng: 34.832581 },
];

function getLocs() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(locs);
    }, 2000);
  });
}

function getGeoCode(value) {
  //   const API_KEY = 'AIzaSyDJT_0I2p9RrSIS-V3tvG0XChzgDjkyODA';
  const API_KEY = api.APIKEY;
  //   console.log(API_KEY);
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${value}&key=${API_KEY}`;
  console.log(url);
  return axios.get(url).then((res) => ({
    lat: res.data.results[0].geometry.location.lat,
    lng: res.data.results[0].geometry.location.lng,
  }));
}
