import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ColumnStore {
  visibility: Record<string, boolean>
  toggle: (id: string) => void
  reset: () => void
  setVisibility: (visibility: Record<string, boolean>) => void
}

const defaultVisibility: Record<string, boolean> = {
  providerName: true,
  name: true,
  family: true,
  status: true,
  costInput: true,
  costOutput: true,
  costCacheRead: true,
  costCacheWrite: true,
  costOver200kInput: true,
  costOver200kOutput: true,
  costOver200kCacheRead: true,
  contextLimit: true,
  inputLimit: true,
  outputLimit: true,
  knowledge: true,
  release_date: true,
  last_updated: true,
  modalitiesInput: true,
  modalitiesOutput: true,
  open_weights: true,
  reasoning: true,
  tool_call: true,
  attachment: true,
  structuredOutput: true,
}

export const useColumnStore = create<ColumnStore>()(
  persist(
    (set) => ({
      visibility: defaultVisibility,
      toggle: (id) =>
        set((state) => ({
          visibility: {
            ...state.visibility,
            [id]: !state.visibility[id],
          },
        })),
      reset: () => set({ visibility: defaultVisibility }),
      setVisibility: (visibility) => set({ visibility }),
    }),
    {
      name: 'models-column-visibility',
    }
  )
)
