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
  family: false,
  status: false,
  costInput: true,
  costOutput: true,
  costCacheRead: true,
  costCacheWrite: true,
  costOver200kInput: false,
  costOver200kOutput: false,
  costOver200kCacheRead: false,
  costOver200kCacheWrite: false,
  contextLimit: true,
  inputLimit: true,
  outputLimit: true,
  release_date: true,
  knowledge: false,
  last_updated: false,
  modalitiesInput: true,
  modalitiesOutput: true,
  open_weights: false,
  reasoning: false,
  tool_call: false,
  attachment: false,
  structuredOutput: false,
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
