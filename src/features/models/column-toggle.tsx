'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Columns3 } from 'lucide-react'
import { useColumnStore } from './column-store'

const columnLabels: Record<string, string> = {
  providerName: 'Provider',
  name: 'Model',
  family: 'Family',
  costInput: 'Input Cost',
  costOutput: 'Output Cost',
  contextLimit: 'Context',
  outputLimit: 'Output',
  modalitiesInput: 'Input Modalities',
  modalitiesOutput: 'Output Modalities',
  open_weights: 'Open Weights',
  reasoning: 'Reasoning',
  tool_call: 'Tool Call',
  attachment: 'Attachment',
}

export function ColumnToggle() {
  const { visibility, toggle, reset } = useColumnStore()
  const visibleCount = Object.values(visibility).filter(Boolean).length

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1.5 px-2.5">
          <Columns3 className="h-4 w-4" />
          <span className="text-xs">Columns</span>
          <span className="bg-muted text-muted-foreground ml-0.5 flex h-4 items-center rounded px-1 text-[10px]">
            {visibleCount}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-2" align="end">
        <div className="space-y-1">
          {Object.entries(columnLabels).map(([id, label]) => (
            <label
              key={id}
              className="hover:bg-muted flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm"
            >
              <Checkbox
                checked={visibility[id] ?? true}
                onCheckedChange={() => toggle(id)}
              />
              <span className="truncate">{label}</span>
            </label>
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="mt-2 h-7 w-full text-xs"
          onClick={reset}
        >
          Reset columns
        </Button>
      </PopoverContent>
    </Popover>
  )
}
