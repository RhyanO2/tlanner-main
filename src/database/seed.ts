import userSeed from './seeders/user-Seed.js';
import taskSeed from './seeders/task-Seed.js';
import workspaceSeed from './seeders/workspace-Seed.js';

async function seed() {
  const createdUser = await userSeed.createUser();
  const userID = createdUser[0].id;

  const workspace = await workspaceSeed.createWorkspace(userID);
  const workspaceID = workspace[0].id;

  await taskSeed.createTask(workspaceID);

  // await taskSeed.createTask(userid);
}

seed();
