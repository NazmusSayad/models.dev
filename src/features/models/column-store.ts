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
  costInput: true,
  costOutput: true,
  contextLimit: true,
  outputLimit: true,
  modalitiesInput: true,
  modalitiesOutput: true,
  open_weights: true,
  reasoning: true,
  tool_call: true,
  attachment: true,
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
