import { Tasks } from '../database/schema.ts';
import { db } from '../database/index.ts';
import { eq } from 'drizzle-orm';
import { taskSelectByUser,taskSelectById,taskInsert,taskUpdate,taskDelete } from '../models/taskModel.ts'

export async function tasksGet(userId: string) {
  
  return taskSelectByUser(userId)

}


export async function taskCreate(title: string,description: string,date: Date,userId: string) {

  const realDate = new Date(date)

  const createTask = taskInsert(title,description,realDate,userId)

  return createTask
  
}

export async function taskEdit(title:string,description:string,status:'pending' | 'in_progress' | 'done',due_date:string,taskId:string) {

  const task = taskSelectById(taskId)

  if(!task){
    throw new Error('task cannot be find')
  }

  const realDate = new Date(due_date)
  
  return taskUpdate(title,description,status,realDate,taskId)

  
}

export async function taskRemove(taskId:string) {

  const task = taskSelectById(taskId)

  if(!task){
    throw new Error('task cannot be find')
  }

  return taskDelete(taskId)
  
}