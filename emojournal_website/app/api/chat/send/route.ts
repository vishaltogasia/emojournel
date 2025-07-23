import { type NextRequest, NextResponse } from "next/server"

// Only import OpenAI if the API key is available
let openai: any = null

// Initialize OpenAI if API key is available
if (process.env.OPENAI_API_KEY) {
  try {
    const OpenAI = require("openai")
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  } catch (error) {
    console.error("Failed to initialize OpenAI:", error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId, userId } = await request.json()

    // Check if OpenAI is configured
    if (!openai) {
      return NextResponse.json({
        response: getFallbackResponse(message),
        emotion_analysis: getFallbackAnalysis(message),
      })
    }

    // Analyze emotion and generate response
      const emotionAnalysis = await analyzeEmotion(message)
      const aiResponse = await generateAIResponse(message, emotionAnalysis)

      return NextResponse.json({
        response: aiResponse,
        emotion_analysis: emotionAnalysis,
      })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json({
      response: getFallbackResponse("I'm here to listen."),
      emotion_analysis: getFallbackAnalysis("neutral"),
    })
  }
}

async function analyzeEmotion(text: string) {
  if (!openai) {
    return getFallbackAnalysis(text)
  }

  try {
    const prompt = `Analyze the emotional content of this text and classify it. Return a JSON response with emotions and confidence scores.

Text: "${text}"

Return JSON in this exact format:
{
  "emotions": [
    {"name": "joy", "confidence": 0.85},
    {"name": "anxiety", "confidence": 0.65}
  ],
  "dominant_emotion": "joy",
  "mood_score": 7,
  "intensity": "moderate"
}`

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
    })

    const response = completion.choices[0].message.content
    if (response) {
      try {
        return JSON.parse(response)
      } catch (parseError) {
        console.error("Failed to parse emotion analysis:", parseError)
        return getFallbackAnalysis(text)
      }
    }

    return getFallbackAnalysis(text)
  } catch (error) {
    console.error("Error analyzing emotion:", error)
    return getFallbackAnalysis(text)
  }
}

function getFallbackAnalysis(text: string) {
  // Simple keyword-based fallback
  const lowerText = text.toLowerCase()

  if (lowerText.includes("happy") || lowerText.includes("joy") || lowerText.includes("great")) {
    return {
      emotions: [{ name: "joy", confidence: 0.7 }],
      dominant_emotion: "joy",
      mood_score: 7,
      intensity: "moderate",
    }
  } else if (lowerText.includes("sad") || lowerText.includes("down") || lowerText.includes("depressed")) {
    return {
      emotions: [{ name: "sadness", confidence: 0.7 }],
      dominant_emotion: "sadness",
      mood_score: 3,
      intensity: "moderate",
    }
  } else if (lowerText.includes("anxious") || lowerText.includes("worried") || lowerText.includes("nervous")) {
    return {
      emotions: [{ name: "anxiety", confidence: 0.7 }],
      dominant_emotion: "anxiety",
      mood_score: 4,
      intensity: "moderate",
    }
  }

  return {
    emotions: [{ name: "neutral", confidence: 0.5 }],
    dominant_emotion: "neutral",
    mood_score: 5,
    intensity: "low",
  }
}

async function generateAIResponse(message: string, emotionAnalysis: any) {
  if (!openai) {
    return getFallbackResponse(message)
  }

  try {
    const systemPrompt = `You are an empathetic emotional support companion for EmoJournal. Your role is to help users process their emotions through natural conversation.

Guidelines:
- Be warm, understanding, and non-judgmental
- Ask follow-up questions to encourage self-reflection
- Validate the user's feelings
- Suggest healthy coping strategies when appropriate
- Keep responses concise but meaningful (2-3 sentences)
- Recognize when professional help might be needed

The user's current emotional state: ${emotionAnalysis.dominant_emotion} (mood: ${emotionAnalysis.mood_score}/10)`

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      temperature: 0.7,
      max_tokens: 200,
    })

    return completion.choices[0].message.content || "I hear you. Can you tell me more about how you're feeling?"
  } catch (error) {
    console.error("Error generating AI response:", error)
    return getFallbackResponse(message)
  }
}

function getFallbackResponse(message: string) {
  const responses = [
    "I hear you, and I want you to know that your feelings are completely valid. Can you tell me more about what's going through your mind right now?",
    "Thank you for sharing that with me. It sounds like you're going through something important. How are you feeling about the situation?",
    "I'm here to listen and support you. Your emotions matter, and it's okay to feel whatever you're experiencing. What would help you feel better right now?",
    "That sounds really meaningful to you. I appreciate you opening up and sharing your thoughts with me. How has this been affecting you?",
    "I can sense that this is significant for you. Your feelings are important, and I'm glad you're taking the time to reflect on them. What's been on your mind lately?",
  ]

  return responses[Math.floor(Math.random() * responses.length)]
}
