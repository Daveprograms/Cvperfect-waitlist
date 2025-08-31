# Gmail SMTP Setup (Alternative to Zoho)

If Zoho continues to have issues, Gmail is a reliable alternative.

## Gmail Setup Steps

### 1. Enable 2-Factor Authentication
- Go to https://myaccount.google.com/security
- Turn on 2-Step Verification

### 2. Generate App Password
- Go to https://myaccount.google.com/apppasswords
- Select "Mail" and generate a 16-character password

### 3. Update .env.local
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-gmail@gmail.com
SMTP_PASSWORD=your-16-char-app-password
SMTP_FROM="David from CVPerfect <your-gmail@gmail.com>"
```

### 4. Test Configuration
Gmail SMTP is very reliable and works immediately after setup.

## Pros of Gmail
- ✅ Immediate setup (no waiting for propagation)
- ✅ Very reliable SMTP service
- ✅ Good deliverability rates
- ✅ No custom domain complications

## Cons of Gmail
- ❌ Uses @gmail.com address instead of @cvperfect.pro
- ❌ Less professional for business emails

## Recommendation
Use Gmail for now to get your waitlist working, then troubleshoot Zoho later.

