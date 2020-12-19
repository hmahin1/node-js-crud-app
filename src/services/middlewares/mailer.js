const nodemailer = require('nodemailer');

export const sendMail = async (emailObj) => {

    try {
    let mailTransporter = nodemailer.createTransport({ 
        service: 'gmail', 
        auth: { 
            user: 'abcd@gmail.com', // your email address from the email which will be send
            pass: 'abcd' // your password
        }, 
        tls: {
            rejectUnauthorized: false
        } 
    }); 
    await mailTransporter.sendMail(emailObj, function(err, data) { 
        if(err) { 
            console.log(err)
            return console.log('Error Occurs'); 
        } else { 
            return console.log('Email sent successfully'); 
        } 
    }); 
    return true;
}
catch (error) {
    console.log('ERROR::while sending email', error);
    throw error;
}}