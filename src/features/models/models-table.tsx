'use client'

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { ScrollArea as ScrollAreaPrimitive } from 'radix-ui'
import { memo, useRef, useState } from 'react'
import { useColumns, UseColumnsProps } from './columns'
import { FlatModel } from './types'

const ROW_HEIGHT = 44
const OVERSCAN = 10

interface ModelsTableProps extends UseColumnsProps {
  data: FlatModel[]
  columnVisibility: VisibilityState
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
        className="border-border/50 hover:bg-muted/60 flex w-full border-b transition-colors"
      >
        {cells.map((cell) => (
          <div
            key={cell.id}
            className="flex items-center truncate px-3 py-2 text-sm"
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

export function ModelsTable({
  data,
  columnVisibility,
  ...columnProps
}: ModelsTableProps) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const [sorting, setSorting] = useState<SortingState>([])
  const columns = useColumns(columnProps)

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnVisibility },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  const { rows } = table.getRowModel()

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => viewportRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: OVERSCAN,
  })

  const virtualItems = virtualizer.getVirtualItems()

  return (
    <ScrollAreaPrimitive.Root className="relative min-h-0 w-full flex-1 overflow-hidden rounded-md border">
      <ScrollAreaPrimitive.Viewport
        ref={viewportRef}
        className="size-full rounded-[inherit]"
      >
        {/* Sticky header */}
        <div className="bg-background sticky top-0 z-10 flex w-full border-b shadow-xs">
          {table.getHeaderGroups().map((headerGroup) =>
            headerGroup.headers.map((header) => (
              <div
                key={header.id}
                className="text-muted-foreground flex items-center px-3 py-2.5 text-xs font-semibold tracking-wider uppercase select-none"
                style={{
                  width: header.getSize(),
                  minWidth: header.getSize(),
                  maxWidth: header.getSize(),
                }}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
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
              content: flexRender(
                cell.column.columnDef.cell,
                cell.getContext()
              ),
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
      </ScrollAreaPrimitive.Viewport>
      <ScrollAreaPrimitive.ScrollAreaScrollbar
        orientation="vertical"
        className="flex touch-none p-px transition-colors select-none data-vertical:h-full data-vertical:w-2.5 data-vertical:border-l data-vertical:border-l-transparent"
      >
        <ScrollAreaPrimitive.ScrollAreaThumb className="bg-border relative flex-1 rounded-full" />
      </ScrollAreaPrimitive.ScrollAreaScrollbar>
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
}
