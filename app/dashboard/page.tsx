'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface Signup {
  name: string
  email: string
  userType: string
  timestamp: string
  date: string
  time: string
}

interface Stats {
  total: number
  byUserType: Record<string, number>
  byDate: Record<string, number>
}

export default function Dashboard() {
  const [signups, setSignups] = useState<Signup[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSignups()
  }, [])

  const fetchSignups = async () => {
    try {
      const response = await fetch('/api/signups')
      const data = await response.json()
      setSignups(data.signups || [])
      setStats(data.stats || null)
    } catch (error) {
      console.error('Error fetching signups:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">CVPerfect Waitlist Dashboard</h1>
          <p className="text-gray-400">Track your waitlist signups and analytics</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-gray-400 text-sm font-medium">Total Signups</h3>
            <p className="text-3xl font-bold text-white">{stats?.total || 0}</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-gray-400 text-sm font-medium">Students</h3>
            <p className="text-3xl font-bold text-purple-400">{stats?.byUserType?.student || 0}</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-gray-400 text-sm font-medium">Recent Graduates</h3>
            <p className="text-3xl font-bold text-blue-400">{stats?.byUserType?.grad || 0}</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-gray-400 text-sm font-medium">Professionals</h3>
            <p className="text-3xl font-bold text-green-400">{stats?.byUserType?.professional || 0}</p>
          </div>
        </motion.div>

        {/* Signups Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800 rounded-lg overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">Recent Signups</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {signups.slice(-10).reverse().map((signup, index) => (
                  <tr key={index} className="hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{signup.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{signup.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        signup.userType === 'student' ? 'bg-purple-100 text-purple-800' :
                        signup.userType === 'grad' ? 'bg-blue-100 text-blue-800' :
                        signup.userType === 'professional' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {signup.userType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{signup.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{signup.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Export Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-gray-800 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Export Data</h3>
          <div className="space-y-4">
            <p className="text-gray-400 text-sm">
              Your signup data is automatically saved to <code className="bg-gray-700 px-2 py-1 rounded">data/waitlist-signups.json</code>
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  const dataStr = JSON.stringify(signups, null, 2)
                  const dataBlob = new Blob([dataStr], { type: 'application/json' })
                  const url = URL.createObjectURL(dataBlob)
                  const link = document.createElement('a')
                  link.href = url
                  link.download = 'cvperfect-waitlist-signups.json'
                  link.click()
                }}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Export JSON
              </button>
              <button
                onClick={() => {
                  const csvContent = [
                    'Name,Email,User Type,Date,Time',
                    ...signups.map(s => `${s.name},${s.email},${s.userType},${s.date},${s.time}`)
                  ].join('\n')
                  const dataBlob = new Blob([csvContent], { type: 'text/csv' })
                  const url = URL.createObjectURL(dataBlob)
                  const link = document.createElement('a')
                  link.href = url
                  link.download = 'cvperfect-waitlist-signups.csv'
                  link.click()
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Export CSV
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 