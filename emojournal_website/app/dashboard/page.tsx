"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import MoodCheckIn from "@/components/mood-check-in"
import RecentEntries from "@/components/recent-entries"
import MoodTrends from "@/components/mood-trends"

export default function DashboardPage() {
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

  const handleLogout = () => {
    localStorage.removeItem("emojournal_username")
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Good {getTimeOfDay()}, {username}! 👋
          </h1>
          <p className="text-gray-600">How are you feeling today?</p>
          </div>
          <Button 
            onClick={handleLogout}
            className="text-gray-600 hover:text-gray-800 border border-gray-300 bg-transparent hover:bg-gray-50"
          >
            Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <MoodCheckIn />
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/chat">
                <Button className="w-full bg-purple-500 hover:bg-purple-600">Start Journaling</Button>
              </Link>
              <Link href="/analytics">
                <Button className="w-full bg-transparent border border-gray-300 hover:bg-gray-50">
                  View Analytics
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentEntries userId={username} />
          <MoodTrends userId={username} />
        </div>
      </div>
    </div>
  )
}

function getTimeOfDay() {
  const hour = new Date().getHours()
  if (hour < 12) return "morning"
  if (hour < 17) return "afternoon"
  return "evening"
}
