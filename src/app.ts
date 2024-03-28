// config my .env
require("dotenv").config();

// importing required modules
import * as validator from 'email-validator';
import * as cron from 'node-cron';

// nodemailer is a CommonJs Module so require instead of import is necessary when using TypeScript
const nodemailer = require("nodemailer");

//abstracting the process.env from other developers to simplify code
const userEmail = process.env.GMAIL_USER;
const userPass = process.env.GMAIL_PASS;
const targetEmail = process.env.GMAIL_TARGET;

// processing the input Gmail, to weed out bugs before the bulk of the code.
if (!isValidEmail(userEmail)) {
  throw "invalid email for sender";
}
if (!isValidEmail(targetEmail)) {
  throw "invalid recipient email";
}

// asteriks * * * * * represent seconds, minutes, hours, ... etc. This schedule is at 10 am everyday. It calls sendMail function
cron.schedule("0 0 10 * * *", sendMail, {
  // This program was written for east coast users. If you want the program to run a certain timezone change below.
  //Deleting this parameter defaults to your computers time zone.
  timezone: "America/New_York",
});

// calls npm email-validator module to ensure it is formatically correct
function isValidEmail(email: string) {
  return validator.validate(email);
}
// sendMail is defined async since mailing seems to require waiting for a response.
async function sendMail() {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: userEmail,
      pass: userPass,
      tls: { rejectUnauthorized: false }, // needed due to gmail special rules for some accounts,
    },
  });
  try {
    // Send mail with defined email account defined above as transporter
    const info = await transporter.sendMail({
      from: `Kyle Johnson <${userEmail}>`,
      to: targetEmail, // change target email on this line
      subject: "Daily reminder to walk Bear",
      text: "Its 10 AM, so its time to go walk Bear 🐶.",
    });

    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error occurred while sending email:", error);
  }
}
