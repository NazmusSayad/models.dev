'use client'

import { Loader2 } from 'lucide-react'
import { FilterPanel } from './filter-panel'
import { ModelsTable } from './models-table'
import { SearchBar } from './search-bar'
import { useFetchModels, useModelData } from './use-model-data'

export function ModelsPage() {
  const { models, loading } = useFetchModels()
  const {
    search,
    setSearch,
    filters,
    toggleFilter,
    toggleArrayFilter,
    resetFilters,
    filteredModels,
    uniqueProviders,
    uniqueFamilies,
    uniqueModalities,
  } = useModelData(models)

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex h-screen w-full flex-col gap-3 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold tracking-tight">Models</h1>
          <span className="text-muted-foreground text-sm">
            {filteredModels.length.toLocaleString()} /{' '}
            {models.length.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <SearchBar value={search} onChange={setSearch} />
          <FilterPanel
            filters={filters}
            toggleArrayFilter={toggleArrayFilter}
            toggleFilter={toggleFilter}
            resetFilters={resetFilters}
            uniqueProviders={uniqueProviders}
            uniqueFamilies={uniqueFamilies}
            uniqueModalities={uniqueModalities}
          />
        </div>
      </div>
      <ModelsTable data={filteredModels} />
    </div>
  )
}
