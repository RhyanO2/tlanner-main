import userSeed from './seeders/user-Seed.ts';
import taskSeed from './seeders/task-Seed.ts';
import workspaceSeed from './seeders/workspace-Seed.ts';

async function seed() {
  const createdUser = await userSeed.createUser();
  const userID = createdUser[0].id;

  const workspace = await workspaceSeed.createWorkspace(userID);
  const workspaceID = workspace[0].id;

  await taskSeed.createTask(workspaceID);

  // await taskSeed.createTask(userid);
}

seed();
