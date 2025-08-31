// Quick test to verify Zoho configuration
// Run with: node test-zoho-config.js

require('dotenv').config({ path: '.env.local' });
const nodemailer = require('nodemailer');

console.log('🔍 Current Environment Variables:');
console.log('SMTP_HOST:', process.env.SMTP_HOST);
console.log('SMTP_PORT:', process.env.SMTP_PORT);
console.log('SMTP_USER:', process.env.SMTP_USER);
console.log('SMTP_PASSWORD:', process.env.SMTP_PASSWORD ? 'SET (length: ' + process.env.SMTP_PASSWORD.length + ')' : 'NOT SET');
console.log('SMTP_FROM:', process.env.SMTP_FROM);

// Test actual connection
async function testConnection() {
  try {
    console.log('\n🔧 Testing SMTP Connection...');
    
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: parseInt(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: true
      }
    });

    await transporter.verify();
    console.log('✅ SMTP Connection successful!');
    
  } catch (error) {
    console.log('❌ SMTP Connection failed:');
    console.log('Error:', error.message);
    console.log('Code:', error.code);
    
    if (error.code === 'EAUTH') {
      console.log('\n💡 Authentication failed. Check:');
      console.log('1. Are you using an App Password (not regular password)?');
      console.log('2. Is the email address correct?');
      console.log('3. Is IMAP enabled in Zoho Mail settings?');
    }
  }
}

testConnection();
