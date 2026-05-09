import { Badge } from '@/components/ui/badge'
import { ColumnDef } from '@tanstack/react-table'
import { FlatModel } from './types'

function formatCost(n: number) {
  if (n === 0) return 'Free'
  return `$${n.toFixed(2)}`
}

function formatNumber(n: number) {
  if (n === 0) return '-'
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return n.toLocaleString()
}

export const columns: ColumnDef<FlatModel>[] = [
  {
    accessorKey: 'providerName',
    header: 'Provider',
    size: 160,
    cell: ({ row }) => (
      <span className="text-foreground text-sm font-medium">
        {row.original.providerName}
      </span>
    ),
  },
  {
    accessorKey: 'name',
    header: 'Model',
    size: 260,
    cell: ({ row }) => (
      <span className="text-foreground text-sm">{row.original.name}</span>
    ),
  },
  {
    accessorKey: 'family',
    header: 'Family',
    size: 140,
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {row.original.family}
      </span>
    ),
  },
  {
    accessorKey: 'costInput',
    header: 'Input Cost',
    size: 100,
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {formatCost(row.original.costInput)}
      </span>
    ),
  },
  {
    accessorKey: 'costOutput',
    header: 'Output Cost',
    size: 100,
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {formatCost(row.original.costOutput)}
      </span>
    ),
  },
  {
    accessorKey: 'contextLimit',
    header: 'Context',
    size: 100,
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {formatNumber(row.original.contextLimit)}
      </span>
    ),
  },
  {
    accessorKey: 'outputLimit',
    header: 'Output',
    size: 100,
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {formatNumber(row.original.outputLimit)}
      </span>
    ),
  },
  {
    accessorKey: 'modalitiesInput',
    header: 'Input',
    size: 140,
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.modalitiesInput.map((m) => (
          <Badge key={m} variant="secondary" className="px-1 py-0 text-[10px]">
            {m}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    accessorKey: 'modalitiesOutput',
    header: 'Output',
    size: 140,
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.modalitiesOutput.map((m) => (
          <Badge key={m} variant="outline" className="px-1 py-0 text-[10px]">
            {m}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    accessorKey: 'open_weights',
    header: 'Open',
    size: 80,
    cell: ({ row }) => (
      <span className="text-sm">
        {row.original.open_weights ? 'Yes' : 'No'}
      </span>
    ),
  },
  {
    accessorKey: 'reasoning',
    header: 'Reason',
    size: 80,
    cell: ({ row }) => (
      <span className="text-sm">{row.original.reasoning ? 'Yes' : 'No'}</span>
    ),
  },
  {
    accessorKey: 'tool_call',
    header: 'Tools',
    size: 80,
    cell: ({ row }) => (
      <span className="text-sm">{row.original.tool_call ? 'Yes' : 'No'}</span>
    ),
  },
  {
    accessorKey: 'attachment',
    header: 'Attach',
    size: 80,
    cell: ({ row }) => (
      <span className="text-sm">{row.original.attachment ? 'Yes' : 'No'}</span>
    ),
  },
]
