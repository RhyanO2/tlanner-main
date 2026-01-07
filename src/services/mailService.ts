import { mailProvider } from '../infra/mail.js';

// export async function sendEmail(email: string, userName: string) {
//   await mailProvider.sendMail({
//     from: '"Mail sender test" <rhyanlindorp@gmail.com>',
//     to: email,
//     subject: 'Welcome Back!',
//     html: `<h1>Welcome Back${
//       userName ? `, ${userName}` : ''
//     }!</h1><p>Good to see you again.</p>`,
//   });
// }
export async function sendEmail(email: string, userName: string) {
  await mailProvider.sendMail({
    from: '"Mail sender test" <hello@tlanner.com.br>',
    to: email,
    subject: 'Welcome Back!',
    html: `<h1>Welcome Back${
      userName ? `, ${userName}` : ''
    }!</h1><p>Good to see you again.</p>`,
  });
}
