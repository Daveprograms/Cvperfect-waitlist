import { NextRequest, NextResponse } from 'next/server'
import * as nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const { testEmail } = await request.json()
    
    if (!testEmail) {
      return NextResponse.json({ error: 'Test email required' }, { status: 400 })
    }

    console.log('=== SIMPLE EMAIL TEST ===')
    console.log('Test email:', testEmail)
    console.log('Environment variables:')
    console.log('SMTP_HOST:', process.env.SMTP_HOST)
    console.log('SMTP_PORT:', process.env.SMTP_PORT)
    console.log('SMTP_USER:', process.env.SMTP_USER)
    console.log('SMTP_PASSWORD:', process.env.SMTP_PASSWORD ? 'SET' : 'NOT SET')
    console.log('SMTP_FROM:', process.env.SMTP_FROM)
    
    // Use Zoho SMTP settings for testing
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.zoho.com',
      port: Number(process.env.SMTP_PORT || '587'), // must be number, not string
      secure: Number(process.env.SMTP_PORT || '587') === 465, // true for port 465 (SSL), false for port 587 (STARTTLS)
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      },
      tls: {
        rejectUnauthorized: false // Zoho sometimes requires this in dev
      }
    })

    console.log('Testing SMTP connection...')
    await transporter.verify()
    console.log('SMTP connection verified')

    const testEmailObj = {
      from: process.env.SMTP_FROM || 'David from CVPerfect <david@cvperfect.pro>',
      to: testEmail,
      subject: 'CVPerfect Test Email',
      text: 'This is a test email from CVPerfect. If you receive this, email sending is working!',
      html: '<h1>CVPerfect Test Email</h1><p>This is a test email from CVPerfect. If you receive this, email sending is working!</p>'
    }

    console.log('Sending test email...')
    const result = await transporter.sendMail(testEmailObj)
    
    console.log('Test email result:', {
      messageId: result.messageId,
      response: result.response,
      accepted: result.accepted,
      rejected: result.rejected
    })

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      result: {
        messageId: result.messageId,
        response: result.response,
        accepted: result.accepted,
        rejected: result.rejected
      }
    })

  } catch (error: any) {
    console.error('Test email failed:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      details: {
        code: error.code,
        command: error.command,
        response: error.response
      }
    }, { status: 500 })
  }
}
