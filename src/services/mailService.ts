import {mailProvider} from '../infra/mail.ts'

export async function sendEmail(email:string,userName:string) {

  await mailProvider.sendMail({
    from: '"Mail sender test" <rhyanlindorp@gmail.com>',
    to: email,
    subject: 'Welcome Back!',
    html: `<h1>Welcome Back!${userName ? `, ${userName}` : ''}! Good to see you again.</p>`,
  })


  
}