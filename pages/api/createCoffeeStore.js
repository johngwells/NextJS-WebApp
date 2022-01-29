import { table, accessRecords, findRecordByFilter } from '../lib/airtable';

const createCoffeeStore = async (req, res) => {
  if (req.method === 'POST') {
    const { id, name, address, neighborhood, imgUrl, voting } = req.body;

    try {
      if (id) {
        // find a record
        const records = await findRecordByFilter(id);
        if (records.length) {
          res.json({ message: 'record is already stored', records });
        } else {
          // create a record
          if (name) {
            const createRecord = await table.create([
              {
                fields: {
                  id,
                  name,
                  address,
                  neighborhood: neighborhood.toString() || '',
                  voting,
                  imgUrl
                }
              }
            ], {typecast: true});
            
            const record = accessRecords(createRecord);
            console.log(record);
            res.json(record);
          } else {
            res.status(400);
            res.json({ message: 'name is missing' });
          }
        }
      } else {
        res.status(400);
        res.json({ message: 'id is missing' });
      }
    } catch (err) {
      console.error('Error creating or finding store', err);
      res.status(500);
      res.json({ message: 'Error creating or finding store', err });
    }
  }
};

export default createCoffeeStore;
