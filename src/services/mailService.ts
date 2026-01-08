import { mailProvider } from '../infra/mail.js';

export async function sendRegisterEmail(email: string, userName: string) {
  await mailProvider.sendMail({
    from: '"Tlanner" <hello@tlanner.com.br>',
    to: email,
    subject: 'Welcome Back!',
    html: `<h1>Welcome${userName ? `, ${userName}` : ''}
  <body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background-color:#f7f7f7;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7f7f7;padding:20px;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;padding:32px;">
            <tr>
              <td>
                <h2 style="margin:0 0 16px 0;color:#111;">Welcome to Your Smart Task Planner</h2>

                <p style="margin:0 0 16px 0;color:#444;line-height:1.5;">
                  A system designed to boost your <strong>productivity, control, and focus</strong>.
                  Organize tasks effortlessly, stay consistent with the Pomodoro technique,
                  and manage your work more efficiently across different contexts.
                </p>

                <ul style="padding-left:20px;margin:0 0 20px 0;color:#444;">
                  <li>📋 Complete task organization</li>
                  <li>⏱️ Built-in Pomodoro for deep focus</li>
                  <li>🗂️ Workspaces to separate projects</li>
                  <li>👀 Viewlists to see tasks your way</li>
                </ul>

                <p style="margin:0;color:#444;line-height:1.5;">
                  Fewer distractions. More clarity. Better results.
                </p>
                <p style="margin:0;color:#444;line-height:1.5;">
                  Tlanner
                </p>
                
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`,
  });
}

export async function sendLoginEmail(email: string, userName: string) {
  await mailProvider.sendMail({
    from: '"Tlanner"  <hello@tlanner.com.br>',
    to: email,
    subject: 'Welcome Back!',
    html: `<h1>Welcome Back${
      userName ? `, ${userName}` : ''
    }!</h1><p>Good to see you again.</p>`,
  });
}
