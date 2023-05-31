const nodemailer = require('nodemailer');
const { oauth2Client } = require('./oauth2');

const {
  GOOGLE_REFRESH_TOKEN,
  GOOGLE_SENDER_EMAIL,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET
} = process.env;

// set credential
oauth2Client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });

module.exports = {
  sendEmail: (to, subject, data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const accessToken = await oauth2Client.getAccessToken();

        const transport = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            type: 'OAuth2',
            user: GOOGLE_SENDER_EMAIL,
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            refreshToken: GOOGLE_REFRESH_TOKEN,
            accessToken: accessToken
          }
        });

        const response = await transport.sendMail({ to, subject, html });

        return resolve(response);
      } catch (err) {
        reject(err);
      }
    });
  }
};