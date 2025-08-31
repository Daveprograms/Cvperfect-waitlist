'use client'

import { motion } from 'framer-motion'

const technologies = [
  {
    category: 'AI & Machine Learning',
    color: 'from-purple-500 to-pink-500',
    items: [
      {
        name: 'Google Gemini',
        description: 'Advanced AI model for resume analysis and content generation'
      },
      {
        name: 'Natural Language Processing',
        description: 'Smart text analysis for ATS optimization and keyword matching'
      },
      {
        name: 'Machine Learning',
        description: 'Personalized job matching and application success prediction'
      }
    ]
  },
  {
    category: 'Frontend',
    color: 'from-blue-500 to-cyan-500',
    items: [
      {
        name: 'Next.js 14',
        description: 'React framework with App Router for optimal performance'
      },
      {
        name: 'TypeScript',
        description: 'Type-safe development for better code quality'
      },
      {
        name: 'Tailwind CSS',
        description: 'Utility-first CSS for rapid UI development'
      },
      {
        name: 'Framer Motion',
        description: 'Smooth animations and micro-interactions'
      }
    ]
  },
  {
    category: 'Backend & Infrastructure',
    color: 'from-green-500 to-emerald-500',
    items: [
      {
        name: 'Python FastAPI',
        description: 'High-performance API framework for backend services'
      },
      {
        name: 'PostgreSQL',
        description: 'Reliable relational database for user data and analytics'
      },
      {
        name: 'Docker',
        description: 'Containerization for consistent deployment across environments'
      },
      {
        name: 'Nginx',
        description: 'Reverse proxy and load balancing for production'
      }
    ]
  }
]

export default function TechStack() {
  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Built with Modern Technology</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            CVPerfect leverages cutting-edge technologies to deliver a powerful, scalable, and user-friendly job hunting experience.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 h-full hover:border-gray-600 transition-all duration-300">
                <div className={`w-16 h-16 bg-gradient-to-r ${tech.color} rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-6">{tech.category}</h3>
                <div className="space-y-4">
                  {tech.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="border-l-2 border-gray-600 pl-4">
                      <h4 className="text-white font-semibold mb-1">{item.name}</h4>
                      <p className="text-gray-300 text-sm">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional capabilities */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 grid md:grid-cols-2 gap-8"
        >
          <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Advanced AI Features</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-purple-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Real-time resume scoring and feedback
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-purple-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Intelligent job matching algorithms
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-purple-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Personalized learning path generation
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-purple-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Smart cover letter generation
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-4">Enterprise Ready</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Scalable cloud infrastructure
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                White-label solutions
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Advanced analytics and reporting
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-blue-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Enterprise-grade security
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 