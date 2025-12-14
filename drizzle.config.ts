import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

if (!process.env.DB_URL) {
  throw new Error('DATABASE URL ENV IS REQUIRED');
}
export default defineConfig({
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DB_URL,
  },
  out: './drizzle',
  schema: './src/database/schema.ts',
});
