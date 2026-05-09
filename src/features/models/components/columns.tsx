import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ColumnDef, HeaderContext } from '@tanstack/react-table'
import { Check, Filter, X } from 'lucide-react'
import { FlatModel } from '../helpers/data'
import { FilterState } from '../helpers/use-model-data'

function formatCost(n: number) {
  if (n === 0) return 'Free'
  if (n < 0.01) return `$${n.toFixed(4)}`
  if (n < 1) return `$${n.toFixed(2)}`
  return `$${n.toFixed(2)}`
}

function formatNumber(n: number) {
  if (n === 0) return '-'
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return n.toLocaleString()
}

function providerHue(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return Math.abs(hash) % 360
}

function BooleanCell({ value }: { value: boolean }) {
  return value ? (
    <Check className="h-4 w-4 text-emerald-500" />
  ) : (
    <X className="h-4 w-4 text-red-400" />
  )
}

/* ------------------------------------------------------------------ */
/*  ColumnHeader with embedded filter                                  */
/* ------------------------------------------------------------------ */

function SortArrow({ sorted }: { sorted: false | 'asc' | 'desc' }) {
  if (!sorted) return null
  return (
    <span className="ml-1 text-[10px] opacity-60">
      {sorted === 'asc' ? '↑' : '↓'}
    </span>
  )
}

function FilterHeader({
  label,
  active,
  children,
  onSort,
  sorted,
}: {
  label: string
  active: boolean
  children: React.ReactNode
  onSort?: (event: unknown) => void
  sorted: false | 'asc' | 'desc'
}) {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={onSort}
        className="hover:text-foreground flex items-center text-xs font-semibold tracking-wider uppercase select-none"
      >
        {label}
        <SortArrow sorted={sorted} />
      </button>
      <Popover>
        <PopoverTrigger asChild>
          <button
            className={`flex h-5 w-5 items-center justify-center rounded transition-colors ${
              active
                ? 'text-primary bg-primary/10'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <Filter className="h-3 w-3" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-0" align="start">
          {children}
        </PopoverContent>
      </Popover>
    </div>
  )
}

function CheckboxFilterList({
  values,
  options,
  onToggle,
}: {
  values: string[]
  options: { id: string; label: string }[]
  onToggle: (id: string) => void
}) {
  return (
    <ScrollArea className="h-64">
      <div className="space-y-0.5 p-2">
        {options.map((opt) => (
          <label
            key={opt.id}
            className="hover:bg-muted flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm"
          >
            <Checkbox
              checked={values.includes(opt.id)}
              onCheckedChange={() => onToggle(opt.id)}
            />
            <span className="truncate">{opt.label}</span>
          </label>
        ))}
      </div>
    </ScrollArea>
  )
}

function BooleanFilterPopover({
  value,
  onChange,
}: {
  value: boolean | null
  onChange: (v: boolean | null) => void
}) {
  return (
    <div className="space-y-1 p-2">
      <Button
        variant={value === true ? 'default' : 'outline'}
        size="sm"
        className="h-7 w-full text-xs"
        onClick={() => onChange(value === true ? null : true)}
      >
        Yes
      </Button>
      <Button
        variant={value === false ? 'default' : 'outline'}
        size="sm"
        className="h-7 w-full text-xs"
        onClick={() => onChange(value === false ? null : false)}
      >
        No
      </Button>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  useColumns hook                                                    */
/* ------------------------------------------------------------------ */

export interface UseColumnsProps {
  filters: FilterState
  setProviders: (v: string[] | null) => void
  setFamilies: (v: string[] | null) => void
  setModalities: (v: string[] | null) => void
  setOpenWeights: (v: boolean | null) => void
  setReasoning: (v: boolean | null) => void
  setToolCall: (v: boolean | null) => void
  setAttachment: (v: boolean | null) => void
  uniqueProviders: [string, string][]
  uniqueFamilies: string[]
  uniqueModalities: string[]
}

export function useColumns({
  filters,
  setProviders,
  setFamilies,
  setModalities,
  setOpenWeights,
  setReasoning,
  setToolCall,
  setAttachment,
  uniqueProviders,
  uniqueFamilies,
  uniqueModalities,
}: UseColumnsProps): ColumnDef<FlatModel>[] {
  function toggleArray(
    arr: string[],
    value: string,
    setter: (v: string[] | null) => void
  ) {
    const exists = arr.includes(value)
    const next = exists ? arr.filter((v) => v !== value) : [...arr, value]
    setter(next.length > 0 ? next : null)
  }

  return [
    {
      accessorKey: 'providerName',
      header: ({ column }: HeaderContext<FlatModel, unknown>) => (
        <FilterHeader
          label="Provider"
          active={filters.providers.length > 0}
          onSort={column.getToggleSortingHandler()}
          sorted={column.getIsSorted()}
        >
          <CheckboxFilterList
            values={filters.providers}
            options={uniqueProviders.map(([id, name]) => ({ id, label: name }))}
            onToggle={(v) => toggleArray(filters.providers, v, setProviders)}
          />
        </FilterHeader>
      ),
      size: 170,
      cell: ({ row }) => {
        const name = row.original.providerName
        const hue = providerHue(name)
        return (
          <Badge
            variant="secondary"
            className="text-xs font-medium"
            style={{
              backgroundColor: `hsl(${hue} 70% 92%)`,
              color: `hsl(${hue} 80% 25%)`,
              borderColor: `hsl(${hue} 60% 80%)`,
            }}
          >
            {name}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'name',
      header: ({ column }: HeaderContext<FlatModel, unknown>) => (
        <div className="hover:text-foreground flex cursor-pointer items-center text-xs font-semibold tracking-wider uppercase select-none">
          Model
          <SortArrow sorted={column.getIsSorted()} />
        </div>
      ),
      size: 280,
      cell: ({ row }) => (
        <span className="text-foreground text-sm font-medium">
          {row.original.name}
        </span>
      ),
    },
    {
      accessorKey: 'family',
      header: ({ column }: HeaderContext<FlatModel, unknown>) => (
        <FilterHeader
          label="Family"
          active={filters.families.length > 0}
          onSort={column.getToggleSortingHandler()}
          sorted={column.getIsSorted()}
        >
          <CheckboxFilterList
            values={filters.families}
            options={uniqueFamilies.map((f) => ({ id: f, label: f }))}
            onToggle={(v) => toggleArray(filters.families, v, setFamilies)}
          />
        </FilterHeader>
      ),
      size: 140,
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">
          {row.original.family}
        </span>
      ),
    },
    {
      accessorKey: 'costInput',
      header: ({ column }: HeaderContext<FlatModel, unknown>) => (
        <div className="hover:text-foreground flex cursor-pointer items-center text-xs font-semibold tracking-wider uppercase select-none">
          Input Cost
          <SortArrow sorted={column.getIsSorted()} />
        </div>
      ),
      size: 100,
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm tabular-nums">
          {formatCost(row.original.costInput)}
        </span>
      ),
    },
    {
      accessorKey: 'costOutput',
      header: ({ column }: HeaderContext<FlatModel, unknown>) => (
        <div className="hover:text-foreground flex cursor-pointer items-center text-xs font-semibold tracking-wider uppercase select-none">
          Output Cost
          <SortArrow sorted={column.getIsSorted()} />
        </div>
      ),
      size: 110,
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm tabular-nums">
          {formatCost(row.original.costOutput)}
        </span>
      ),
    },
    {
      accessorKey: 'contextLimit',
      header: ({ column }: HeaderContext<FlatModel, unknown>) => (
        <div className="hover:text-foreground flex cursor-pointer items-center text-xs font-semibold tracking-wider uppercase select-none">
          Context
          <SortArrow sorted={column.getIsSorted()} />
        </div>
      ),
      size: 90,
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm tabular-nums">
          {formatNumber(row.original.contextLimit)}
        </span>
      ),
    },
    {
      accessorKey: 'outputLimit',
      header: ({ column }: HeaderContext<FlatModel, unknown>) => (
        <div className="hover:text-foreground flex cursor-pointer items-center text-xs font-semibold tracking-wider uppercase select-none">
          Output
          <SortArrow sorted={column.getIsSorted()} />
        </div>
      ),
      size: 90,
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm tabular-nums">
          {formatNumber(row.original.outputLimit)}
        </span>
      ),
    },
    {
      accessorKey: 'modalitiesInput',
      header: ({ column }: HeaderContext<FlatModel, unknown>) => (
        <FilterHeader
          label="Input"
          active={filters.modalities.length > 0}
          onSort={column.getToggleSortingHandler()}
          sorted={column.getIsSorted()}
        >
          <CheckboxFilterList
            values={filters.modalities}
            options={uniqueModalities.map((m) => ({ id: m, label: m }))}
            onToggle={(v) => toggleArray(filters.modalities, v, setModalities)}
          />
        </FilterHeader>
      ),
      size: 130,
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.modalitiesInput.map((m) => (
            <Badge
              key={m}
              variant="secondary"
              className="px-1.5 py-0 text-[10px]"
            >
              {m}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      accessorKey: 'modalitiesOutput',
      header: ({ column }: HeaderContext<FlatModel, unknown>) => (
        <FilterHeader
          label="Output"
          active={filters.modalities.length > 0}
          onSort={column.getToggleSortingHandler()}
          sorted={column.getIsSorted()}
        >
          <CheckboxFilterList
            values={filters.modalities}
            options={uniqueModalities.map((m) => ({ id: m, label: m }))}
            onToggle={(v) => toggleArray(filters.modalities, v, setModalities)}
          />
        </FilterHeader>
      ),
      size: 130,
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.modalitiesOutput.map((m) => (
            <Badge
              key={m}
              variant="outline"
              className="px-1.5 py-0 text-[10px]"
            >
              {m}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      accessorKey: 'open_weights',
      header: ({ column }: HeaderContext<FlatModel, unknown>) => (
        <FilterHeader
          label="Open"
          active={filters.openWeights !== null}
          onSort={column.getToggleSortingHandler()}
          sorted={column.getIsSorted()}
        >
          <BooleanFilterPopover
            value={filters.openWeights}
            onChange={setOpenWeights}
          />
        </FilterHeader>
      ),
      size: 70,
      cell: ({ row }) => <BooleanCell value={row.original.open_weights} />,
    },
    {
      accessorKey: 'reasoning',
      header: ({ column }: HeaderContext<FlatModel, unknown>) => (
        <FilterHeader
          label="Reason"
          active={filters.reasoning !== null}
          onSort={column.getToggleSortingHandler()}
          sorted={column.getIsSorted()}
        >
          <BooleanFilterPopover
            value={filters.reasoning}
            onChange={setReasoning}
          />
        </FilterHeader>
      ),
      size: 70,
      cell: ({ row }) => <BooleanCell value={row.original.reasoning} />,
    },
    {
      accessorKey: 'tool_call',
      header: ({ column }: HeaderContext<FlatModel, unknown>) => (
        <FilterHeader
          label="Tools"
          active={filters.toolCall !== null}
          onSort={column.getToggleSortingHandler()}
          sorted={column.getIsSorted()}
        >
          <BooleanFilterPopover
            value={filters.toolCall}
            onChange={setToolCall}
          />
        </FilterHeader>
      ),
      size: 70,
      cell: ({ row }) => <BooleanCell value={row.original.tool_call} />,
    },
    {
      accessorKey: 'attachment',
      header: ({ column }: HeaderContext<FlatModel, unknown>) => (
        <FilterHeader
          label="Attach"
          active={filters.attachment !== null}
          onSort={column.getToggleSortingHandler()}
          sorted={column.getIsSorted()}
        >
          <BooleanFilterPopover
            value={filters.attachment}
            onChange={setAttachment}
          />
        </FilterHeader>
      ),
      size: 70,
      cell: ({ row }) => <BooleanCell value={row.original.attachment} />,
    },
  ]
}
