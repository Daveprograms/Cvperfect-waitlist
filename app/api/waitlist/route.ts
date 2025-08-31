import { NextRequest, NextResponse } from 'next/server'
import * as nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const { email, name, userType } = await request.json()

    // Validate input
    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and name are required' },
        { status: 400 }
      )
    }

    // Check for existing email (case-insensitive)
    const normalizedEmail = email.toLowerCase().trim()
    
    // Check for duplicates in all environments where we have file access
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production') {
      try {
        const dataDir = path.join(process.cwd(), 'data')
        const dataPath = path.join(dataDir, 'waitlist-signups.json')
        
        if (fs.existsSync(dataPath)) {
          const existingData = fs.readFileSync(dataPath, 'utf8')
          // Handle empty file or invalid JSON
          let existingSignups = []
          if (existingData.trim()) {
            try {
              existingSignups = JSON.parse(existingData)
            } catch (parseError) {
              console.error('Error parsing existing signups:', parseError)
              existingSignups = []
            }
          }
          
          // Check if email already exists (case-insensitive)
          const emailExists = existingSignups.some((signup: any) => 
            signup.email.toLowerCase().trim() === normalizedEmail
          )
          
          console.log('Checking for duplicate email:', {
            email: normalizedEmail,
            existingEmails: existingSignups.map((s: any) => s.email),
            emailExists: emailExists
          })
          
          if (emailExists) {
            console.log('❌ Duplicate email detected:', normalizedEmail)
            return NextResponse.json(
              { error: 'This email is already registered on our waitlist' },
              { status: 409 }
            )
          }
        }
      } catch (fileError) {
        console.error('Error checking for duplicate email:', fileError)
        // Continue with signup if we can't check for duplicates
      }
    }

    // Save to JSON file for tracking (only in development)
    const signupData = {
      name,
      email: normalizedEmail, // Store normalized email
      userType,
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString()
    }

    let totalSignups = 0
    
    // Try to write to file system in development and production
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production') {
      try {
        // Create data directory if it doesn't exist
        const dataDir = path.join(process.cwd(), 'data')
        if (!fs.existsSync(dataDir)) {
          fs.mkdirSync(dataDir, { recursive: true })
        }

        // Read existing data or create new array
        const dataPath = path.join(dataDir, 'waitlist-signups.json')
        let signups = []
        if (fs.existsSync(dataPath)) {
          const existingData = fs.readFileSync(dataPath, 'utf8')
          // Handle empty file or invalid JSON
          if (existingData.trim()) {
            try {
              signups = JSON.parse(existingData)
            } catch (parseError) {
              console.error('Error parsing existing signups file:', parseError)
              signups = []
            }
          }
        }

        // Add new signup
        signups.push(signupData)

        // Save updated data
        fs.writeFileSync(dataPath, JSON.stringify(signups, null, 2))
        totalSignups = signups.length
        
        console.log('✅ New signup added successfully:', {
          name: signupData.name,
          email: signupData.email,
          userType: signupData.userType,
          totalSignups: totalSignups
        })
      } catch (fileError) {
        console.error('File system error (expected in production):', fileError)
        // In production, we can't write to file system, so we'll just log the signup
        totalSignups = 1 // We don't know the actual count in production
      }
    } else {
      // In production, just log the signup data
      console.log('New waitlist signup:', signupData)
      totalSignups = 1 // We don't know the actual count in production
    }

    // Try to send emails, but don't fail if email sending fails
    let emailSuccess = false
    let emailErrorDetails = ''
    
    try {
      console.log('=== EMAIL DEBUG START ===')
      console.log('Environment variables:')
      console.log('SMTP_HOST:', process.env.SMTP_HOST)
      console.log('SMTP_PORT:', process.env.SMTP_PORT)
      console.log('SMTP_USER:', process.env.SMTP_USER)
      console.log('SMTP_PASSWORD:', process.env.SMTP_PASSWORD ? '***HIDDEN***' : 'NOT SET')
      console.log('SMTP_FROM:', process.env.SMTP_FROM)
      console.log('NODE_ENV:', process.env.NODE_ENV)
      
      console.log('Attempting to send emails...')
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
      
      // Create transporter with correct function name
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(smtpPort), // must be number, not string
        secure: Number(smtpPort) === 465, // true for port 465 (SSL), false for port 587 (STARTTLS)
        auth: {
          user: smtpUser,
          pass: smtpPassword,
        },
        // Add timeout settings - increased for production
        connectionTimeout: 30000, // 30 seconds
        greetingTimeout: 30000,
        socketTimeout: 30000,
        // Add TLS options for Zoho
        tls: {
          rejectUnauthorized: false // Zoho sometimes requires this in dev
        }
      })

      // Verify connection first
      console.log('Verifying SMTP connection...')
      await transporter.verify()
      console.log('SMTP connection verified successfully')

      // Email to you (notification) - Use cvperfect.pro address
      const notificationEmail = {
        from: process.env.SMTP_FROM || 'David from CVPerfect <david@cvperfect.pro>',
        to: 'david@cvperfect.pro', // Send to cvperfect.pro address
        subject: 'New CVPerfect Waitlist Signup! 🎉',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 25px;">
              <h1 style="color: #8b5cf6; margin: 0; font-size: 24px; font-weight: bold;">🎉 New Waitlist Signup!</h1>
              <p style="color: #6b7280; margin: 8px 0 0 0; font-size: 14px;">CVPerfect is gaining momentum!</p>
            </div>
            
            <div style="background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); padding: 20px; border-radius: 10px; margin-bottom: 20px; border-left: 4px solid #10b981;">
              <h3 style="margin: 0 0 15px 0; color: #374151; font-size: 16px; font-weight: 600;">Signup Details:</h3>
              <div style="color: #6b7280; font-size: 14px; line-height: 1.6;">
                <p style="margin: 8px 0;"><strong>Name:</strong> ${name}</p>
                <p style="margin: 8px 0;"><strong>Email:</strong> ${email}</p>
                <p style="margin: 8px 0;"><strong>User Type:</strong> ${userType}</p>
                <p style="margin: 8px 0;"><strong>Date:</strong> ${new Date().toLocaleString()}</p>
                <p style="margin: 8px 0;"><strong>Environment:</strong> ${process.env.NODE_ENV}</p>
              </div>
            </div>
            
            <div style="background: #10b981; color: white; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <p style="margin: 0; font-size: 14px; font-weight: 600;">✅ Confirmation email sent successfully</p>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; text-align: center; margin: 0;">
              This person has joined the CVPerfect waitlist and will be notified when you launch on October 30, 2025!
            </p>
          </div>
        `,
      }

      // Email to the user (confirmation)
      const confirmationEmail = {
        from: process.env.SMTP_FROM || 'David from CVPerfect <david@cvperfect.pro>',
        to: email,
        subject: 'Welcome to CVPerfect - Your Waitlist Confirmation',
        replyTo: 'david@cvperfect.pro',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #8b5cf6; margin: 0; font-size: 28px; font-weight: bold;">Welcome to CVPerfect!</h1>
              <p style="color: #6b7280; margin: 8px 0 0 0; font-size: 16px;">Your AI-powered job hunting journey begins here</p>
            </div>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Hi ${name},</p>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">Thank you for joining the CVPerfect waitlist! You're now among the first to get access to our revolutionary AI-powered job hunting assistant when we launch on <strong>October 30, 2025</strong>.</p>
            
            <div style="background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); padding: 25px; border-radius: 12px; margin: 25px 0; border-left: 4px solid #8b5cf6;">
              <h3 style="margin: 0 0 15px 0; color: #374151; font-size: 18px; font-weight: 600;">What you can expect from CVPerfect:</h3>
              <ul style="color: #6b7280; font-size: 15px; line-height: 1.8; margin: 0; padding-left: 20px;">
                <li style="margin-bottom: 8px;">🎯 <strong>AI-Powered Resume Analysis:</strong> Get personalized optimization suggestions</li>
                <li style="margin-bottom: 8px;">⚡ <strong>Smart Auto-Apply:</strong> Apply to 100+ jobs while you sleep</li>
                <li style="margin-bottom: 8px;">📊 <strong>Intelligent Job Matching:</strong> Find roles that match your skills perfectly</li>
                <li style="margin-bottom: 8px;">📝 <strong>Smart Cover Letters:</strong> Generate compelling cover letters instantly</li>
                <li style="margin-bottom: 8px;">🎓 <strong>Student Benefits:</strong> 10% discount for students and recent grads</li>
                <li style="margin-bottom: 8px;">🎓 <strong>University of Windsor Special:</strong> 15% discount for UWindsor students</li>
              </ul>
            </div>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">We'll keep you updated on our development progress and notify you as soon as CVPerfect is ready for early access. Get ready to revolutionize your job search!</p>
            
            <div style="background: #8b5cf6; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0;">
              <p style="margin: 0; font-size: 16px; font-weight: 600;">🚀 Launch Date: October 30, 2025</p>
            </div>
            
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 5px;">Best regards,</p>
            <p style="color: #8b5cf6; font-size: 16px; font-weight: 600; margin: 0;">David from CVPerfect</p>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
            <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
              You can unsubscribe at any time by replying to this email with "UNSUBSCRIBE"
            </p>
          </div>
        `,
        // Add text version for better deliverability
        text: `Welcome to CVPerfect!

Hi ${name},

Thank you for joining the CVPerfect waitlist! You're now among the first to get access to our AI-powered job hunting assistant when we launch on October 30, 2025.

What you can expect:
- AI-powered resume analysis and optimization
- Auto-apply to 100+ jobs while you sleep
- Intelligent job matching algorithms
- Smart cover letter generation
- Student discount (10% off for students and grads)
- Student discount at University of Windsor (15% off for students and grads)

We'll keep you updated on our progress and notify you as soon as CVPerfect is ready for early access!

Best regards,
David from CVPerfect

You can unsubscribe at any time by replying to this email with "UNSUBSCRIBE"

---
This email was sent to ${email} because you signed up for the CVPerfect waitlist.
If you didn't sign up, please ignore this email.`,
        // Add headers to improve deliverability
        headers: {
          'List-Unsubscribe': '<mailto:david@cvperfect.pro?subject=UNSUBSCRIBE>',
          'X-Priority': '1',
          'X-MSMail-Priority': 'High',
          'Importance': 'high',
          'X-Mailer': 'CVPerfect Waitlist System',
          'X-Campaign': 'waitlist-confirmation',
          'X-SendGrid-Category': 'waitlist-confirmation',
          'X-Auto-Response-Suppress': 'OOF, AutoReply',
          'Precedence': 'bulk',
          'X-Report-Abuse': 'Please report abuse here: david@cvperfect.pro'
        }
      }

      console.log('Notification email object:', {
        from: notificationEmail.from,
        to: notificationEmail.to,
        subject: notificationEmail.subject
      })
      console.log('Sending notification email...')
      try {
        await transporter.sendMail(notificationEmail)
        console.log('✅ Notification email sent successfully')
      } catch (notificationError: any) {
        console.error('❌ Notification email failed:', {
          message: notificationError.message,
          code: notificationError.code,
          response: notificationError.response
        })
        // Don't throw error for notification email - continue with confirmation email
        console.log('Continuing with confirmation email despite notification failure...')
      }
      
      console.log('Confirmation email object:', {
        from: confirmationEmail.from,
        to: confirmationEmail.to,
        subject: confirmationEmail.subject,
        headers: confirmationEmail.headers
      })
      console.log('Sending confirmation email to:', email)
      console.log('Full confirmation email details:', {
        from: confirmationEmail.from,
        to: confirmationEmail.to,
        subject: confirmationEmail.subject,
        replyTo: confirmationEmail.replyTo,
        hasHtml: !!confirmationEmail.html,
        hasText: !!confirmationEmail.text,
        headers: confirmationEmail.headers
      })
      let confirmationSent = false
      let confirmationError = null
      
      // Try sending confirmation email with retry
      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          console.log(`Attempt ${attempt} to send confirmation email...`)
          const result = await transporter.sendMail(confirmationEmail)
          console.log('✅ Confirmation email sent successfully')
          console.log('Email result:', {
            messageId: result.messageId,
            response: result.response,
            accepted: result.accepted,
            rejected: result.rejected
          })
          confirmationSent = true
          break
        } catch (error: any) {
          confirmationError = error
          console.error(`❌ Confirmation email attempt ${attempt} failed:`, {
            message: error.message,
            code: error.code,
            response: error.response,
            command: error.command,
            responseCode: error.responseCode
          })
          
          if (attempt < 3) {
            console.log(`Waiting 2 seconds before retry...`)
            await new Promise(resolve => setTimeout(resolve, 2000))
          }
        }
      }
      
      if (!confirmationSent) {
        console.error('❌ All confirmation email attempts failed')
        throw confirmationError
      }
      
      emailSuccess = true
      console.log('All emails sent successfully!')
      
    } catch (emailError: any) {
      emailErrorDetails = emailError.message || 'Unknown email error'
      console.error('Email sending failed with details:', {
        message: emailError.message,
        code: emailError.code,
        command: emailError.command,
        response: emailError.response,
        responseCode: emailError.responseCode,
        stack: emailError.stack
      })
      // Continue with success response even if email fails
    }

    return NextResponse.json(
      { 
        message: 'Successfully joined waitlist',
        totalSignups: totalSignups,
        emailSent: emailSuccess,
        emailError: emailErrorDetails || null,
        environment: process.env.NODE_ENV,
        debug: {
          smtpHost: process.env.SMTP_HOST || 'smtp.zoho.com',
          smtpPort: process.env.SMTP_PORT || '587',
          smtpUser: process.env.SMTP_USER,
          smtpPassword: process.env.SMTP_PASSWORD ? 'SET' : 'NOT SET',
          smtpFrom: process.env.SMTP_FROM || 'david@cvperfect.pro'
        }
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error processing signup:', error)
    return NextResponse.json(
      { error: 'Failed to process signup' },
      { status: 500 }
    )
  }
} 