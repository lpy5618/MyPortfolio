import nodemailer from 'nodemailer';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const contactEmail = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

export const handler = async (event) => {
  console.log('Event: ', event);

  if (event.httpMethod === 'OPTIONS') {
    // Handle preflight request
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST,OPTIONS,GET,ANY',
      },
      body: '',
    };
  }

  if (event.httpMethod === 'POST') {
    // Handle contact form submission
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
  } else if (event.httpMethod === 'GET') {
    // Handle project queries
    try {
      await client.connect();
      const database = client.db('myPortfolio');
      const projects = database.collection('projects');

      let response;
      if (event.pathParameters && event.pathParameters.id) {
        const projectId = event.pathParameters.id;
        console.log('Project ID: ', projectId);
        const query = { id: parseInt(projectId) };

        const project = await projects.findOne(query);
        if (!project) {
          return {
            statusCode: 404,
            headers: {
              'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ error: 'Project not found' }),
          };
        }

        response = {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify(project),
        };
      } else {
        const allProjects = await projects.find({}).toArray();
        response = {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
          body: JSON.stringify(allProjects),
        };
      }
      return response;
    } catch (error) {
      console.error(error);
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Failed to fetch projects' }),
      };
    } finally {
      await client.close();
    }
  } else {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Method Not Allowed'}),
    };
  }
};