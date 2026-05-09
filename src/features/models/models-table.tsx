'use client'

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { memo, useRef, useState } from 'react'
import { columns } from './columns'
import { FlatModel } from './types'

const ROW_HEIGHT = 40
const OVERSCAN = 10

interface ModelsTableProps {
  data: FlatModel[]
}

const VirtualRow = memo(
  ({
    cells,
    style,
  }: {
    cells: { id: string; size: number; content: React.ReactNode }[]
    style: React.CSSProperties
  }) => {
    return (
      <div
        style={style}
        className="border-border/60 hover:bg-muted/50 flex w-full border-b transition-colors"
      >
        {cells.map((cell) => (
          <div
            key={cell.id}
            className="flex items-center truncate px-2 py-1 text-sm"
            style={{
              width: cell.size,
              minWidth: cell.size,
              maxWidth: cell.size,
            }}
          >
            {cell.content}
          </div>
        ))}
      </div>
    )
  }
)
VirtualRow.displayName = 'VirtualRow'

export function ModelsTable({ data }: ModelsTableProps) {
  const parentRef = useRef<HTMLDivElement>(null)
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const { rows } = table.getRowModel()

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: OVERSCAN,
  })

  const virtualItems = virtualizer.getVirtualItems()

  return (
    <div
      ref={parentRef}
      className="relative min-h-0 w-full flex-1 overflow-auto rounded-md border"
    >
      {/* Sticky header */}
      <div className="bg-background sticky top-0 z-10 flex w-full border-b shadow-sm">
        {table.getHeaderGroups().map((headerGroup) =>
          headerGroup.headers.map((header) => (
            <div
              key={header.id}
              className="text-muted-foreground flex cursor-pointer items-center px-2 py-2 text-xs font-semibold tracking-wider uppercase select-none"
              style={{
                width: header.getSize(),
                minWidth: header.getSize(),
                maxWidth: header.getSize(),
              }}
              onClick={header.column.getToggleSortingHandler()}
            >
              {header.isPlaceholder
                ? null
                : flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
              {{
                asc: ' ↑',
                desc: ' ↓',
              }[header.column.getIsSorted() as string] ?? null}
            </div>
          ))
        )}
      </div>

      {/* Virtual body */}
      <div
        className="relative w-full"
        style={{ height: `${virtualizer.getTotalSize()}px` }}
      >
        {virtualItems.map((virtualRow) => {
          const row = rows[virtualRow.index]
          if (!row) return null
          const cells = row.getVisibleCells().map((cell) => ({
            id: cell.id,
            size: cell.column.getSize(),
            content: flexRender(cell.column.columnDef.cell, cell.getContext()),
          }))
          return (
            <VirtualRow
              key={row.id}
              cells={cells}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                transform: `translateY(${virtualRow.start}px)`,
                height: `${virtualRow.size}px`,
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
