// import { MongoDataSource } from 'apollo-datasource-mongo';
// import professions from './_schema';

// export default class extends MongoDataSource {
//   constructor() {
//     super();
//     this.collections = [professions];
//     this.mongoose = true;
//     this.debug = true;
//   }

//   getProfession(professionId) {
//     return professions.findOneById(professionId);
//   }

//   async getProfessions(professionsIds) {
//     // await professions.deleteFromCacheById({ branchSourceId: 4 });
//     await professions.flushCollectionCache();
//     return professions.findManyByIds(professionsIds, { ttl: 60 });
//   }
//   async getProfessionsByQuery(query) {
//     // await professions.deleteFromCacheById({ branchSourceId: 4 });
//     // await professions.flushCollectionCache();
//     return professions.findManyByQuery(query, { ttl: 3 });
//   }
// }
