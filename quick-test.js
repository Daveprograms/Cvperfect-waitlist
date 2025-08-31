require('dotenv').config({ path: '.env.local' });
const nodemailer = require('nodemailer');

async function quickTest() {
  console.log('Password length:', process.env.SMTP_PASSWORD?.length);
  console.log('Password starts with:', process.env.SMTP_PASSWORD?.substring(0,3));
  
  if (process.env.SMTP_PASSWORD?.length !== 12 || !process.env.SMTP_PASSWORD?.startsWith('Fst')) {
    console.log('❌ Password not updated yet. Please update .env.local with: Fst71xG3J93E');
    return;
  }
  
  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    }
  });

  try {
    await transporter.verify();
    console.log('✅ SUCCESS! New App Password works!');
  } catch (error) {
    console.log('❌ Still failing:', error.message);
  }
}

quickTest();
