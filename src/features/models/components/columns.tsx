import { ColumnDef } from '@tanstack/react-table'
import { formatCost, formatDate, formatNumber } from '../helpers/column'
import { FlatModel } from '../helpers/data'
import {
  AttachmentHeader,
  BooleanCell,
  ContextLimitHeader,
  CostCacheReadHeader,
  CostCacheWriteHeader,
  CostInputHeader,
  CostOutputHeader,
  CostOver200kCacheReadHeader,
  CostOver200kInputHeader,
  CostOver200kOutputHeader,
  FamilyHeader,
  InputLimitHeader,
  KnowledgeHeader,
  LastUpdatedHeader,
  ModalitiesInputHeader,
  ModalitiesOutputHeader,
  ModelHeader,
  OpenWeightsHeader,
  OutputLimitHeader,
  ProviderHeader,
  ReasoningHeader,
  ReleaseDateHeader,
  StatusHeader,
  StructuredOutputHeader,
  ToolCallHeader,
} from './column-components'

export const columns: ColumnDef<FlatModel>[] = [
  {
    accessorKey: 'providerName',
    header: ProviderHeader,
    size: 200,
    cell: ({ row }) => {
      return row.original.providerName
    },
  },
  {
    accessorKey: 'name',
    header: ModelHeader,
    size: 300,
    cell: ({ row }) => (
      <span className="text-foreground text-sm font-medium">
        {row.original.name}
      </span>
    ),
  },
  {
    accessorKey: 'family',
    header: FamilyHeader,
    size: 150,
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {row.original.family}
      </span>
    ),
  },
  {
    accessorKey: 'status',
    header: StatusHeader,
    size: 130,
    cell: ({ row }) => {
      return (
        <span className="text-muted-foreground text-xs capitalize">
          {row.original.status}
        </span>
      )
    },
  },
  {
    accessorKey: 'costInput',
    header: CostInputHeader,
    size: 140,
    cell: ({ row }) => (
      <span className="text-foreground text-sm tabular-nums">
        {formatCost(row.original.costInput)}
      </span>
    ),
  },
  {
    accessorKey: 'costOutput',
    header: CostOutputHeader,
    size: 150,
    cell: ({ row }) => (
      <span className="text-foreground text-sm tabular-nums">
        {formatCost(row.original.costOutput)}
      </span>
    ),
  },
  {
    accessorKey: 'costCacheRead',
    header: CostCacheReadHeader,
    size: 140,
    cell: ({ row }) => (
      <span className="text-foreground text-sm tabular-nums">
        {formatCost(row.original.costCacheRead)}
      </span>
    ),
  },
  {
    accessorKey: 'costCacheWrite',
    header: CostCacheWriteHeader,
    size: 150,
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm tabular-nums">
        {formatCost(row.original.costCacheWrite)}
      </span>
    ),
  },
  {
    accessorKey: 'costOver200kInput',
    header: CostOver200kInputHeader,
    size: 160,
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm tabular-nums">
        {row.original.costOver200kInput
          ? formatCost(row.original.costOver200kInput)
          : '-'}
      </span>
    ),
  },
  {
    accessorKey: 'costOver200kOutput',
    header: CostOver200kOutputHeader,
    size: 160,
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm tabular-nums">
        {row.original.costOver200kOutput
          ? formatCost(row.original.costOver200kOutput)
          : '-'}
      </span>
    ),
  },
  {
    accessorKey: 'costOver200kCacheRead',
    header: CostOver200kCacheReadHeader,
    size: 160,
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm tabular-nums">
        {row.original.costOver200kCacheRead
          ? formatCost(row.original.costOver200kCacheRead)
          : '-'}
      </span>
    ),
  },
  {
    accessorKey: 'modalitiesInput',
    header: ModalitiesInputHeader,
    size: 150,
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.modalitiesInput.map((m) => (
          <span key={m} className="px-1.5 py-0 text-[10px]">
            {m}
          </span>
        ))}
      </div>
    ),
  },
  {
    accessorKey: 'modalitiesOutput',
    header: ModalitiesOutputHeader,
    size: 150,
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.modalitiesOutput.map((m) => (
          <span key={m} className="px-1.5 py-0 text-[10px]">
            {m}
          </span>
        ))}
      </div>
    ),
  },
  {
    accessorKey: 'contextLimit',
    header: ContextLimitHeader,
    size: 130,
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm tabular-nums">
        {formatNumber(row.original.contextLimit)}
      </span>
    ),
  },
  {
    accessorKey: 'inputLimit',
    header: InputLimitHeader,
    size: 160,
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm tabular-nums">
        {formatNumber(row.original.inputLimit)}
      </span>
    ),
  },
  {
    accessorKey: 'outputLimit',
    header: OutputLimitHeader,
    size: 170,
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm tabular-nums">
        {formatNumber(row.original.outputLimit)}
      </span>
    ),
  },
  {
    accessorKey: 'knowledge',
    header: KnowledgeHeader,
    size: 175,
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {row.original.knowledge || '-'}
      </span>
    ),
  },
  {
    accessorKey: 'release_date',
    header: ReleaseDateHeader,
    size: 165,
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {formatDate(row.original.release_date)}
      </span>
    ),
  },
  {
    accessorKey: 'last_updated',
    header: LastUpdatedHeader,
    size: 165,
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {formatDate(row.original.last_updated)}
      </span>
    ),
  },
  {
    accessorKey: 'open_weights',
    header: OpenWeightsHeader,
    size: 120,
    cell: ({ row }) => <BooleanCell value={row.original.open_weights} />,
  },
  {
    accessorKey: 'reasoning',
    header: ReasoningHeader,
    size: 120,
    cell: ({ row }) => <BooleanCell value={row.original.reasoning} />,
  },
  {
    accessorKey: 'tool_call',
    header: ToolCallHeader,
    size: 120,
    cell: ({ row }) => <BooleanCell value={row.original.tool_call} />,
  },
  {
    accessorKey: 'attachment',
    header: AttachmentHeader,
    size: 150,
    cell: ({ row }) => <BooleanCell value={row.original.attachment} />,
  },
  {
    accessorKey: 'structuredOutput',
    header: StructuredOutputHeader,
    size: 160,
    cell: ({ row }) => <BooleanCell value={row.original.structuredOutput} />,
  },
]
