export const verifyEmailConfig = {
  EMAIL_SECRET: process.env.EMAIL_SECRET!,
  CLIENT_URL: process.env.CLIENT_URL!,
  emailTransport: {
    service: 'Gmail',
    auth: {
      user: 'myfrige229@gmail.com',
      pass: process.env.EMAIL_PASSWORD!,
    },
  },
  emailFrom: process.env.EMAIL_FROM!,

};

export const recoverPasswordConfig = {
  EMAIL_SECRET: process.env.RECOVER_EMAIL_SECRET!,
  CLIENT_URL: process.env.CLIENT_URL!,
  PASSWORD_RESET_URL: process.env.PASSWORD_RESET_URL!,
  emailTransport: {
    service: 'Gmail',
    auth: {
      user: 'myfrige229@gmail.com',
      pass: process.env.EMAIL_PASSWORD!,
    },
  },
  emailFrom: process.env.EMAIL_FROM!,
}
