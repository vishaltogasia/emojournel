"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Message {
  id: string
  content: string
  message_type: "user" | "assistant"
  created_at: string
  emotion_analysis?: any
}

interface ChatInterfaceProps {
  userId: string
}

export default function ChatInterface({ userId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Check if services are configured
  const isSupabaseConfigured = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const isOpenAIConfigured = true // We'll check this on the server side

  useEffect(() => {
    initializeChat()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const initializeChat = async () => {
    // Create a demo session ID
    const demoSessionId = `demo-${Date.now()}`
    setSessionId(demoSessionId)

    // Add welcome message
    const welcomeMessage = {
      id: "welcome",
      content: isSupabaseConfigured
        ? "Hi! I'm here to listen and help you explore your feelings. How are you doing today?"
        : "Hi! This is a demo version of EmoJournal. I can still chat with you, but your messages won't be saved. How are you feeling today?",
      message_type: "assistant" as const,
      created_at: new Date().toISOString(),
    }

    setMessages([welcomeMessage])
  }

  const sendMessage = async () => {
    if (!input.trim() || loading || !sessionId) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      message_type: "user",
      created_at: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      // Send to AI for response (this will work even without Supabase)
      const response = await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          sessionId,
          userId,
        }),
      })

      const data = await response.json()

      if (data.response) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response,
          message_type: "assistant",
          created_at: new Date().toISOString(),
        }

        setMessages((prev) => [...prev, assistantMessage])

        // Save the conversation to localStorage
        const username = localStorage.getItem("emojournal_username")
        const entryData = {
          id: Date.now().toString(),
          username: username,
          content: input,
          emotion_analysis: data.emotion_analysis,
          mood_score: data.emotion_analysis?.mood_score,
          created_at: new Date().toISOString(),
        }

        const existingEntries = JSON.parse(localStorage.getItem("emojournal_entries") || "[]")
        existingEntries.push(entryData)
        localStorage.setItem("emojournal_entries", JSON.stringify(existingEntries))
      } else if (data.error) {
        // Fallback response if API fails
        const fallbackMessage: Message = {
          id: (Date.now() + 1).toString(),
          content:
            "I understand you're sharing something important with me. While I'm having some technical difficulties right now, I want you to know that your feelings are valid. Can you tell me more about what's on your mind?",
          message_type: "assistant",
          created_at: new Date().toISOString(),
        }
        setMessages((prev) => [...prev, fallbackMessage])
      }
    } catch (error) {
      console.error("Error sending message:", error)
      // Add fallback message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "I'm experiencing some technical difficulties, but I'm still here to listen. Your feelings and thoughts are important. What would you like to share?",
        message_type: "assistant",
        created_at: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 to-blue-50">
      <header className="p-4 border-b bg-white/80 backdrop-blur-sm">
        <h1 className="text-lg font-medium text-gray-800">
          Emotional Journal — <span className="text-sm text-gray-500">Safe space to share</span>
        </h1>
      </header>

      {!isSupabaseConfigured && (
        <div className="p-4">
          <Alert>
            <AlertDescription>
              <strong>Demo Mode:</strong> This is a preview version. Messages won't be saved. Configure Supabase to
              enable full functionality.
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="flex-1 px-4 py-6 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {loading && (
            <div className="flex justify-start">
              <Card className="max-w-xl bg-white shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-500">Thinking...</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="p-4 border-t bg-white/80 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Share what's on your mind..."
            className="flex-1 rounded-full"
            disabled={loading}
          />
          <Button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="bg-gradient-to-r from-purple-500 to-blue-400 text-white px-6 rounded-full hover:opacity-90"
          >
            ➤
          </Button>
        </div>
      </div>
    </div>
  )
}

function ChatMessage({ message }: { message: Message }) {
  const isUser = message.message_type === "user"

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <Card
        className={`max-w-xl shadow-sm ${
          isUser ? "bg-gradient-to-r from-purple-500 to-blue-400 text-white" : "bg-white"
        }`}
      >
        <CardContent className="p-4">
          <p className={isUser ? "text-white" : "text-gray-800"}>{message.content}</p>
          <span className={`text-xs block mt-2 ${isUser ? "text-purple-100" : "text-gray-400"}`}>
            {new Date(message.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </CardContent>
      </Card>
    </div>
  )
}
