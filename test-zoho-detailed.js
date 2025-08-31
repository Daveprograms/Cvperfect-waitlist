require('dotenv').config({ path: '.env.local' });
const nodemailer = require('nodemailer');

async function detailedTest() {
  console.log('🔍 Testing different Zoho configurations...\n');
  
  const configs = [
    {
      name: 'Current Config (Port 587, STARTTLS)',
      config: {
        host: 'smtp.zoho.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        }
      }
    },
    {
      name: 'Port 465 with SSL',
      config: {
        host: 'smtp.zoho.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        }
      }
    },
    {
      name: 'Alternative Zoho SMTP',
      config: {
        host: 'smtp.zoho.in',
        port: 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        }
      }
    }
  ];

  for (const test of configs) {
    console.log(`\n🧪 Testing: ${test.name}`);
    const transporter = nodemailer.createTransport(test.config);
    
    try {
      await transporter.verify();
      console.log('✅ SUCCESS with', test.name);
      return test.config;
    } catch (error) {
      console.log('❌ Failed:', error.message);
    }
  }
  
  console.log('\n🚨 All configurations failed. Possible issues:');
  console.log('1. IMAP access not enabled in Zoho Mail settings');
  console.log('2. Account has security restrictions');
  console.log('3. Domain-level SMTP restrictions');
  console.log('4. App Password expired or invalid');
  
  return null;
}

detailedTest();

