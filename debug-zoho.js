require('dotenv').config({ path: '.env.local' });
const nodemailer = require('nodemailer');

console.log('🔍 Environment Variables:');
console.log('SMTP_HOST:', process.env.SMTP_HOST);
console.log('SMTP_PORT:', process.env.SMTP_PORT);
console.log('SMTP_USER:', process.env.SMTP_USER);
console.log('SMTP_PASSWORD length:', process.env.SMTP_PASSWORD?.length);
console.log('SMTP_FROM:', process.env.SMTP_FROM);

async function testZoho() {
  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    debug: true, // Enable debug output
    logger: true // Enable logging
  });

  try {
    console.log('\n🔧 Testing connection...');
    await transporter.verify();
    console.log('✅ SUCCESS: SMTP connection verified!');
    
    // Try sending a test email
    console.log('\n📧 Sending test email...');
    const result = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: 'davfash1@gmail.com', // Using your email from the logs
      subject: 'Test from Zoho',
      text: 'If you receive this, Zoho is working!'
    });
    
    console.log('✅ Email sent successfully!', result.messageId);
    
  } catch (error) {
    console.log('❌ Error details:');
    console.log('Message:', error.message);
    console.log('Code:', error.code);
    console.log('Response:', error.response);
    console.log('ResponseCode:', error.responseCode);
    
    if (error.code === 'EAUTH') {
      console.log('\n💡 Authentication Solutions:');
      console.log('1. Generate a NEW App Password in Zoho');
      console.log('2. Make sure IMAP is enabled in Zoho Mail settings');
      console.log('3. Try using your actual Zoho login password temporarily');
      console.log('4. Check if your account is locked or restricted');
    }
  }
}

testZoho();
