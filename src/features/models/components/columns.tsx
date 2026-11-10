import { TextCopyButton } from '@/components/copy-button'
import { cn } from '@/lib/utils'
import {
  AudioWave01Icon,
  ExternalLink,
  Image01Icon,
  Pdf01Icon,
  TextIcon,
  Video01Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { ColumnDef } from '@tanstack/react-table'
import { formatDate } from '../helpers/column'
import { FlatModel } from '../helpers/data'
import {
  BooleanCell,
  EnvCell,
  FreeCell,
  NumberValueRenderer,
  SortableHeader,
  StatusCell,
  TagList,
  TierCell,
  TypeCell,
} from './column-components'

const modalityIconMap: Record<string, typeof TextIcon> = {
  text: TextIcon,
  image: Image01Icon,
  audio: AudioWave01Icon,
  video: Video01Icon,
  pdf: Pdf01Icon,
}

function ModalityCell({ modalities }: { modalities: string[] }) {
  return (
    <div className="flex flex-wrap gap-1">
      {modalities.map((modality) => {
        const icon = modalityIconMap[modality]
        return icon ? (
          <div key={modality} title={modality}>
            <HugeiconsIcon
              icon={icon}
              className="text-muted-foreground size-4"
            />
          </div>
        ) : (
          <span key={modality} className="text-[10px]">
            {modality}
          </span>
        )
      })}
    </div>
  )
}

function ExternalLinkCell({ href }: { href?: string }) {
  if (!href) {
    return <span className="text-muted-foreground text-sm">-</span>
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      title={href}
      className="text-muted-foreground hover:text-foreground flex min-w-0 items-center gap-1 text-sm"
    >
      <span className="truncate">{href.replace(/^https?:\/\//, '')}</span>
      <HugeiconsIcon icon={ExternalLink} className="size-3 shrink-0" />
    </a>
  )
}

export const columns: ColumnDef<FlatModel>[] = [
  {
    accessorKey: 'providerName',
    header: () => <SortableHeader label="Provider" columnKey="providerName" />,
    size: 200,
    cell: ({ row }) => {
      return (
        <div className="grid grid-cols-[auto_auto] gap-2">
          <span className="text-foreground truncate text-sm">
            {row.original.providerName}
          </span>

          <span className="text-muted-foreground text-lg">
            <TextCopyButton text={row.original.providerId} />
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'name',
    header: () => <SortableHeader label="Model" columnKey="name" />,
    size: 360,
    cell: ({ row }) => (
      <div className="grid grid-cols-[auto_auto] gap-2">
        <span
          title={row.original.name}
          className={cn(
            'text-foreground truncate text-sm',
            row.original.status === 'deprecated' &&
              'text-muted-foreground line-through'
          )}
        >
          {row.original.name}
        </span>

        <span className="text-muted-foreground text-lg">
          <TextCopyButton text={row.original.id} />
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'family',
    header: () => <SortableHeader label="Family" columnKey="family" />,
    size: 150,
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {row.original.family || '-'}
      </span>
    ),
  },
  {
    accessorKey: 'type',
    header: () => <SortableHeader label="Type" columnKey="type" />,
    size: 110,
    cell: ({ row }) => <TypeCell type={row.original.type} />,
  },
  {
    accessorKey: 'status',
    header: () => <SortableHeader label="Status" columnKey="status" />,
    size: 120,
    cell: ({ row }) => <StatusCell status={row.original.status} />,
  },
  {
    accessorKey: 'description',
    header: () => (
      <SortableHeader label="Description" columnKey="description" />
    ),
    size: 300,
    cell: ({ row }) => (
      <span
        title={row.original.description}
        className="text-muted-foreground truncate text-sm"
      >
        {row.original.description || '-'}
      </span>
    ),
  },
  {
    accessorKey: 'canonicalModelId',
    header: () => (
      <SortableHeader label="Canonical" columnKey="canonicalModelId" />
    ),
    size: 250,
    cell: ({ row }) =>
      row.original.canonicalModelId ? (
        <div className="grid grid-cols-[auto_auto] gap-2">
          <span
            title={row.original.canonicalModelId}
            className="text-muted-foreground truncate text-sm"
          >
            {row.original.canonicalModelId}
          </span>
          <span className="text-muted-foreground text-lg">
            <TextCopyButton text={row.original.canonicalModelId} />
          </span>
        </div>
      ) : (
        <span className="text-muted-foreground text-sm">-</span>
      ),
  },
  {
    accessorKey: 'costInput',
    header: () => <SortableHeader label="Input Cost" columnKey="costInput" />,
    size: 140,
    cell: ({ row }) => (
      <NumberValueRenderer unit="dollar" value={row.original.costInput} />
    ),
  },
  {
    accessorKey: 'costOutput',
    header: () => <SortableHeader label="Output Cost" columnKey="costOutput" />,
    size: 150,
    cell: ({ row }) => (
      <NumberValueRenderer unit="dollar" value={row.original.costOutput} />
    ),
  },
  {
    accessorKey: 'costCacheRead',
    header: () => (
      <SortableHeader label="Cache Read" columnKey="costCacheRead" />
    ),
    size: 140,
    cell: ({ row }) => (
      <NumberValueRenderer unit="dollar" value={row.original.costCacheRead} />
    ),
  },
  {
    accessorKey: 'costCacheWrite',
    header: () => (
      <SortableHeader label="Cache Write" columnKey="costCacheWrite" />
    ),
    size: 150,
    cell: ({ row }) => (
      <NumberValueRenderer unit="dollar" value={row.original.costCacheWrite} />
    ),
  },
  {
    accessorKey: 'costOver200kInput',
    header: () => (
      <SortableHeader label=">200k Input" columnKey="costOver200kInput" />
    ),
    size: 160,
    cell: ({ row }) => (
      <NumberValueRenderer
        unit="dollar"
        value={row.original.costOver200kInput}
      />
    ),
  },
  {
    accessorKey: 'costOver200kOutput',
    header: () => (
      <SortableHeader label=">200k Output" columnKey="costOver200kOutput" />
    ),
    size: 160,
    cell: ({ row }) => (
      <NumberValueRenderer
        unit="dollar"
        value={row.original.costOver200kOutput}
      />
    ),
  },
  {
    accessorKey: 'costOver200kCacheRead',
    header: () => (
      <SortableHeader
        label=">200k Cache Read"
        columnKey="costOver200kCacheRead"
      />
    ),
    size: 160,
    cell: ({ row }) => (
      <NumberValueRenderer
        unit="dollar"
        value={row.original.costOver200kCacheRead}
      />
    ),
  },
  {
    accessorKey: 'costOver200kCacheWrite',
    header: () => (
      <SortableHeader
        label=">200k Cache Write"
        columnKey="costOver200kCacheWrite"
      />
    ),
    size: 160,
    cell: ({ row }) => (
      <NumberValueRenderer
        unit="dollar"
        value={row.original.costOver200kCacheWrite}
      />
    ),
  },
  {
    accessorKey: 'costReasoning',
    header: () => (
      <SortableHeader label="Reasoning Cost" columnKey="costReasoning" />
    ),
    size: 160,
    cell: ({ row }) => (
      <NumberValueRenderer unit="dollar" value={row.original.costReasoning} />
    ),
  },
  {
    accessorKey: 'costInputAudio',
    header: () => (
      <SortableHeader label="Audio Input" columnKey="costInputAudio" />
    ),
    size: 150,
    cell: ({ row }) => (
      <NumberValueRenderer unit="dollar" value={row.original.costInputAudio} />
    ),
  },
  {
    accessorKey: 'costOutputAudio',
    header: () => (
      <SortableHeader label="Audio Output" columnKey="costOutputAudio" />
    ),
    size: 150,
    cell: ({ row }) => (
      <NumberValueRenderer unit="dollar" value={row.original.costOutputAudio} />
    ),
  },
  {
    accessorKey: 'isFree',
    header: () => <SortableHeader label="Pricing" columnKey="isFree" />,
    size: 110,
    cell: ({ row }) => <FreeCell value={row.original.isFree} />,
  },
  {
    accessorKey: 'tierCount',
    header: () => (
      <SortableHeader label="Pricing Tiers" columnKey="tierCount" />
    ),
    size: 280,
    cell: ({ row }) => <TierCell tiers={row.original.tiers} />,
  },
  {
    accessorKey: 'contextLimit',
    header: () => (
      <SortableHeader label="Context Limit" columnKey="contextLimit" />
    ),
    size: 160,
    cell: ({ row }) => (
      <NumberValueRenderer unit="number" value={row.original.contextLimit} />
    ),
  },
  {
    accessorKey: 'inputLimit',
    header: () => <SortableHeader label="Input Limit" columnKey="inputLimit" />,
    size: 160,
    cell: ({ row }) => (
      <NumberValueRenderer unit="number" value={row.original.inputLimit} />
    ),
  },
  {
    accessorKey: 'outputLimit',
    header: () => (
      <SortableHeader label="Output Limit" columnKey="outputLimit" />
    ),
    size: 160,
    cell: ({ row }) => (
      <NumberValueRenderer unit="number" value={row.original.outputLimit} />
    ),
  },
  {
    accessorKey: 'modalitiesInput',
    header: () => <SortableHeader label="Input" columnKey="modalitiesInput" />,
    size: 150,
    cell: ({ row }) => (
      <ModalityCell modalities={row.original.modalitiesInput} />
    ),
  },
  {
    accessorKey: 'modalitiesOutput',
    header: () => (
      <SortableHeader label="Output" columnKey="modalitiesOutput" />
    ),
    size: 150,
    cell: ({ row }) => (
      <ModalityCell modalities={row.original.modalitiesOutput} />
    ),
  },
  {
    accessorKey: 'temperature',
    header: () => (
      <SortableHeader label="Temperature" columnKey="temperature" />
    ),
    size: 140,
    cell: ({ row }) => <BooleanCell value={row.original.temperature} />,
  },
  {
    accessorKey: 'reasoning',
    header: () => <SortableHeader label="Reason" columnKey="reasoning" />,
    size: 110,
    cell: ({ row }) => <BooleanCell value={row.original.reasoning} />,
  },
  {
    accessorKey: 'reasoningOptions',
    header: () => (
      <SortableHeader label="Reasoning Options" columnKey="reasoningOptions" />
    ),
    size: 220,
    cell: ({ row }) => <TagList values={row.original.reasoningOptions} />,
  },
  {
    accessorKey: 'tool_call',
    header: () => <SortableHeader label="Tools" columnKey="tool_call" />,
    size: 110,
    cell: ({ row }) => <BooleanCell value={row.original.tool_call} />,
  },
  {
    accessorKey: 'attachment',
    header: () => <SortableHeader label="Attachment" columnKey="attachment" />,
    size: 130,
    cell: ({ row }) => <BooleanCell value={row.original.attachment} />,
  },
  {
    accessorKey: 'structuredOutput',
    header: () => (
      <SortableHeader label="Structured" columnKey="structuredOutput" />
    ),
    size: 130,
    cell: ({ row }) => <BooleanCell value={row.original.structuredOutput} />,
  },
  {
    accessorKey: 'open_weights',
    header: () => <SortableHeader label="Open" columnKey="open_weights" />,
    size: 110,
    cell: ({ row }) => <BooleanCell value={row.original.open_weights} />,
  },
  {
    accessorKey: 'interleaved',
    header: () => (
      <SortableHeader label="Interleaved" columnKey="interleaved" />
    ),
    size: 190,
    cell: ({ row }) => (
      <span className="text-muted-foreground truncate text-sm">
        {row.original.interleaved || '-'}
      </span>
    ),
  },
  {
    accessorKey: 'knowledge',
    header: () => <SortableHeader label="Knowledge" columnKey="knowledge" />,
    size: 175,
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {row.original.knowledge || '-'}
      </span>
    ),
  },
  {
    accessorKey: 'release_date',
    header: () => <SortableHeader label="Released" columnKey="release_date" />,
    size: 165,
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {formatDate(row.original.release_date)}
      </span>
    ),
  },
  {
    accessorKey: 'last_updated',
    header: () => <SortableHeader label="Updated" columnKey="last_updated" />,
    size: 165,
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {formatDate(row.original.last_updated)}
      </span>
    ),
  },
  {
    accessorKey: 'providerApi',
    header: () => <SortableHeader label="API" columnKey="providerApi" />,
    size: 240,
    cell: ({ row }) => <ExternalLinkCell href={row.original.providerApi} />,
  },
  {
    accessorKey: 'providerDoc',
    header: () => <SortableHeader label="Docs" columnKey="providerDoc" />,
    size: 220,
    cell: ({ row }) => <ExternalLinkCell href={row.original.providerDoc} />,
  },
  {
    accessorKey: 'providerEnv',
    header: () => <SortableHeader label="Env" columnKey="providerEnv" />,
    size: 220,
    cell: ({ row }) => <EnvCell values={row.original.providerEnv} />,
  },
  {
    accessorKey: 'providerNpm',
    header: () => <SortableHeader label="SDK" columnKey="providerNpm" />,
    size: 220,
    cell: ({ row }) =>
      row.original.providerNpm ? (
        <div className="grid grid-cols-[auto_auto] gap-2">
          <span
            title={row.original.providerNpm}
            className="text-muted-foreground truncate text-sm"
          >
            {row.original.providerNpm}
          </span>
          <span className="text-muted-foreground text-lg">
            <TextCopyButton text={row.original.providerNpm} />
          </span>
        </div>
      ) : (
        <span className="text-muted-foreground text-sm">-</span>
      ),
  },
]
