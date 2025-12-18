import { Tasks } from '../database/schema.ts';
import { db } from '../database/index.ts';
import { eq } from 'drizzle-orm';
import { taskSelectByUser,taskSelectById,taskInsert,taskUpdate,taskDelete } from '../models/taskModel.ts'
import { AppError } from '../errors/AppError.ts';
import { faker } from '@faker-js/faker';

export async function tasksGet(userId: string) {
  
  return taskSelectByUser(userId)

}


export async function taskCreate(title: string,description: string,due_date: string,userId: string) {
  
  const realDate = new Date(due_date)
  

  if(!description){
    description = title
  }

  const createTask = taskInsert(title,description,realDate,userId)

  return createTask
  
}

export async function taskEdit(title:string,description:string,status:'pending' | 'in_progress' | 'done',due_date:string,taskId:string) {

  const task = await taskSelectById(taskId)

  if(task.length === 0){
    throw new AppError('task cannot be find',401)
  }

  const realDate = new Date(due_date)
  
  return taskUpdate(title,description,status,realDate,taskId)

  
}

export async function taskRemove(taskId:string) {

  const task = await taskSelectById(taskId)


  if(task.length === 0){
    throw new AppError('task cannot be find',401)
  }

  return taskDelete(taskId)
  
}