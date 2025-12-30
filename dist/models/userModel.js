import { Users } from '../database/schema.js';
import { db } from '../database/index.js';
import { eq } from 'drizzle-orm';
export async function selectUserByID(userId) {
    const user = await db.select().from(Users).where(eq(Users.id, userId));
    return user;
}
export async function selectUserByEmail(email) {
    const user = await db.select().from(Users).where(eq(Users.email, email));
    return user;
}
export async function insertUser(name, email, password) {
    const insertedUser = await db
        .insert(Users)
        .values({
        name: name,
        email: email,
        password: password,
    })
        .returning();
    return insertedUser[0];
}
