import nodemailer from 'nodemailer';
import { MongoClient } from 'mongodb';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const contactEmail = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  requestChecksumCalculation: 'WHEN_REQUIRED',
  responseChecksumValidation: 'WHEN_REQUIRED',
});
const S3_BUCKET = process.env.S3_BUCKET;
const S3_PREFIX = 'projectImages/';
const PUBLIC_BASE_URL = process.env.PUBLIC_BASE_URL;

export const handler = async (event) => {
  console.log('Event: ', event);

  // Support both HTTP API (v2) and REST API (v1) event formats
  const httpMethod = event.httpMethod || event.requestContext?.http?.method;
  const path = event.resource || event.routeKey || event.rawPath || '';

  if (httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST,OPTIONS,GET',
      },
      body: '',
    };
  }

  if (httpMethod === 'POST') {
    const body = JSON.parse(event.body);

    if (path.includes('auth')) {
      const adminPass = process.env.ADMIN_PASS || 'jeff2024admin';
      if (body.password === adminPass) {
        return {
          statusCode: 200,
          headers: { 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({ authenticated: true }),
        };
      }
      return {
        statusCode: 401,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ authenticated: false, error: 'Incorrect password' }),
      };
    } else if (path.includes('upload')) {      // Generate presigned URL for S3 upload
      try {
        const { fileName, contentType } = body;

        if (!fileName || !contentType) {
          return {
            statusCode: 400,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ error: 'fileName and contentType are required' }),
          };
        }

        const key = `${S3_PREFIX}${fileName}`;
        const command = new PutObjectCommand({
          Bucket: S3_BUCKET,
          Key: key,
          ContentType: contentType,
        });

        const presignedUrl = await getSignedUrl(s3Client, command, {
          expiresIn: 300,
          unhoistableHeaders: new Set(['x-amz-checksum-crc32']),
        });
        const publicUrl = `${PUBLIC_BASE_URL}${fileName}`;

        return {
          statusCode: 200,
          headers: { 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({ presignedUrl, publicUrl }),
        };
      } catch (error) {
        console.error(error);
        return {
          statusCode: 500,
          headers: { 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({ error: 'Failed to generate upload URL' }),
        };
      }
    } else if (path.includes('portfolioSendEmail')) {
      // Handle contact form submission
      try {
        const name = `${body.firstName} ${body.lastName}`;
        const mail = {
          from: name,
          to: process.env.EMAIL_USER,
          subject: "Contact Form Submission - Portfolio",
          html: `<p>Name: ${name}</p>
                 <p>Email: ${body.email}</p>
                 <p>Phone: ${body.phone}</p>
                 <p>Message: ${body.message}</p>`,
        };

        await contactEmail.sendMail(mail);

        return {
          statusCode: 200,
          headers: { 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({ code: 200, status: "Message Sent" }),
        };
      } catch (error) {
        console.error(error);
        return {
          statusCode: 500,
          headers: { 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({ error: 'Failed to send email' }),
        };
      }
    } else if (path.includes('projects')) {
      // Handle project submission
      try {
        await client.connect();
        const database = client.db('myPortfolio');
        const projects = database.collection('projects');

        const existingProject = await projects.findOne({ id: body.id });
        if (existingProject) {
          return {
            statusCode: 400,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ error: 'Project with this ID already exists' }),
          };
        }

        const result = await projects.insertOne(body);

        return {
          statusCode: 201,
          headers: { 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({
            message: 'Project added successfully',
            insertedId: result.insertedId,
          }),
        };
      } catch (error) {
        console.error(error);
        return {
          statusCode: 500,
          headers: { 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify({ error: 'Failed to add project' }),
        };
      } finally {
        await client.close();
      }
    }
  } else if (httpMethod === 'GET') {
    // Handle project queries
    try {
      await client.connect();
      const database = client.db('myPortfolio');
      const projects = database.collection('projects');

      const pathParams = event.pathParameters;
      if (pathParams && pathParams.id) {
        const projectId = pathParams.id;
        console.log('Project ID: ', projectId);
        const project = await projects.findOne({ id: parseInt(projectId) });

        if (!project) {
          return {
            statusCode: 404,
            headers: { 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ error: 'Project not found' }),
          };
        }

        return {
          statusCode: 200,
          headers: { 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify(project),
        };
      } else {
        const allProjects = await projects.find({}).toArray();
        return {
          statusCode: 200,
          headers: { 'Access-Control-Allow-Origin': '*' },
          body: JSON.stringify(allProjects),
        };
      }
    } catch (error) {
      console.error(error);
      return {
        statusCode: 500,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Failed to fetch projects' }),
      };
    } finally {
      await client.close();
    }
  }

  return {
    statusCode: 405,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ error: 'Method Not Allowed' }),
  };
};
