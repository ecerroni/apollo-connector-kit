// import { MongoDataSource } from 'apollo-datasource-mongo';
// import branches from './_schema';

// export default class extends MongoDataSource {
//   constructor() {
//     super();
//     this.collections = [branches];
//     this.mongoose = true;
//   }

//   getBranch(branchId) {
//     return branches.findOneById(branchId);
//   }

//   getBranches(branchesIds) {
//     return branches.findManyByIds(branchesIds);
//   }
//   getAll() {
//     return branches.find({});
//   }
// }
