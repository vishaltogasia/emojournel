"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import MoodChart from "@/components/mood-chart"
import EmotionDistribution from "@/components/emotion-distribution"
import WeeklyInsights from "@/components/weekly-insights"

export default function AnalyticsPage() {
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const storedUsername = localStorage.getItem("emojournal_username")
    if (!storedUsername) {
      router.push("/auth/register")
      return
    }
    setUsername(storedUsername)
    setLoading(false)
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">💜</span>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Emotional Journey</h1>
          <p className="text-gray-600">Insights and patterns from your journaling</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <MoodChart userId={username} />
          <EmotionDistribution userId={username} />
        </div>

        <WeeklyInsights userId={username} />
      </div>
    </div>
  )
}
