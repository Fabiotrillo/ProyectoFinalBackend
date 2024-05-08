import nodemailer from "nodemailer";
import {config}  from '../config/config.js';


const transporter =  nodemailer.createTransport({
    service: "gmail",
    port :587,
    auth:{
        user: config.mailing.user,
        pass:  config.mailing.password
    },
    secure: false,
    tls:{
        rejectUnauthorized:false
    }
})


//Email de restauracion
export const sendRecoveryPass = async (userEmail, token)=>{
    const link = `http://localhost:8080/resetpassword?token=${token}`;
    await transporter.sendMail({
        from:config.mailing.user,
        to:userEmail,
        subject:"Reestablecer contraseña",
        html:`
        <div>
            <h2>Has solicitado un cambio de contraseña</h2>
            <p>Da clic en el siguiente enlace para restablecer la contraseña</p>
            </br>
            <a href="${link}">
                <button> Restablecer contraseña </button>
            </a>
        </div>
        `
    })
};

export const sendProductDeletedNotification = async (userEmail, productName, productId) => {
    await transporter.sendMail({
        from: config.mailing.user,
        to: userEmail,
        subject: "Notificación de Eliminación de Producto",
        html: `
        <div>
            <h2>Tu producto ha sido eliminado</h2>
            <p>El producto <strong>${productName}</strong> (ID: ${productId}) ha sido eliminado.</p>
        </div>
        `
    });
};


export const sendPurchaseConfirmation = async (userEmail, ticketInfo) => {
    // Construir el contenido del correo electrónico con la información del ticket
    const ticketHTML = `
        <div>
            <h2>¡Gracias por tu compra!</h2>
            <p>A continuación, encontrarás los detalles de tu compra:</p>
            <ul>
                <li><strong>Código de compra:</strong> ${ticketInfo.code}</li>
                <li><strong>Fecha de compra:</strong> ${ticketInfo.purchase_datetime}</li>
                <li><strong>Monto total:</strong> ${ticketInfo.amount}</li>
                <!-- Agrega cualquier otra información relevante del ticket aquí -->
            </ul>
            <p>¡Esperamos que disfrutes de tus productos!</p>
        </div>
    `;

    // Enviar el correo electrónico de confirmación de compra
    await transporter.sendMail({
        from: config.mailing.user,
        to: userEmail,
        subject: "Confirmación de Compra",
        html: ticketHTML
    });
};