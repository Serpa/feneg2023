const nodemailer = require("nodemailer");

export default async (req, res) => {
    const { firstName, lastName, email, message } = req.body

    const transporter = nodemailer.createTransport({
        port: 465,
        host: "smtp.gmail.com",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASS,
        },
        secure: true,
    });

    const mailData = {
        from: {
            name: `${firstName} ${lastName}`,
            address: "feneg2023@gmail.com",
        },
        to: email,
        subject: `Recuperar Senha - FENEG 2023`,
        text: message,
        html: `${message}`,
    };

    try {
        await new Promise((resolve, reject) => {
            // verify connection configuration
            transporter.verify(function (error, success) {
                if (error) {
                    console.log(error);
                    reject(error);
                } else {
                    console.log("Server is ready to take our messages");
                    resolve(success);
                }
            });
        });

        await new Promise((resolve, reject) => {
            // send mail
            transporter.sendMail(mailData, (err, info) => {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    console.log(info);
                    resolve(info);
                }
            });
        });

        res.status(200).json({ status: "OK" });
    } catch (error) {
        res.status(400).json({ status: "ERROR", msg: error });
    }
};