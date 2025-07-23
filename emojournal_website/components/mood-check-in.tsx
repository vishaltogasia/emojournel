"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const moods = [
  { icon: "😄", label: "Great", score: 9 },
  { icon: "🙂", label: "Good", score: 7 },
  { icon: "😐", label: "Okay", score: 5 },
  { icon: "😔", label: "Low", score: 3 },
  { icon: "😰", label: "Difficult", score: 1 },
]

export default function MoodCheckIn() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const handleMoodSelect = async (moodIndex: number) => {
    setSelectedMood(moodIndex)
    setLoading(true)

    try {
      const mood = moods[moodIndex]
      const username = localStorage.getItem("emojournal_username")
      
      // Store mood data in localStorage
      const moodData = {
        id: Date.now().toString(),
        username: username,
        mood: mood.label,
        score: mood.score,
        timestamp: new Date().toISOString(),
          content: `Quick mood check-in: ${mood.label}`,
          emotion_data: { dominant_emotion: mood.label.toLowerCase() },
      }

      // Get existing mood entries or create new array
      const existingMoods = JSON.parse(localStorage.getItem("emojournal_moods") || "[]")
      existingMoods.push(moodData)
      localStorage.setItem("emojournal_moods", JSON.stringify(existingMoods))

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500))
    } catch (error) {
      console.error("Error saving mood:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Mood Check-in</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between gap-2">
          {moods.map((mood, index) => (
            <Button
              key={mood.label}
              className={`flex flex-col items-center justify-center w-16 h-16 p-2 ${
                selectedMood === index 
                  ? "bg-purple-500 hover:bg-purple-600 text-white" 
                  : "hover:bg-purple-100 border border-gray-300"
              }`}
              onClick={() => handleMoodSelect(index)}
              disabled={loading}
            >
              <span className="text-2xl">{mood.icon}</span>
              <span className="text-xs mt-1">{mood.label}</span>
            </Button>
          ))}
        </div>
        {selectedMood !== null && (
          <p className="text-center text-sm text-gray-600 mt-4">
            Mood logged! Consider starting a journal session to explore your feelings.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
