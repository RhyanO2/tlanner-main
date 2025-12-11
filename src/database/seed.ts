import {db} from './index.ts';
import {Users, Tasks} from './schema.ts';
import {fakerPT_BR as f} from '@faker-js/faker';
import {hash} from 'argon2';

async function seed() {
  const userName = f.person.firstName().toWellFormed()
  const userInsert = await db.insert(Users).values([
    {
      name: userName,
      email: `${userName}@email.com`,
      password: await hash('1234')
    },
  ]).returning()

  const createdUser = userInsert[0].id
  const taskTitle = f.lorem.words(2)
  
  const taskInsert = await db.insert(Tasks).values([
    {
      title: taskTitle,
      description: `${taskTitle} ${f.lorem.paragraphs()}`,
      status: 'pending',
      due_date: new Date(),
      id_user: createdUser
    },
  ]).returning()

}

seed()