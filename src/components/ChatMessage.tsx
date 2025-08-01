import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { Bot, User } from "lucide-react"

interface ChatMessageProps {
  content: string
  role: 'user' | 'assistant'
  isLoading?: boolean
}

export const ChatMessage = ({ content, role, isLoading }: ChatMessageProps) => {
  const isUser = role === 'user'

  return (
    <div className={cn(
      "flex gap-3 max-w-3xl mx-auto",
      isUser ? "ml-auto flex-row-reverse" : "mr-auto"
    )}>
      <Avatar className="w-8 h-8 shrink-0">
        <AvatarFallback className={cn(
          "text-xs font-medium",
          isUser 
            ? "bg-chat-user-message text-chat-user-message-foreground" 
            : "bg-primary text-primary-foreground"
        )}>
          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </AvatarFallback>
      </Avatar>
      
      <div className={cn(
        "rounded-2xl px-4 py-3 max-w-[80%] transition-all duration-200",
        isUser 
          ? "bg-chat-user-message text-chat-user-message-foreground rounded-br-md" 
          : "bg-chat-bot-message text-chat-bot-message-foreground rounded-bl-md border border-chat-border"
      )}>
        {isLoading ? (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
          </div>
        ) : (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        )}
      </div>
    </div>
  )
}