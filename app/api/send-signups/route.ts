import { NextRequest, NextResponse } from 'next/server'
import * as nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { to } = await request.json()
    const recipient = to || 'davidprograms7@gmail.com'

    // Load signups (dev only; in prod this will be empty unless DB is added)
    let signups: any[] = []
    if (process.env.NODE_ENV === 'development') {
      try {
        const dataPath = path.join(process.cwd(), 'data', 'waitlist-signups.json')
        if (fs.existsSync(dataPath)) {
          const contents = fs.readFileSync(dataPath, 'utf8').trim()
          if (contents) signups = JSON.parse(contents)
        }
      } catch {
        signups = []
      }
    }

    const csvHeader = 'Name,Email,User Type,Date,Time\n'
    const csvRows = signups.map(s => {
      const cells = [s.name, s.email, s.userType || '', s.date || '', s.time || '']
      // Avoid replaceAll for compatibility; use global regex instead
      return cells
        .map(v => String(v).replace(/"/g, '""'))
        .map(v => `"${v}"`)
        .join(',')
    })
    const csv = csvHeader + csvRows.join('\n')

    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com'
    const smtpPort = parseInt(process.env.SMTP_PORT || '587')
    const smtpUser = process.env.SMTP_USER
    const smtpPassword = process.env.SMTP_PASSWORD

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: smtpUser && smtpPassword ? { user: smtpUser, pass: smtpPassword } : undefined,
    })

    const html = `
      <div style="font-family: Arial, sans-serif;">
        <h2>CVPerfect Waitlist - Current Signups</h2>
        <p>Total signups: <strong>${signups.length}</strong></p>
        <p>Attached is a CSV export of the current waitlist.</p>
        <p>Coming soon 🚀</p>
      </div>
    `

    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'CVPerfect <support@cvperfect.pro>',
      to: recipient,
      subject: 'CVPerfect Waitlist - Current Signups (CSV Attached)',
      html,
      attachments: [
        { filename: 'cvperfect-waitlist-signups.csv', content: csv, contentType: 'text/csv' }
      ],
    })

    return NextResponse.json({ ok: true, total: signups.length })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send signups email' }, { status: 500 })
  }
}


