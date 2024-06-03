import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const contactEmail = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    // Handle preflight request
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST,OPTIONS',
      },
      body: '',
    };
  }

  try {
    const body = JSON.parse(event.body);

    const name = `${body.firstName} ${body.lastName}`;
    const email = body.email;
    const message = body.message;
    const phone = body.phone;

    const mail = {
      from: name,
      to: process.env.EMAIL_USER,
      subject: "Contact Form Submission - Portfolio",
      html: `<p>Name: ${name}</p>
             <p>Email: ${email}</p>
             <p>Phone: ${phone}</p>
             <p>Message: ${message}</p>`,
    };

    await contactEmail.sendMail(mail);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ code: 200, status: "Message Sent" }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Failed to send email' }),
    };
  }
};
