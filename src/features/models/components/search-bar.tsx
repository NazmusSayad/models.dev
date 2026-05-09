'use client'

import { Input } from '@/components/ui/input'
import { Cancel01Icon, Search01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-sm">
      <HugeiconsIcon
        icon={Search01Icon}
        className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4"
      />
      <Input
        type="text"
        placeholder="Search models, providers, families..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-background h-8 rounded-md border pr-8 pl-9 text-sm shadow-sm transition-colors focus-visible:ring-1"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="text-muted-foreground hover:text-foreground absolute top-1.5 right-2 flex h-5 w-5 items-center justify-center rounded-sm"
        >
          <HugeiconsIcon icon={Cancel01Icon} className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
}
