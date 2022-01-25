const latlong = '36.105980,-115.213110';
const query = 'coffee';
const limit = 6;

const getUrlForCoffeeStores = (latlong, query, limit) => {
  return `https://api.foursquare.com/v3/places/nearby?ll=${latlong}&query=
  ${query}&limit=${limit}`;
};

export const fetchCoffeeStores = async () => {
  const response = await fetch(getUrlForCoffeeStores(latlong, query, limit), {
    headers: {
      authorization: process.env.API_KEY
    }
  });
  const data = await response.json();
  console.log(data);

  return (
    data.results?.map((venue, idx) => {
      console.log('venue', venue)
      return {
        id: venue.fsq_id,
        address: venue.location.address || '',
        name: venue.name,
        neighborhood: venue.location.neighborhood || venue.location.crossStreet || '',
      };
    }) || []
  );
};
