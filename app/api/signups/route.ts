import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type Signup = {
  name: string
  email: string
  userType?: string
  timestamp?: string
  date?: string
  time?: string
}

function loadDevSignups(): Signup[] {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'waitlist-signups.json')
    if (!fs.existsSync(dataPath)) return []
    const contents = fs.readFileSync(dataPath, 'utf8').trim()
    if (!contents) return []
    const parsed = JSON.parse(contents)
    return Array.isArray(parsed) ? parsed as Signup[] : []
  } catch {
    return []
  }
}

export async function GET(_req: NextRequest) {
  // In development, read from local JSON; in production return empty list unless a real DB is added
  const signups: Signup[] = process.env.NODE_ENV === 'development' ? loadDevSignups() : []

  const stats = {
    total: signups.length,
    byUserType: signups.reduce<Record<string, number>>((acc, s) => {
      const type = (s.userType || 'unknown').toString()
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {}),
    byDate: signups.reduce<Record<string, number>>((acc, s) => {
      const date = (s.date || 'unknown').toString()
      acc[date] = (acc[date] || 0) + 1
      return acc
    }, {}),
  }

  return NextResponse.json({ signups, stats })
}


