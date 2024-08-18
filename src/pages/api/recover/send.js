// import prisma from '../../../utils/prismadb'
// const nodemailer = require("nodemailer");
// import { v4 as uuidv4 } from 'uuid';

// export default async function CheckEmail(req, res) {
//     const { email } = req.body
//     const transporter = nodemailer.createTransport({
//         port: 465,
//         host: "smtp.gmail.com",
//         auth: {
//             user: process.env.EMAIL,
//             pass: process.env.EMAIL_PASS,
//         },
//         secure: true,
//     });
//     try {
//         const user = await prisma.User.findUnique({
//             where: {
//                 email
//             }
//         });
//         if (!user) {
//             res.status(404).send()
//         } else {
//             const createLink = await prisma.User.update({
//                 where: {
//                     email
//                 },
//                 data: {
//                     passwordLost: uuidv4()
//                 }
//             })
//             const recoverLink = `${process.env.NEXTAUTH_URL}/recover-password/${createLink.passwordLost}`

//             const html = `
//             <!DOCTYPE html>
// <html lang="pt-br">

// <head>
//   <meta charset="UTF-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <title>Recuperação de Senha</title>
//   <style>
//     body {
//       font-family: Arial, sans-serif;
//       background-color: #f7f7f7;
//       padding: 20px;
//     }
    
//     .container {
//       max-width: 600px;
//       margin: 0 auto;
//       background-color: #ffffff;
//       padding: 40px;
//       border-radius: 4px;
//       box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
//     }
    
//     h1 {
//       text-align: center;
//       color: #333333;
//     }
    
//     p {
//       margin-bottom: 20px;
//       color: #666666;
//     }
    
//     .btn {
//       display: inline-block;
//       background-color: #4CAF50;
//       color: #ffffff;
//       text-decoration: none;
//       padding: 10px 20px;
//       border-radius: 4px;
//     }
    
//     .btn:hover {
//       background-color: #45a049;
//     }
//   </style>
// </head>

// <body>
//   <div class="container">
//     <h1>Recuperação de Senha - FENEG </h1>
//     <p>Olá,${createLink.name}</p>
//     <p>Recebemos uma solicitação de recuperação de senha para a sua conta. Se você não solicitou essa recuperação, por favor, ignore este e-mail.</p>
//     <p>Caso tenha sido você, clique no botão abaixo para redefinir a sua senha:</p>
//     <p>
//       <a href="${recoverLink}" class="btn">Redefinir Senha</a>
//     </p>
//     <p>Ou copie e cole o seguinte link no seu navegador:</p>
//     <p><a href="${recoverLink}">${recoverLink}</a></p>
//     <p>Obrigado,</p>
//     <p>A equipe de suporte</p>
//   </div>
// </body>

// </html>`

//             const mailData = {
//                 from: {
//                     name: `FENEG  - Sicoob Frutal`,
//                     address: "feneg@gmail.com",
//                 },
//                 to: email,
//                 subject: `Recuperar Senha - FENEG `,
//                 html: html,
//             };

//             await new Promise((resolve, reject) => {
//                 // verify connection configuration
//                 transporter.verify(function (error, success) {
//                     if (error) {
//                         console.log(error);
//                         reject(error);
//                     } else {
//                         console.log("Server is ready to take our messages");
//                         resolve(success);
//                     }
//                 });
//             });

//             await new Promise((resolve, reject) => {
//                 // send mail
//                 transporter.sendMail(mailData, (err, info) => {
//                     if (err) {
//                         console.error(err);
//                         reject(err);
//                     } else {
//                         console.log(info);
//                         resolve(info);
//                     }
//                 });
//             });

//             res.status(200).json({ status: "OK" });
//         }
//     } catch (error) {
//         res.status(400).json({ message: error })
//     }
// }