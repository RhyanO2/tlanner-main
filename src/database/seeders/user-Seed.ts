import {db} from '../index.ts';
import {Users} from '../schema.ts';
import {fakerPT_BR as f} from '@faker-js/faker';
import {hash} from 'argon2';

 
export default  {
   createUser: async()=>{ 
    const userName = f.person.firstName()
    const userInsert = await db.insert(Users).values([
      {
        name: userName,
        email: f.internet.email(),
        password: await hash('1234')
      },
  ]).returning()
  return userInsert
}
}