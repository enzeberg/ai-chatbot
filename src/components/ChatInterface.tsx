import { useState, useRef, useEffect } from 'react'
import { ChatMessage } from './ChatMessage'
import { ChatInput } from './ChatInput'
import { ApiKeyDialog } from './ApiKeyDialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Trash2, MessageCircle, Settings } from 'lucide-react'
import {
  FireworksAPI,
  mockFireworksAPI,
  type Message as FireworksMessage,
} from '@/lib/fireworks'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
}

export const ChatInterface = () => {
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [apiKey, setApiKey] = useState<string>(
    () => localStorage.getItem('fireworks-api-key') || ''
  )
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(false)

  // 强制滚动到底部的函数，让用户看到最新消息
  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector(
        '.radix-scroll-area-viewport'
      )
      if (viewport) {
        // 立即滚动到底部
        viewport.scrollTop = viewport.scrollHeight
        // 再次确保滚动到底部
        setTimeout(() => {
          viewport.scrollTop = viewport.scrollHeight
        }, 10)
        // 第三次确保
        setTimeout(() => {
          viewport.scrollTop = viewport.scrollHeight
        }, 100)
      }
    }
  }

  useEffect(() => {
    // 每当消息更新时强制滚动到底部，让用户看到最新消息
    setTimeout(() => scrollToBottom(), 0)
    setTimeout(() => scrollToBottom(), 50)
    setTimeout(() => scrollToBottom(), 200)
  }, [messages])

  useEffect(() => {
    // 当加载状态改变时也滚动到底部
    if (isLoading) {
      setTimeout(() => scrollToBottom(), 0)
      setTimeout(() => scrollToBottom(), 50)
    }
  }, [isLoading])

  const clearChat = () => {
    setMessages([])
  }

  // 仅在用户发送消息时滚动到顶部
  const handleSendMessage = async (message: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      role: 'user',
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    // 发送消息后强制滚动到底部，让用户看到新消息
    setTimeout(() => scrollToBottom(), 0)
    setTimeout(() => scrollToBottom(), 50)
    setTimeout(() => scrollToBottom(), 200)

    try {
      const allMessages = [...messages, userMessage]
      const apiMessages = allMessages.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }))

      // 使用 Fireworks API 或模拟 API
      const api = apiKey ? new FireworksAPI(apiKey) : mockFireworksAPI
      const stream = await api.streamChat(apiMessages)

      const assistantId = (Date.now() + 1).toString()
      setMessages((prev) => [
        ...prev,
        { id: assistantId, content: '', role: 'assistant' },
      ])

      const reader = stream.getReader()
      let assistantMessage = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        assistantMessage += value
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: assistantMessage } : m
          )
        )
        // 不再流式滚动到顶部
      }
    } catch (error) {
      console.error('Error:', error)
      const errorMessage = apiKey
        ? 'Sorry, I encountered an error. Please check your API key and try again.'
        : 'Please configure your Fireworks API key to enable AI responses.'

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          content: errorMessage,
          role: 'assistant',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveApiKey = (newApiKey: string) => {
    setApiKey(newApiKey)
    localStorage.setItem('fireworks-api-key', newApiKey)
  }

  const stopGenerating = () => {
    setIsLoading(false)
  }

  return (
    <div className='flex flex-col h-screen bg-gradient-background'>
      {/* Header */}
      <div className='border-b border-chat-border bg-background/80 backdrop-blur-sm p-4'>
        <div className='max-w-3xl mx-auto flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <div className='w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center'>
              <MessageCircle className='w-5 h-5 text-primary-foreground' />
            </div>
            <div>
              <h1 className='text-lg font-semibold text-foreground'>
                AI Chatbot
              </h1>
              <p className='text-sm text-muted-foreground'>
                {apiKey
                  ? 'Powered by Fireworks AI'
                  : 'Demo Mode - Configure API Key'}
              </p>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            <Button
              onClick={() => setShowApiKeyDialog(true)}
              variant='outline'
              size='sm'
              className='text-muted-foreground hover:text-foreground'
            >
              <Settings className='w-4 h-4 mr-2' />
              Configure API Key
            </Button>
            {messages.length > 0 && (
              <Button
                onClick={clearChat}
                variant='outline'
                size='sm'
                className='text-muted-foreground hover:text-foreground'
              >
                <Trash2 className='w-4 h-4 mr-2' />
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className='flex-1' ref={scrollAreaRef}>
        <div className='p-4'>
          {messages.length === 0 ? (
            <div className='flex flex-col items-center justify-center h-full min-h-[400px] text-center'>
              <div className='w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mb-4'>
                <MessageCircle className='w-8 h-8 text-primary-foreground' />
              </div>
              <h2 className='text-2xl font-semibold text-foreground mb-2'>
                Welcome to AI Chatbot
              </h2>
              <p className='text-muted-foreground max-w-md'>
                {apiKey
                  ? "Start a conversation by typing a message below. I'm here to help with any questions or tasks you have."
                  : "You're in demo mode. Configure your Fireworks API key to enable real AI responses, or try the demo with simulated responses."}
              </p>
            </div>
          ) : (
            <div className='space-y-6'>
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  content={message.content}
                  role={message.role as 'user' | 'assistant'}
                />
              ))}
              {isLoading && (
                <ChatMessage content='' role='assistant' isLoading={true} />
              )}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <ChatInput
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        onStopGenerating={stopGenerating}
      />

      <ApiKeyDialog
        open={showApiKeyDialog}
        onOpenChange={setShowApiKeyDialog}
        onSave={handleSaveApiKey}
      />
    </div>
  )
}
