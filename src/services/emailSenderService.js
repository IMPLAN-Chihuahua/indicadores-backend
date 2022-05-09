const nodemailer = require('nodemailer');
const fs = require("fs");
const templateHtml = fs.readFileSync("./src/templates/email.html", "utf8");
const handlebars = require('handlebars');

const sendEmail = async (user, text) => {
    const recoverURL = `http://localhost:3500/recuperacion-de-cuenta/${text}`;
    const nombres = user.nombres;
    const todaysDate = new Date().getFullYear();
    const template = handlebars.compile(templateHtml);
    const html = template({ nombres, recoverURL, todaysDate, allowProtoPropertiesByDefault: true });
    const plainText = `¿No puede visualizar el contenido? Visite el siguiente hipervinculo para reiniciar la contraseña: ${recoverURL}`;
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
        to: user.correo,
        subject: 'Password Recovery',
        text: plainText,
        html: html,
        attachments: [{
            filename: 'logo.jpg',
            path: './src/templates/logo.jpg',
            cid: 'cid:logo',
        }],
        date: new Date(),
    });

    return info ? true : false;
};

module.exports = {
    sendEmail,
};
