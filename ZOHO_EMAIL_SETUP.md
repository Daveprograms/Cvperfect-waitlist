# Zoho Mail Configuration for CVPerfect

This document outlines how to configure Zoho Mail as your email provider for the CVPerfect waitlist application.

## Required Environment Variables

Add these environment variables to your `.env.local` file (for development) or your production environment:

```env
# Zoho SMTP Configuration
SMTP_HOST=smtp.zoho.com
SMTP_PORT=587
SMTP_USER=your-email@your-domain.com
SMTP_PASSWORD=your-app-password
SMTP_FROM="Your Name <your-email@your-domain.com>"
```

**Important:** All environment variables are required. The application no longer has fallback defaults for security reasons.

## Setup Instructions

### 1. Create a Zoho Mail Account
- Sign up for Zoho Mail at https://www.zoho.com/mail/
- Add your custom domain or use a free @zohomail.com address

### 2. Generate App Password
1. Log in to your Zoho account
2. Go to Account Settings → Security → App Passwords
3. Generate a new app password for "Mail"
4. Use this app password as your `SMTP_PASSWORD` (not your regular login password)

### 3. SMTP Settings
- **Host:** `smtp.zoho.com`
- **Port:** `587` (STARTTLS) or `465` (SSL)
- **Authentication:** Required
- **Security:** STARTTLS (recommended) or SSL

### 4. Update Environment Variables
Create or update your `.env.local` file with:

```env
# Zoho SMTP Configuration
SMTP_HOST=smtp.zoho.com
SMTP_PORT=587
SMTP_USER=david@cvperfect.pro
SMTP_PASSWORD=your-generated-app-password
SMTP_FROM="David from CVPerfect <david@cvperfect.pro>"
```

**Note:** Remove any old Mailtrap settings from your environment files.

## Key Changes Made

The following files have been updated to use Zoho instead of Mailtrap:

1. `app/api/verify-email/route.ts`
2. `app/api/test-email/route.ts`
3. `app/api/test-email-simple/route.ts`
4. `app/api/waitlist/route.ts`

### Changes Include:
- Updated default SMTP host from `live.smtp.mailtrap.io` to `smtp.zoho.com`
- Updated default credentials placeholders
- Changed `rejectUnauthorized` from `false` to `true` (Zoho requires proper SSL certificates)
- Removed Mailtrap-specific TLS cipher configuration

## Testing

After setting up your environment variables, test the email functionality using:

1. **Simple Test:** `POST /api/test-email-simple`
2. **Full Test:** `POST /api/test-email`
3. **Verification Test:** `POST /api/verify-email`
4. **Waitlist Test:** `POST /api/waitlist`

## Troubleshooting

### Common Issues:
1. **Authentication Failed:** Make sure you're using an app password, not your regular password
2. **Connection Timeout:** Check your firewall settings and ensure port 587 is open
3. **SSL/TLS Errors:** Verify your Zoho account is properly configured and certificates are valid

### Debug Information:
All API routes include debug logging that will show:
- SMTP configuration being used
- Connection verification status
- Email sending results

Check your server logs for detailed error messages if emails fail to send.

## Security Notes

- Never commit your actual credentials to version control
- Use environment variables for all sensitive configuration
- Consider using different credentials for development and production
- Regularly rotate your app passwords for security
