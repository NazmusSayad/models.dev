'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { LayoutThreeColumnIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { useState } from 'react'
import { useColumnStore } from '../store/use-column-store'

const columnGroups: { label: string; columns: [string, string][] }[] = [
  {
    label: 'Identity',
    columns: [
      ['providerName', 'Provider'],
      ['name', 'Model'],
      ['family', 'Family'],
      ['type', 'Type'],
      ['status', 'Status'],
      ['description', 'Description'],
      ['canonicalModelId', 'Canonical ID'],
    ],
  },
  {
    label: 'Pricing',
    columns: [
      ['costInput', 'Input Cost'],
      ['costOutput', 'Output Cost'],
      ['costCacheRead', 'Cache Read'],
      ['costCacheWrite', 'Cache Write'],
      ['costOver200kInput', '>200k Input'],
      ['costOver200kOutput', '>200k Output'],
      ['costOver200kCacheRead', '>200k Cache Read'],
      ['costOver200kCacheWrite', '>200k Cache Write'],
      ['costReasoning', 'Reasoning Cost'],
      ['costInputAudio', 'Audio Input'],
      ['costOutputAudio', 'Audio Output'],
      ['isFree', 'Pricing'],
      ['tierCount', 'Pricing Tiers'],
    ],
  },
  {
    label: 'Limits',
    columns: [
      ['contextLimit', 'Context Limit'],
      ['inputLimit', 'Input Limit'],
      ['outputLimit', 'Output Limit'],
    ],
  },
  {
    label: 'Capabilities',
    columns: [
      ['modalitiesInput', 'Input Modalities'],
      ['modalitiesOutput', 'Output Modalities'],
      ['temperature', 'Temperature'],
      ['reasoning', 'Reasoning'],
      ['reasoningOptions', 'Reasoning Options'],
      ['tool_call', 'Tool Calls'],
      ['attachment', 'Attachment'],
      ['structuredOutput', 'Structured Output'],
      ['open_weights', 'Open Weights'],
      ['interleaved', 'Interleaved'],
    ],
  },
  {
    label: 'Dates',
    columns: [
      ['release_date', 'Released'],
      ['last_updated', 'Updated'],
    ],
  },
  {
    label: 'Provider',
    columns: [
      ['providerApi', 'API'],
      ['providerDoc', 'Docs'],
      ['providerEnv', 'Env'],
      ['providerNpm', 'SDK'],
    ],
  },
]

export function ColumnToggle() {
  const { visibility, toggle, reset } = useColumnStore()
  const [query, setQuery] = useState('')

  const normalizedQuery = query.trim().toLowerCase()
  const filteredGroups = columnGroups
    .map((group) => ({
      ...group,
      columns: group.columns.filter(([, label]) =>
        label.toLowerCase().includes(normalizedQuery)
      ),
    }))
    .filter((group) => group.columns.length > 0)

  const visibleCount = columnGroups
    .flatMap((group) => group.columns)
    .filter(([id]) => visibility[id] ?? true).length

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1.5 px-2.5">
          <HugeiconsIcon icon={LayoutThreeColumnIcon} className="h-4 w-4" />
          <span className="text-xs">Columns</span>
          <span className="bg-muted text-muted-foreground ml-0.5 flex h-4 items-center rounded px-1 text-[10px]">
            {visibleCount}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="end">
        <div className="border-b pb-2">
          <Input
            type="text"
            placeholder="Search columns..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-8 text-xs"
          />
        </div>

        <ScrollArea className="h-72">
          <div className="space-y-3 py-2 pr-2">
            {filteredGroups.map((group) => (
              <div key={group.label}>
                <p className="text-muted-foreground px-2 pb-1 text-[10px] font-semibold tracking-wider uppercase">
                  {group.label}
                </p>
                <div className="space-y-0.5">
                  {group.columns.map(([id, label]) => (
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
              </div>
            ))}

            {filteredGroups.length === 0 && (
              <p className="text-muted-foreground px-2 py-4 text-center text-xs">
                No columns found
              </p>
            )}
          </div>
        </ScrollArea>

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
