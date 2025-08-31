require('dotenv').config({ path: '.env.local' });
const nodemailer = require('nodemailer');

console.log('🧪 Testing with regular password (temporary test)');
console.log('Enter your regular Zoho password when prompted...');

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter your regular Zoho password (just for testing): ', async (password) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 587,
    secure: false,
    auth: {
      user: 'david@cvperfect.pro',
      pass: password, // Using regular password
    }
  });

  try {
    await transporter.verify();
    console.log('✅ Regular password works! The issue is with your App Password.');
    console.log('🔧 Solution: Generate a new App Password in Zoho settings.');
  } catch (error) {
    console.log('❌ Regular password also fails:', error.message);
    console.log('🔍 This suggests an account-level issue. Check:');
    console.log('1. Is your account locked?');
    console.log('2. Is IMAP enabled?');
    console.log('3. Are there any security restrictions?');
  }
  
  rl.close();
});
