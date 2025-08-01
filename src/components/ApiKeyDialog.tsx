import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Key, ExternalLink } from 'lucide-react'

interface ApiKeyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (apiKey: string) => void
}

export const ApiKeyDialog = ({
  open,
  onOpenChange,
  onSave,
}: ApiKeyDialogProps) => {
  const [apiKey, setApiKey] = useState('')

  const handleSave = () => {
    if (apiKey.trim()) {
      onSave(apiKey.trim())
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Key className='w-5 h-5' />
            Configure Fireworks API Key
          </DialogTitle>
          <DialogDescription>
            Enter your Fireworks AI API key to enable real AI responses. Your
            key will be stored locally in your browser.
          </DialogDescription>
        </DialogHeader>

        <div className='grid gap-4 py-4'>
          <div className='grid gap-2'>
            <Label htmlFor='apikey'>API Key</Label>
            <Input
              id='apikey'
              type='password'
              placeholder='fw-xxx...'
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
          </div>

          <div className='text-sm text-muted-foreground'>
            <p>Don't have an API key?</p>
            <a
              href='https://fireworks.ai/api-keys'
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center gap-1 text-primary hover:underline'
            >
              Get one from Fireworks AI
              <ExternalLink className='w-3 h-3' />
            </a>
          </div>
        </div>

        <DialogFooter>
          <Button
            type='button'
            variant='outline'
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type='button' onClick={handleSave} disabled={!apiKey.trim()}>
            Save API Key
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
