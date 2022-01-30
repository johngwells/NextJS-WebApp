import { findRecordByFilter } from '../../lib/airtable';

const getCoffeeStoreById = async (req, res) => {
  const { id } = req.query;

  try {
    if (id) {
      // find a record
      const record = await findRecordByFilter(id);

      // no need for findCoffee.length !== 0
      // since 0 is a falsy value, you just check .length
      if (record.length) {
        res.json(record);
      } else {
        res.status(400).json({ message: 'id could not be found' });
      }
    } else {
      res.status(400).json({ message: 'id is missing' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error });
  }
};

export default getCoffeeStoreById;
