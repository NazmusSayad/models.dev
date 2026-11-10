import { TextCopyButton } from '@/components/copy-button'
import { formatNumberIntoHumanReadable } from '@/lib/number'
import { cn } from '@/lib/utils'
import {
  ArrowDown02Icon,
  ArrowUp02Icon,
  Cancel01Icon,
  CheckmarkCircle01Icon,
} from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { parseAsString, useQueryState } from 'nuqs'
import { useCallback } from 'react'
import { PricingTier } from '../helpers/data'

export function NumberValueRenderer({
  value,
  unit,
}: {
  value?: number | null
  unit: 'dollar' | 'number'
}) {
  if (value == null || Number.isNaN(value)) {
    return <span className="text-muted-foreground text-sm">-</span>
  }

  if (unit === 'dollar') {
    if (value === 0) {
      return <span className="text-muted-foreground text-sm">Free</span>
    }

    return (
      <span className="text-foreground text-sm font-thin tabular-nums">
        ${+value.toFixed(4)}
      </span>
    )
  }

  if (unit === 'number') {
    if (value === 0) {
      return <span className="text-muted-foreground text-sm">0</span>
    }

    return (
      <span className="text-foreground text-sm font-thin tabular-nums">
        {formatNumberIntoHumanReadable(value)}
      </span>
    )
  }

  throw new Error('Invalid unit')
}

export function BooleanCell({ value }: { value: boolean | null | undefined }) {
  if (value == null) {
    return <span className="text-muted-foreground text-sm">-</span>
  }

  return value ? (
    <HugeiconsIcon
      icon={CheckmarkCircle01Icon}
      className="h-4 w-4 text-emerald-500"
    />
  ) : (
    <HugeiconsIcon icon={Cancel01Icon} className="h-4 w-4 text-red-400" />
  )
}

const statusStyles: Record<string, string> = {
  active: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  beta: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  alpha: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
  deprecated: 'bg-red-500/10 text-red-600 dark:text-red-400',
}

export function StatusCell({ status }: { status: string }) {
  return (
    <span
      className={cn(
        'rounded px-1.5 py-0.5 text-[10px] font-medium capitalize',
        statusStyles[status] ?? 'bg-muted text-muted-foreground'
      )}
    >
      {status}
    </span>
  )
}

export function TypeCell({ type }: { type: string }) {
  return (
    <span className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 text-[10px] capitalize">
      {type}
    </span>
  )
}

export function FreeCell({ value }: { value: boolean | null }) {
  if (value == null) {
    return <span className="text-muted-foreground text-sm">-</span>
  }

  return (
    <span
      className={cn(
        'text-xs font-medium',
        value
          ? 'text-emerald-600 dark:text-emerald-400'
          : 'text-muted-foreground'
      )}
    >
      {value ? 'Free' : 'Paid'}
    </span>
  )
}

function formatCost(value?: number) {
  if (value == null) return '-'
  if (value === 0) return 'Free'
  return `$${+value.toFixed(4)}`
}

export function TierCell({ tiers }: { tiers: PricingTier[] }) {
  if (tiers.length === 0) {
    return <span className="text-muted-foreground text-sm">-</span>
  }

  const summary = tiers
    .map(
      (tier) =>
        `>${formatNumberIntoHumanReadable(tier.size)} ${formatCost(tier.input)}/${formatCost(tier.output)}`
    )
    .join(' · ')

  return (
    <span
      title={summary}
      className="text-muted-foreground truncate text-xs tabular-nums"
    >
      {tiers.length} {tiers.length === 1 ? 'tier' : 'tiers'} · {summary}
    </span>
  )
}

export function TagList({ values }: { values: string[] }) {
  if (values.length === 0) {
    return <span className="text-muted-foreground text-sm">-</span>
  }

  return (
    <div className="flex flex-wrap gap-1">
      {values.map((value) => (
        <span
          key={value}
          className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 text-[10px] capitalize"
        >
          {value.replaceAll('_', ' ')}
        </span>
      ))}
    </div>
  )
}

export function EnvCell({ values }: { values: string[] }) {
  if (values.length === 0) {
    return <span className="text-muted-foreground text-sm">-</span>
  }

  return (
    <div className="flex min-w-0 items-center gap-1">
      <span className="text-muted-foreground truncate text-sm">
        {values[0]}
      </span>
      {values.length > 1 && (
        <span className="text-muted-foreground shrink-0 text-[10px]">
          +{values.length - 1}
        </span>
      )}
      <span className="text-muted-foreground text-lg">
        <TextCopyButton text={values.join('\n')} tooltip={values.join(', ')} />
      </span>
    </div>
  )
}

function SortArrow({ sorted }: { sorted: false | 'asc' | 'desc' }) {
  if (sorted === 'asc') {
    return (
      <HugeiconsIcon
        strokeWidth={2}
        icon={ArrowUp02Icon}
        className="ml-1 size-4 opacity-60"
      />
    )
  }

  if (sorted === 'desc') {
    return (
      <HugeiconsIcon
        strokeWidth={2}
        icon={ArrowDown02Icon}
        className="ml-1 size-4 opacity-60"
      />
    )
  }

  return null
}

function useColumnSort(columnKey: string) {
  const [sort, setSort] = useQueryState('sort', parseAsString)
  const [dir, setDir] = useQueryState('dir', parseAsString)

  const sorted: false | 'asc' | 'desc' =
    sort === columnKey && (dir === 'asc' || dir === 'desc') ? dir : false

  const toggleSort = useCallback(() => {
    if (sort !== columnKey) {
      void setSort(columnKey)
      void setDir('asc')
    } else if (dir === 'asc') {
      void setDir('desc')
    } else {
      void setSort(null)
      void setDir(null)
    }
  }, [sort, dir, columnKey, setSort, setDir])

  return { sorted, toggleSort }
}

export function SortableHeader({
  label,
  columnKey,
}: {
  label: string
  columnKey: string
}) {
  const { sorted, toggleSort } = useColumnSort(columnKey)

  return (
    <button
      onClick={toggleSort}
      className="hover:text-foreground flex items-center truncate text-xs font-medium tracking-wider whitespace-nowrap uppercase select-none"
    >
      {label}
      <SortArrow sorted={sorted} />
    </button>
  )
}
