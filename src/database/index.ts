import { neon } from '@neondatabase/serverless';
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';

if (!process.env.NEON_URL) {
  throw new Error('A variável NEON_URL não foi definida no .env');
}

const client = neon(process.env.NEON_URL);

// 2. Instanciação correta
export const db = drizzle(client, {
  logger: process.env.NODE_ENV === 'development',
});
