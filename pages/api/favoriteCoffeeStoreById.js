import { table, findRecordByFilter, accessRecords } from '../../lib/airtable';

const favoriteCoffeeStoreById = async (req, res) => {
  if (req.method === 'PUT') {
    try {
      // const { id, voting } = req.body;
      const { id, voting } = req.body;
      console.log({ id, voting })
      if (id) {
        console.log({ id })
        const records = await findRecordByFilter(id);
        if (records.length) {
          const record = records[0];
          const updateRecord = await table.update([
            {
              id: record.recordId,
              fields: {
                voting: record.voting + 1
              }
            }
          ]);
          // update record
          if (updateRecord) {
            const update = accessRecords(updateRecord)
            res.json(update)
          }
        } else {
          res.status(400).json({ message: 'Coffee store with id does not exist'})
        }
      } else {
        res.status(400).json({ message: 'id is missing'})
      }
    } catch (err) {
      console.error('Error updating');
      res.status(500).json({ message: 'Error updating' });
    }
  }
};

export default favoriteCoffeeStoreById;
