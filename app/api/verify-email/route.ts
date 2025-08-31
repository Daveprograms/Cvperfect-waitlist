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

    console.log('=== EMAIL VERIFICATION TEST ===')
    console.log('Testing email delivery to:', email)
    
    // Use environment variables for SMTP configuration
    const smtpHost = process.env.SMTP_HOST || 'smtp.zoho.com'
    const smtpPort = process.env.SMTP_PORT || '587'
    const smtpUser = process.env.SMTP_USER  
    const smtpPassword = process.env.SMTP_PASSWORD 
    
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

    // Simple test email
    const testEmail = {
      from: process.env.SMTP_FROM || 'David from CVPerfect <david@cvperfect.pro>',
      to: email,
              replyTo: 'david@cvperfect.pro',
      subject: 'CVPerfect Email Test - Please Reply',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #8b5cf6; margin-bottom: 20px;">Email Test from CVPerfect</h2>
          
          <p>Hi ${name},</p>
          
          <p>This is a test email to verify our email system is working correctly.</p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #374151;">Test Details:</h3>
            <p><strong>Recipient:</strong> ${email}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>Test ID:</strong> ${Date.now()}</p>
          </div>
          
          <p><strong>If you received this email, please reply with "RECEIVED" to confirm delivery.</strong></p>
          
          <p>Best regards,<br>David from CVPerfect</p>
        </div>
      `,
      text: `Email Test from CVPerfect

Hi ${name},

This is a test email to verify our email system is working correctly.

Test Details:
- Recipient: ${email}
- Time: ${new Date().toLocaleString()}
- Test ID: ${Date.now()}

If you received this email, please reply with "RECEIVED" to confirm delivery.

Best regards,
David from CVPerfect`,
      headers: {
        'X-Mailer': 'CVPerfect Test System',
        'X-Campaign': 'email-verification',
        'X-Priority': '1',
        'Importance': 'high'
      }
    }

    console.log('Sending verification email...')
    const result = await transporter.sendMail(testEmail)
    
    console.log('✅ Verification email sent successfully')
    console.log('Email result:', {
      messageId: result.messageId,
      response: result.response,
      accepted: result.accepted,
      rejected: result.rejected
    })

    return NextResponse.json({
      message: 'Verification email sent successfully',
      emailId: result.messageId,
      accepted: result.accepted,
      rejected: result.rejected,
      testId: Date.now()
    })

  } catch (error: any) {
    console.error('Verification email failed:', error)
    return NextResponse.json(
      { 
        error: 'Failed to send verification email',
        details: error.message,
        code: error.code
      },
      { status: 500 }
    )
  }
}
