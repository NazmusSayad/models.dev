'use client'

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { ScrollArea as ScrollAreaPrimitive } from 'radix-ui'
import { memo, useRef } from 'react'
import { FlatModel } from '../helpers/data'
import { columns, ModelsContext } from './columns'

const ROW_HEIGHT = 44
const OVERSCAN = 10

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
            className="flex shrink-0 items-center truncate px-3 py-2 text-sm"
            style={{ width: cell.size }}
          >
            {cell.content}
          </div>
        ))}
      </div>
    )
  }
)
VirtualRow.displayName = 'VirtualRow'

interface ModelsTableProps {
  data: FlatModel[]
  models: FlatModel[]
  columnVisibility: VisibilityState
  onResetFilters: () => void
}

export function ModelsTable({
  data,
  models,
  columnVisibility,
  onResetFilters,
}: ModelsTableProps) {
  const viewportRef = useRef<HTMLDivElement>(null)

  const table = useReactTable({
    data,
    columns,
    state: { columnVisibility },
    getCoreRowModel: getCoreRowModel(),
  })

  const { rows } = table.getRowModel()

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => viewportRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: OVERSCAN,
  })

  const virtualItems = virtualizer.getVirtualItems()
  const tableWidth = table.getTotalSize()

  return (
    <ModelsContext.Provider value={models}>
      <ScrollAreaPrimitive.Root className="relative min-h-0 w-full flex-1 overflow-hidden rounded-md border">
        <ScrollAreaPrimitive.Viewport
          ref={viewportRef}
          className="size-full rounded-[inherit]"
        >
          <div
            className="bg-background sticky top-0 z-10 flex min-w-full border-b shadow-xs"
            style={{ width: tableWidth }}
          >
            {table.getHeaderGroups().map((headerGroup) =>
              headerGroup.headers.map((header) => (
                <div
                  key={header.id}
                  className="text-muted-foreground group flex shrink-0 grow-0 items-center truncate px-3 py-2.5 text-xs font-semibold tracking-wider whitespace-nowrap uppercase select-none"
                  style={{
                    width: header.getSize(),
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

          {rows.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center gap-3 py-16"
              style={{ width: tableWidth }}
            >
              <p className="text-muted-foreground text-sm">
                No models match the current filters
              </p>

              {onResetFilters && (
                <button
                  onClick={onResetFilters}
                  className="text-primary text-xs font-medium underline underline-offset-2 hover:opacity-80"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div
              className="relative min-w-full"
              style={{
                width: tableWidth,
                height: `${virtualizer.getTotalSize()}px`,
              }}
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
                      top: 0,
                      left: 0,
                      position: 'absolute',
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  />
                )
              })}
            </div>
          )}
        </ScrollAreaPrimitive.Viewport>

        <ScrollAreaPrimitive.ScrollAreaScrollbar
          orientation="vertical"
          className="flex touch-none p-px transition-colors select-none data-vertical:h-full data-vertical:w-2.5 data-vertical:border-l data-vertical:border-l-transparent"
        >
          <ScrollAreaPrimitive.ScrollAreaThumb className="bg-border relative flex-1 rounded-full" />
        </ScrollAreaPrimitive.ScrollAreaScrollbar>

        <ScrollAreaPrimitive.ScrollAreaScrollbar
          orientation="horizontal"
          className="flex touch-none p-px transition-colors select-none data-[orientation=horizontal]:h-2.5 data-[orientation=horizontal]:w-full"
        >
          <ScrollAreaPrimitive.ScrollAreaThumb className="bg-border relative flex-1 rounded-full" />
        </ScrollAreaPrimitive.ScrollAreaScrollbar>
        <ScrollAreaPrimitive.Corner />
      </ScrollAreaPrimitive.Root>
    </ModelsContext.Provider>
  )
}
