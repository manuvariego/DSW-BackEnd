import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.MAIL_USER, 
    pass: process.env.MAIL_PASS   
  }
});

//función genérica para enviar emails (la usamos para recuperar contraseña)
export const sendEmail = async ({ to, subject, html }: { to: string, subject: string, html: string }) => {
  const mailOptions = {
    from: '"ParkEasy" <no-reply@parkeasy.com>',
    to: to,
    subject: subject,
    html: html
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email enviado correctamente a ' + to);
    return info;
  } catch (error) {
    console.error('Error enviando email:', error);
    throw error; 
  }
};

//función específica para enviar emails de reserva
export const sendReservationEmail = async (to: string, reservationDetails: any) => {
  
  const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #343a40;">¡Hola! Tu lugar está reservado.</h2>
        <p>Gracias por usar ParkEasy. Aquí tienes los detalles de tu reserva:</p>
        
        <ul style="list-style: none; padding: 0;">
          <li><strong>Entrada:</strong> ${new Date(reservationDetails.check_in_at).toLocaleString()}</li>
          <li><strong>Salida:</strong> ${new Date(reservationDetails.check_out_at).toLocaleString()}</li>
          <li><strong>Vehículo:</strong> ${reservationDetails.vehicle.license_plate}</li>
          <li><strong>Cochera:</strong> ${reservationDetails.garage.name}</li>
        </ul>

        <p style="margin-top: 20px; color: #777;">Si necesitas cancelar, puedes hacerlo desde la app.</p>
        <br>
        <small>Equipo ParkEasy</small>
      </div>
  `;

  return sendEmail({
    to: to,
    subject: '¡Reserva Confirmada!',
    html: htmlContent
  });
};