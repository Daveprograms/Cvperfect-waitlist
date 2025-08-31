import { NextRequest, NextResponse } from 'next/server'
import * as nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()

    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and name are required' },
        { status: 400 }
      )
    }

    console.log('=== TEST EMAIL DEBUG ===')
    console.log('Testing email to:', email)
    console.log('Name:', name)
    
    // Use environment variables for SMTP configuration
    const smtpHost = process.env.SMTP_HOST || 'smtp.zoho.com'
    const smtpPort = process.env.SMTP_PORT || '587'
    const smtpUser = process.env.SMTP_USER
    const smtpPassword = process.env.SMTP_PASSWORD
    
    console.log('SMTP Config:', {
      host: smtpHost,
      port: smtpPort,
      user: smtpUser,
      secure: parseInt(smtpPort) === 465
    })
    
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(smtpPort), // must be number, not string
      secure: Number(smtpPort) === 465, // true for port 465 (SSL), false for port 587 (STARTTLS)
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
      tls: {
        rejectUnauthorized: false // Zoho sometimes requires this in dev
      }
    })

    // Verify connection
    console.log('Verifying SMTP connection...')
    await transporter.verify()
    console.log('SMTP connection verified successfully')

    // Test email
    const testEmail = {
      from: process.env.SMTP_FROM || 'David from CVPerfect <david@cvperfect.pro>',
      to: email,
      subject: 'CVPerfect Test Email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #8b5cf6; margin-bottom: 20px;">Test Email from CVPerfect</h2>
          
          <p>Hi ${name},</p>
          
          <p>This is a test email to verify that our email system is working correctly.</p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">Test Details:</h3>
            <p><strong>Recipient:</strong> ${email}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Environment:</strong> ${process.env.NODE_ENV}</p>
          </div>
          
          <p>If you received this email, please reply with "RECEIVED" so we know our email system is working!</p>
          
          <p>Best regards,<br>The CVPerfect Team</p>
        </div>
      `,
      text: `Test Email from CVPerfect

Hi ${name},

This is a test email to verify that our email system is working correctly.

Test Details:
- Recipient: ${email}
- Time: ${new Date().toLocaleString()}
- Environment: ${process.env.NODE_ENV}

If you received this email, please reply with "RECEIVED" so we know our email system is working!

Best regards,
The CVPerfect Team`,
      headers: {
        'List-Unsubscribe': '<mailto:dave@cvperfect.pro?subject=UNSUBSCRIBE>',
        'X-Priority': '3',
        'X-MSMail-Priority': 'Normal',
        'Importance': 'normal'
      }
    }

    console.log('Sending test email...')
    const result = await transporter.sendMail(testEmail)
    
    console.log('✅ Test email sent successfully')
    console.log('Email result:', {
      messageId: result.messageId,
      response: result.response,
      accepted: result.accepted,
      rejected: result.rejected
    })

    return NextResponse.json({
      message: 'Test email sent successfully',
      emailId: result.messageId,
      accepted: result.accepted,
      rejected: result.rejected
    })

  } catch (error: any) {
    console.error('Test email failed:', error)
    return NextResponse.json(
      { 
        error: 'Failed to send test email',
        details: error.message,
        code: error.code
      },
      { status: 500 }
    )
  }
}
