require('dotenv').config({ path: '.env.local' });

console.log('🔍 Account Information Check:');
console.log('Email:', process.env.SMTP_USER);
console.log('Domain:', process.env.SMTP_USER?.split('@')[1]);
console.log('');

console.log('📝 Questions to verify in your Zoho account:');
console.log('');
console.log('1. Is your domain (cvperfect.pro) properly verified in Zoho?');
console.log('   → Go to admin.zoho.com → Domain Setup');
console.log('');
console.log('2. Are you the domain admin or a regular user?');
console.log('   → Domain admins may need to enable SMTP for all users');
console.log('');
console.log('3. Is your account type Business or Free?');
console.log('   → Free accounts sometimes have SMTP limitations');
console.log('');
console.log('4. In Zoho Mail Settings → Mail Accounts:');
console.log('   → Is "IMAP Access" ON? ✓');
console.log('   → Is "POP Access" also available and ON?');
console.log('   → Are there any other security restrictions?');
console.log('');
console.log('5. In Zoho Account Security → App Passwords:');
console.log('   → Is your App Password for "Mail" specifically?');
console.log('   → Try generating another new App Password?');
console.log('');

// Let's also test after a short delay
setTimeout(async () => {
  console.log('🔄 Testing again after 30 seconds...');
  
  const nodemailer = require('nodemailer');
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
    console.log('✅ SUCCESS! IMAP settings have propagated!');
  } catch (error) {
    console.log('❌ Still failing after 30 seconds');
    console.log('This suggests a deeper account configuration issue.');
  }
}, 30000);

console.log('⏳ Will test again in 30 seconds...');

