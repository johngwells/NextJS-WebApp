import { table } from '../lib/airtable';

const accessRecords = records => {
  return records.map(record => {
    return {
      recordId: record.id,
      ...record.fields
    };
  });
};

const createCoffeeStore = async (req, res) => {
  if (req.method === 'POST') {
    const { id, name, address, neighborhood, imgUrl, voting } = req.body;

    try {
      if (id) {
        // find a record
        const findCoffeeStoreRecords = await table
          .select({
            filterByFormula: `id="${id}"`
          })
          .firstPage();

        // no need for findCoffee.length !== 0
        // since 0 is a falsy value, you just check .length
        if (findCoffeeStoreRecords.length) {
          const records = accessRecords(findCoffeeStoreRecords);
          console.log(records);
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
                  neighborhood,
                  voting,
                  imgUrl
                }
              }
            ], {typecast: true});
            
            const record = accessRecords(createRecord);
            console.log(record);
            res.json({ message: 'created a record', record: record });
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
