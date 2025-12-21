import {mailProvider} from '../infra/mail.ts'

export async function sendEmail(email:string,userName:string) {

  await mailProvider.sendMail({
    from: '"Teste Backend" <rhyanlindorp@gmail.com>',
    to: email,
    subject: 'Welcome Back!',
    html: `<h1>Bem-vindo${userName ? `, ${userName}` : ''}!</h1><p>Bom te ver por aqui.</p>`,
  })


  
}