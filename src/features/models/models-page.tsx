'use client'

import { ColumnToggle } from './components/column-toggle'
import { ModelsTable } from './components/models-table'
import { SearchBar } from './components/search-bar'
import { FlatModel } from './helpers/data'
import { useModelData } from './helpers/use-model-data'
import { useColumnStore } from './store/use-column-store'

export function ModelsPageCore({ models }: { models: FlatModel[] }) {
  const { search, setSearch, filteredModels, resetFilters } =
    useModelData(models)

  const columnVisibility = useColumnStore((s) => s.visibility)

  return (
    <div className="flex h-screen w-full flex-col gap-3 p-4">
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

      <ModelsTable
        data={filteredModels}
        models={models}
        columnVisibility={columnVisibility}
        onResetFilters={resetFilters}
      />
    </div>
  )
}
