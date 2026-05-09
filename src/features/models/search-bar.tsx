'use client'

import { Input } from '@/components/ui/input'
import { Search, X } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-md">
      <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
      <Input
        type="text"
        placeholder="Search models, providers, families..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pr-8 pl-9"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="text-muted-foreground hover:text-foreground absolute top-2.5 right-2.5"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
