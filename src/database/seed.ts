import userSeed from './seeders/user-Seed';
import taskSeed from './seeders/task-Seed';
import workspaceSeed from './seeders/workspace-Seed';

async function seed() {
  const createdUser = await userSeed.createUser();
  const userID = createdUser[0].id;

  const workspace = await workspaceSeed.createWorkspace(userID);
  const workspaceID = workspace[0].id;

  await taskSeed.createTask(workspaceID);
}

seed();
