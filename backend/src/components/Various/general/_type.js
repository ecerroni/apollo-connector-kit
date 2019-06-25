// export const types = `
//   type Profession {
//     _id: ID!
//     name: String
//     branchSourceId: Int
//     sourceId: Int
//   }

//   type Branch {
//     _id: ID!
//     name: String
//     sourceId: Int
//     professions: [Profession]
//   }
// `;
export const types = '';

export const typeResolvers = {
  //
  // Branch: {
  //   professions: async ({ sourceId, professions: professionsIds }, __, { dataSources: { dbProfessions: professions } }) =>
  // professions.getProfessions(professionsIds),
  // },
};
