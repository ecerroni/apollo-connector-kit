import DataLoader from 'dataloader';
// import { mongoModels } from '../connectors/mongo';
import { dataQuery, dataloader } from './_helpers';

// const {
//   Collection, Partnership,
// } = mongoModels;

let Collection;
let Partnership; // just as example

export default () => ({
  testObject: new DataLoader(ids => dataloader({ ids, Model: Partnership })),
  testCollection: {
    find: new DataLoader(queries => dataQuery({ queries, Model: Collection })),
    findOne: new DataLoader(queries => dataQuery({ queries, Model: Collection, findOne: true })),
  },
});
