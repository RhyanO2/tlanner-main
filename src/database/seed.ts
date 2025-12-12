import userSeed from './seeders/user-Seed.ts'
import taskSeed from './seeders/task-Seed.ts'


async function seed() {

  const createdUser = await userSeed.createUser();
  const userid = createdUser[0].id


 const insertTask = await taskSeed.createTask(userid)

}

seed()