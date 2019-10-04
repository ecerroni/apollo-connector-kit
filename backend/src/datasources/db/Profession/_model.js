// import { MongoDataSource } from 'apollo-datasource-mongo';

// export default class extends MongoDataSource {
//   initialize(config) {
//     super.initialize({
//       ...config,
//       debug: true
//       // allowFlushingCollectionCache: true
//     });
//   }
//   async getProfession(professionId) {
//     return this.Profession.loadOneById(professionId, { ttl: 60 });
//   }

//   async getProfessions(professionsIds) {
//     // await this.Profession.deleteFromCacheById({ branchSourceId: 4 });
//     // await this.Profession.flushCollectionCache();
//     return this.Profession.loadManyByIds(professionsIds, { ttl: 30 });
//   }
//   async getProfessionsByQuery(query) {
//     // await this.Profession.deleteFromCacheById({ branchSourceId: 4 });
//     // await this.Profession.flushCollectionCache();
//     return this.Profession.loadManyByQuery(query, { ttl: 3 });
//   }
// }
