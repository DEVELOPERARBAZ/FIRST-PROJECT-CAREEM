require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({ origin: 'https://careemgroup.netlify.app' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// In-memory storage for user details
let userDetails = [];

// POST route to handle contact form submissions
app.post('/contact', async (req, res) => {
  const { name, email, number, location, message } = req.body;

  // Validate incoming data
  if (!name || !email || !number || !location || !message) {
    return res.status(400).send('All fields are required.');
  }

  try {
    // Save the user details to in-memory storage
    userDetails.push({ name, email, number, location, message });

    // Create transporter for sending email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD, // App-specific password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: process.env.RECIPIENT_EMAIL || 'sayyedarbaz956@gmail.com', // Use env variable for flexibility
      subject: 'Alhamdulillah New Form Submitted',
      text: `Name: ${name}\nEmail: ${email}\nNumber: ${number}\nLocation: ${location}\nMessage: ${message}`,
      html: `
        <h1>New Form Submission</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Number:</strong> ${number}</p>
        <p><strong>Location:</strong> ${location}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    };

    // Send the email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    res.status(200).send('Email sent and details saved successfully!');
  } catch (error) {
    console.error('Error sending email:', error); // Detailed error logging
    res.status(500).send('Failed to send email.');
  }
});

// Route to display user details in a table format
app.get('/developerAdmin', (req, res) => {
  const tableRows = userDetails
    .map(
      (user, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.number}</td>
        <td>${user.location}</td>
        <td>${user.message}</td>
      </tr>
    `
    )
    .join('');

  res.send(`
    <html>
      <head>
        <title>Admin - User Details</title>
        <style>
          table {
            width: 80%;
            margin: 20px auto;
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f2f2f2;
          }
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          tr:hover {
            background-color: #f1f1f1;
          }
        </style>
      </head>
      <body>
        <h1 style="text-align: center;">User Submissions</h1>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Number</th>
              <th>Location</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows || '<tr><td colspan="6" style="text-align: center;">No submissions yet</td></tr>'}
          </tbody>
        </table>
      </body>
    </html>
  `);
});

// Basic routes
app.get('/', (req, res) => {
  res.send('This is the home page');
});

app.get('/contact', (req, res) => {
  res.send('This is the contact page');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

