import { Branch } from './Branch';
import { Profession } from './Profession';
import { Job } from './Job';

export { UserHelper } from './User';
export const dbSource = db => ({
  Branch: Branch(db),
  Job: Job(db),
  Profession: Profession(db)
});
