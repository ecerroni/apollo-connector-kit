import sift from 'sift';
import keyBy from 'lodash.keyby';

export const dataloader = ({ ids, Model }) => Model.find({ _id: { $in: ids } }).then((items) => {
  const itemsById = keyBy(items, '_id');
  return ids.map(itemId => itemsById[itemId]);
});

export const dataQuery = ({ queries, Model, findOne = false }) => Model.find({ $or: queries })
  .then(items => queries.map((query) => {
    const arr = sift(query, items);
    if (findOne) {
      if (Array.isArray(arr) && arr.length > 0) return arr[0];
      return null;
    }
    return arr;
  }));
