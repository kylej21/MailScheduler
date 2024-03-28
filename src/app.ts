// config my .env
require("dotenv").config();

/* eslint @typescript-eslint/no-var-requires: "off" */
// above line disables an EsLint feature requiring an import statement. Since these are node modules, no need to import.
const cron = require("node-cron");
const nodemailer = require("nodemailer");

//abstracting the process.env from other developers to simplify code
const userEmail = process.env.GMAIL_USER;
const userPass = process.env.GMAIL_PASS;
const targetEmail = process.env.GMAIL_TARGET;

// processing the input Gmail, to weed out bugs before the bulk of the code.
if (!isValid(userEmail)) {
  throw "invalid email for sender";
}
if (!isValid(targetEmail)) {
  throw "invalid recipient email";
}

// asteriks * * * * * represent seconds, minutes, hours, ... etc. This schedule is at 10 am everyday. It calls sendMail function
cron.schedule("0 0 10 * * *", sendMail, {
  // This program was written for east coast users. If you want the program to run a certain timezone change below.
  //Deleting this parameter defaults to your computers time zone.
  timezone: "America/New_York",
});

// processes the email to check for validity. Uses helper function isValidChar below.
function isValid(email: string) {
  const letters = email.split("");

  const allowedLetters = letters.filter((letter) => isValidChar(letter));

  // this conditional implies a letter was filtered out therefore invalid;
  if (allowedLetters.length != letters.length) {
    return false;
  }

  // Special characters @ and . cannot begin an email adress or end one
  if (
    allowedLetters[0] == "@" ||
    allowedLetters[0] == "." ||
    allowedLetters[allowedLetters.length - 1] == "." ||
    allowedLetters[allowedLetters.length - 1] == "@"
  ) {
    return false;
  }
  // emails can only have one @
  if (letters.filter((letter) => letter == "@").length != 1) {
    return false;
  }

  // at this point the email is most likely valid. Nodemailer will return error if not, but this will weed out most.
  return true;
}

// valid chars for an email according to https://en.wikipedia.org/wiki/Email_address syntax section
function isValidChar(letter: string) {
  // valid digits
  if (letter >= "0" && letter <= "9") {
    return true;
  }

  // lowercase letters
  if (letter >= "a" && letter <= "z") {
    return true;
  }

  //uppercase letters
  if (letter >= "A" && letter <= "Z") {
    return true;
  }

  // valid special characters
  if ("!#$%&'*+-/=?^_`{|}~.(),:;<>@[\\] ".indexOf(letter) > -1) {
    return true;
  }

  // if true has not been returned, can assume the letter is invalid therefore false;
  return false;
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
