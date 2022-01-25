// initialize unsplash
import { createApi } from 'unsplash-js';

const unsplashApi = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY
});

const latlong = '36.105980,-115.213110';
const query = 'coffee';
const limit = 6;

const getUrlForCoffeeStores = (latlong, query, limit) => {
  return `https://api.foursquare.com/v3/places/nearby?ll=${latlong}&query=
  ${query}&limit=${limit}`;
};

const getListOfCoffeeStorePhotos = async () => {
  const photos = await unsplashApi.search.getPhotos({
    query: 'coffee shop',
    perPage: 10,
  });
  const unsplashResults = photos.response.results;
  const photoResponse = unsplashResults.map(result => result.urls['small']);

  return photoResponse;
};

export const fetchCoffeeStores = async () => {
  const photos = await getListOfCoffeeStorePhotos();
  const response = await fetch(getUrlForCoffeeStores(latlong, query, limit), {
    headers: {
      authorization: process.env.API_KEY
    }
  });
  const data = await response.json();
  console.log(data);

  return (
    data.results?.map((venue, idx) => {
      return {
        id: venue.fsq_id,
        address: venue.location.address || '',
        name: venue.name,
        neighborhood: venue.location.neighborhood || venue.location.crossStreet || '',
        imgUrl: photos[idx]
      };
    }) || []
  );
};
