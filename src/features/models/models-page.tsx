'use client'

import { Input } from '@/components/ui/input'
import { Cancel01Icon, Search01Icon } from '@hugeicons/core-free-icons'
import { HugeiconsIcon } from '@hugeicons/react'
import Link from 'next/link'
import { ColumnToggle } from './components/column-toggle'
import { ModelsTable } from './components/models-table'
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
          <Link href="/">
            <h1 className="font-semibold tracking-[-.5px] uppercase">
              Models.
              <span className="text-muted-foreground line-through">sayad</span>
              .dev
            </h1>
          </Link>

          <span className="text-muted-foreground bg-muted rounded-full px-2.5 py-0.5 text-xs">
            {filteredModels.length.toLocaleString()} /{' '}
            {models.length.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-full max-w-sm">
            <HugeiconsIcon
              icon={Search01Icon}
              className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2"
            />

            <Input
              type="text"
              placeholder="Search models, providers, families..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-background h-8 rounded-md border pr-8 pl-9 text-sm shadow-sm transition-colors focus-visible:ring-1"
            />

            {search && (
              <button
                onClick={() => setSearch('')}
                className="text-muted-foreground hover:text-foreground absolute top-1.5 right-2 flex h-5 w-5 items-center justify-center rounded-sm"
              >
                <HugeiconsIcon icon={Cancel01Icon} className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

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
