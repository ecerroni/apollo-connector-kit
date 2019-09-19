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

//   type Job {
//     _id: ID!
//     profession: Profession
//   }
// `;
export const types = '';

export const typeResolvers = {
  // Branch: {
  //   professions: async (
  //     { sourceId, professions: professionsIds },
  //     __,
  //     { dataSources: { Profession } }
  //   ) => Profession.getProfessions(professionsIds)
  // },
  // Job: {
  //   profession: async (
  //     { _id, profession: professionId },
  //     __,
  //     { dataSources: { Profession } }
  //   ) => {
  //     return Profession.getProfession(professionId);
  //   }
  // }
};
