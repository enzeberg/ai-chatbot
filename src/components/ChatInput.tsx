import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Square } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatInputProps {
  onSendMessage: (message: string) => void
  isLoading?: boolean
  onStopGenerating?: () => void
}

export const ChatInput = ({ onSendMessage, isLoading, onStopGenerating }: ChatInputProps) => {
  const [input, setInput] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    
    onSendMessage(input.trim())
    setInput("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="border-t border-chat-border bg-background/80 backdrop-blur-sm p-4">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        <div className="relative flex items-end gap-3">
          <div className="flex-1">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Say something..."
              className={cn(
                "min-h-[44px] max-h-32 resize-none rounded-xl border-chat-border",
                "bg-chat-input-background text-foreground placeholder:text-muted-foreground",
                "focus:ring-2 focus:ring-primary focus:border-transparent",
                "transition-all duration-200"
              )}
              disabled={isLoading}
            />
          </div>
          
          {isLoading ? (
            <Button
              type="button"
              onClick={onStopGenerating}
              size="icon"
              variant="outline"
              className="h-11 w-11 rounded-xl border-chat-border hover:bg-destructive hover:text-destructive-foreground"
            >
              <Square className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={!input.trim()}
              size="icon"
              className={cn(
                "h-11 w-11 rounded-xl",
                "bg-gradient-primary hover:opacity-90",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "transition-all duration-200"
              )}
            >
              <Send className="w-4 h-4" />
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}