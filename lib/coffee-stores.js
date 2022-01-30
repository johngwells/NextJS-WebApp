// initialize unsplash
import { createApi } from 'unsplash-js';

const unsplashApi = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY
});

const query = 'coffee';

const getUrlForCoffeeStores = (latLong, query, limit) => {
  return `https://api.foursquare.com/v3/places/nearby?ll=${latLong}&query=${query}&limit=${limit}`;
};

const getListOfCoffeeStorePhotos = async () => {
  const photos = await unsplashApi.search.getPhotos({
    query: 'coffee shop',
    perPage: 10
  });
  const unsplashResults = photos.response.results;
  const photoResponse = unsplashResults.map(result => result.urls['small']);

  return photoResponse;
};

export const fetchCoffeeStores = async (
  latLong = '37.773972,-122.431297',
  limit = 6
) => {
  const photos = await getListOfCoffeeStorePhotos();
  const response = await fetch(getUrlForCoffeeStores(latLong, query, limit), {
    headers: {
      authorization: process.env.NEXT_PUBLIC_API_KEY
    }
  });
  const data = await response.json();

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
