// import mongoose from 'mongoose';
// import { MongoDataSource } from 'apollo-datasource-mongo';

// export default class extends MongoDataSource {
//   initialize(config) {
//     super.initialize({
//       ...config,
//       debug: true,
//       mongoose
//     });
//   }
//   getAll(limit) {
//     return limit ? this.Job.find({}).limit(limit) : this.Job.find({});
//   }
// }
