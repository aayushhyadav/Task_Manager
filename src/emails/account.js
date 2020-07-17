const sgMail = require('@sendgrid/mail')

const SendGridAPIKey = process.env.SENDGRID_API_KEY
sgMail.setApiKey(SendGridAPIKey)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'aayushmum@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the Task Manager App ${name}. I hope you have a great experience!`
    })
}

const sendGoodbyeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'aayushmum@gmail.com',
        subject: `See you soon ${name}!`,
        text: `Hope you had a nice experience!`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendGoodbyeEmail
}