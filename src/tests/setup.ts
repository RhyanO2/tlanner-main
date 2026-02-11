
import { beforeAll } from 'vitest';
import { cleanTestDatabase } from './helpers/db.helper';

beforeAll(async () => {
  await cleanTestDatabase(); 
});
