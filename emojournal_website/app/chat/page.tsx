"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import ChatInterface from "@/components/chat-interface"

export default function ChatPage() {
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

  return <ChatInterface userId={username} />
}
