const nodemailer = require('nodemailer');

const sendEmail = async (email, text) => {
    const recoverURL = `http://localhost:8080/api/v1/auth/password-reset/${text}`;
    //TODO: REPLACE WITH PERSONAL EMAIL ACCOUNT
    //TODO: REPLACE WITH PERSONAL SMTP SERVER
    let transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'stephanie.kertzmann87@ethereal.email', // generated ethereal user
            pass: 'xwAbZtaWTw3rMeNxn7', // generated ethereal password
        },
    });

    let info = await transporter.sendMail({
        from: '"John Doe 👻"',
        to: email,
        subject: 'Password Recovery',
        text: 'boop',
        html: `<a href="${recoverURL}">Password recover</a>`,
    });

    return info ? true : false;
};

module.exports = {
    sendEmail,
};
