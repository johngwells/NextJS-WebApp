const Airtable = require('airtable');
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_KEY
);

const table = base('coffee-stores');

// console.log(table);

const createCoffeeStore = async (req, res) => {
  if (req.method === 'POST') {
    const { id, name, neighborhood, address, imgUrl, voting } = req.body;

    try {
      // find a record
      const findCoffeeStoreRecords = await table
        .select({
          filterByFormula: `id=${id}`
        })
        .firstPage();

      // no need for findCoffee.length !== 0
      // since 0 is a falsy value, you just check .length
      if (findCoffeeStoreRecords.length) {
        const records = findCoffeeStoreRecords.map(record => {
          return {
            ...record.fields
          };
        });
        res.json({ message: 'record is already stored', records });
      } else {
        // create a record
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
        ]);
        const record = createRecord.map(record => {
          return {
            ...record.fields
          };
        });
        res.json({ message: 'created a record', record: record });
      }
    } catch (err) {
      console.error('Error finding store', err);
      res.status(500);
      res.json({ message: 'Error finding store', err });
    }
  }
};

export default createCoffeeStore;
