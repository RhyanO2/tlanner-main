export class AppError extends Error {

  public statuscode: number


constructor(message:string,statuscode=400){
  super(message),
  this.statuscode = statuscode
}



}