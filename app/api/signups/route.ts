import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'waitlist-signups.json')
    
    if (!fs.existsSync(dataPath)) {
      return NextResponse.json({ signups: [], total: 0 })
    }

    const data = fs.readFileSync(dataPath, 'utf8')
    let signups = []
    
    // Handle empty file or invalid JSON
    if (data.trim()) {
      try {
        signups = JSON.parse(data)
      } catch (parseError) {
        console.error('Error parsing signup data:', parseError)
        return NextResponse.json({ signups: [], total: 0, error: 'Invalid JSON data' })
      }
    }

    // Calculate statistics
    const stats = {
      total: signups.length,
      byUserType: signups.reduce((acc: any, signup: any) => {
        acc[signup.userType] = (acc[signup.userType] || 0) + 1
        return acc
      }, {}),
      byDate: signups.reduce((acc: any, signup: any) => {
        acc[signup.date] = (acc[signup.date] || 0) + 1
        return acc
      }, {}),
      uniqueEmails: [...new Set(signups.map((s: any) => s.email.toLowerCase()))].length
    }

    return NextResponse.json({
      signups,
      stats,
      total: signups.length,
      uniqueEmails: stats.uniqueEmails
    })
  } catch (error) {
    console.error('Error reading signup data:', error)
    return NextResponse.json(
      { error: 'Failed to read signup data' },
      { status: 500 }
    )
  }
} 