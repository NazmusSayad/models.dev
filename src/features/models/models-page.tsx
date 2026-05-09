'use client'

import { SearchRemoveIcon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import { ColumnToggle } from './components/column-toggle'
import { ModelsTable } from './components/models-table'
import { SearchBar } from './components/search-bar'
import { FlatModel } from './helpers/data'
import { useModelData } from './helpers/use-model-data'
import { useColumnStore } from './store/use-column-store'

export function ModelsPageCore({ models }: { models: FlatModel[] }) {
  const { search, setSearch, filteredModels, activeCount, resetFilters } =
    useModelData(models)

  const columnVisibility = useColumnStore((s) => s.visibility)

  return (
    <div className="flex h-screen w-full flex-col gap-3 p-4">
      {/* Top toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight">Models</h1>
          <span className="text-muted-foreground bg-muted rounded-full px-2.5 py-0.5 text-xs font-medium">
            {filteredModels.length.toLocaleString()} /{' '}
            {models.length.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <SearchBar value={search} onChange={setSearch} />
          <ColumnToggle />
        </div>
      </div>

      {/* Table */}
      {filteredModels.length > 0 ? (
        <ModelsTable
          data={filteredModels}
          models={models}
          columnVisibility={columnVisibility}
        />
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-md border">
          <HugeiconsIcon
            icon={SearchRemoveIcon}
            className="text-muted-foreground h-10 w-10"
          />
          <div className="text-center">
            <p className="text-foreground text-sm font-medium">
              No models found
            </p>
            <p className="text-muted-foreground text-xs">
              Try adjusting your search or filters
            </p>
          </div>
          {activeCount > 0 && (
            <button
              onClick={resetFilters}
              className="text-primary text-xs font-medium underline underline-offset-2 hover:opacity-80"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  )
}
