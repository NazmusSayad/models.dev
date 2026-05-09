'use client'

import { Loader2, SearchX } from 'lucide-react'
import { useColumnStore } from './column-store'
import { ColumnToggle } from './column-toggle'
import { ModelsTable } from './models-table'
import { SearchBar } from './search-bar'
import { useFetchModels, useModelData } from './use-model-data'

export function ModelsPage() {
  const { models, loading } = useFetchModels()
  const {
    search,
    setSearch,
    filters,
    resetFilters,
    filteredModels,
    uniqueProviders,
    uniqueFamilies,
    uniqueModalities,
    activeCount,
    setProviders,
    setFamilies,
    setModalities,
    setOpenWeights,
    setReasoning,
    setToolCall,
    setAttachment,
  } = useModelData(models)

  const columnVisibility = useColumnStore((s) => s.visibility)

  if (loading) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-3">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
        <p className="text-muted-foreground text-sm">Loading models...</p>
      </div>
    )
  }

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
          columnVisibility={columnVisibility}
          filters={filters}
          setProviders={setProviders}
          setFamilies={setFamilies}
          setModalities={setModalities}
          setOpenWeights={setOpenWeights}
          setReasoning={setReasoning}
          setToolCall={setToolCall}
          setAttachment={setAttachment}
          uniqueProviders={uniqueProviders}
          uniqueFamilies={uniqueFamilies}
          uniqueModalities={uniqueModalities}
        />
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-md border">
          <SearchX className="text-muted-foreground h-10 w-10" />
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
