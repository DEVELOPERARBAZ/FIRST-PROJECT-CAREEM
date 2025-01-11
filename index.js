
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express(); 
const PORT = process.env.PORT || 8000;


const cors = require('cors');
app.use(cors({ origin: 'https://careemgroup.netlify.app' }));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/contact', async (req, res) => {
  const { name, email, number, location, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const toOwner = `naumanms2006@gmail.com`;

  const mailOptions = {
    from: process.env.EMAIL,
    to: toOwner,
    subject: 'Alhamdulillah New Form Submitted',
    text: `Name: ${name}\nEmail: ${email}\nNumber: ${number}\nLocation: ${location}\nMessage: ${message}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    res.send('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error); // Detailed error logging
    res.status(500).send('Failed to send email.');
  }
  

});

app.get("/", (req,res) => {
  res.send("This is home page");
})

app.get("/contact", (req,res) => {
  res.send("This is Contact page");
})
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
