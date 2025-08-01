import { createFireworks } from '@ai-sdk/fireworks'
import { streamText, generateText } from 'ai'

export interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export class FireworksAPI {
  private fireworks: any

  constructor(apiKey: string) {
    this.fireworks = createFireworks({
      apiKey
    })
  }

  async streamChat(messages: Message[]): Promise<ReadableStream<string>> {
    const result = await streamText({
      model: this.fireworks('accounts/fireworks/models/llama-v3p1-70b-instruct'),
      messages,
      temperature: 0.7,
    })

    return result.textStream
  }

  async chat(messages: Message[]): Promise<string> {
    const result = await generateText({
      model: this.fireworks('accounts/fireworks/models/llama-v3p1-70b-instruct'),
      messages,
      temperature: 0.7,
    })

    return result.text
  }
}

// 简单的模拟 API，如果没有 API Key
export const mockFireworksAPI = {
  async streamChat(messages: Message[]): Promise<ReadableStream<string>> {
    const mockResponse = "I'm a demo AI assistant. To use real AI responses, please configure your Fireworks API key. For now, I can show you how the interface works with this simulated response. The chat interface is fully functional and ready to connect to the real Fireworks AI when you provide your API key."
    
    return new ReadableStream({
      start(controller) {
        let index = 0
        const intervalId = setInterval(() => {
          if (index < mockResponse.length) {
            controller.enqueue(mockResponse[index])
            index++
          } else {
            clearInterval(intervalId)
            controller.close()
          }
        }, 30)
      }
    })
  }
}