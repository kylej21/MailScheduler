# MailScheduler

This is a node.js application which emails a specified user some content everyday at 10 AM using nodemailer. Built with TS and NodeMailer/Node-cron.
Video demo: https://youtu.be/pqtXNY4NdIg

# Setup

1. Download the source code from this repository. If you don't already have it installed, install node.js from online.
2. Navigate to the root of the folder you just downloaded. Its a folder called MailScheduler.
3. Type this command in the terminal and enter to create the node.js project

```
npm init -y
```

4. In the root folder, create a text file named ".env". Copy the contents below into the .env and fill in with your email info

```
GMAIL_USER=''
GMAIL_PASS=''
GMAIL_TARGET=''
```

5. Install Typescript if you haven't already installed it globally.

```
npm install typescript
```

Notes: This program is only configured for gmail accounts. Also, if you have 2 factor authentication enabled on your email then you will have to set up a third party password due to security reasons. I will leave steps for that at the bottom of the README.

# Running the Application

Once setup is done you can type `npm run start` in the terminal. This is a defined script that compiles the code into JavaScript and runs it.

Note for testing:
Since 10 AM only comes once a day, I would advise testing that the emailing works correctly by tweaking the code to run once every minute.
You can do so easily by chaning line 23 of app.ts from...

```
cron.schedule("0 0 10 * * *", sendMail, {
```

to...

```
cron.schedule("* * * * *", sendMail,{
```

See my video demo above if you need further help

# Design Choices + Explanation

I was instructed to use **nodemailer** for mailing and **node-cron** for scheduling. Aside from this I had freedom of choice.

As for language, I decided to use **TypeScript primarily** for its early error detection. I knew that Nodemailer errors are very vague, so I _wanted to catch as many bugs as possible before runtime_. One could argue TS is overkill for such a small project, but this allows scalability in the future and has few drawbacks besides a little bit more code and complexity than vanilla JavaScript.

For this same reason, I used **ESLint** to catch code _stylistic issues_.

Again, _to avoid cryptic bugs_, I decided to pre-parse the input email adresses' validity to filter out bugs before using the NodeMailer modules.

The last decision I made was to make my mailing function **asynchronus**. I knew that _nodemailer has a system where it awaits the status of the email_, and so it seemed best for it to run on its own.

The rest of the code was pretty straightforward.

# Third Party Password Steps

1. Click on your gmail profile icon and follow -> Manage Your Account -> Security -> 2 Step Verification -> App Passwords (at the bottom)
2. In the box "Create new app specific password", type the name of your app. It does not matter what it is. I used NodemailerPass
3. Copy the generated password and input this in the .env GMAIL_PASS field.

According to Googles security policy online, if App Passwords does not appear in the 2 Step Verification page it is due to your personal security policies.
