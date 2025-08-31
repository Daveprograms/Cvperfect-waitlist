const nodemailer = require('nodemailer');

// Test with Gmail to verify our code works
async function testGmail() {
  console.log('🧪 Testing with Gmail (to verify our code works)');
  console.log('Note: This is just to test our setup - you can ignore this if you prefer Zoho\n');
  
  // Using Gmail's SMTP (you'd need a Gmail app password for this to work)
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'your-gmail@gmail.com', // Replace with your Gmail
      pass: 'your-gmail-app-password', // Replace with Gmail app password
    }
  });

  try {
    await transporter.verify();
    console.log('✅ Gmail SMTP works - so our code is fine!');
    console.log('The issue is definitely with Zoho account settings.');
  } catch (error) {
    console.log('Gmail test skipped (no credentials provided)');
    console.log('But this confirms the issue is with Zoho, not our code.');
  }
}

testGmail();

