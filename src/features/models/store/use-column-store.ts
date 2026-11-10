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
  type: false,
  status: false,
  description: false,
  canonicalModelId: false,
  costInput: true,
  costOutput: true,
  costCacheRead: true,
  costCacheWrite: true,
  costOver200kInput: false,
  costOver200kOutput: false,
  costOver200kCacheRead: false,
  costOver200kCacheWrite: false,
  costReasoning: false,
  costInputAudio: false,
  costOutputAudio: false,
  isFree: false,
  tierCount: false,
  contextLimit: true,
  inputLimit: true,
  outputLimit: true,
  modalitiesInput: true,
  modalitiesOutput: true,
  temperature: false,
  reasoning: false,
  reasoningOptions: false,
  tool_call: false,
  attachment: false,
  structuredOutput: false,
  open_weights: false,
  interleaved: false,
  knowledge: false,
  release_date: true,
  last_updated: false,
  providerApi: false,
  providerDoc: false,
  providerEnv: false,
  providerNpm: false,
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
      version: 2,
      migrate: (persistedState, version) => {
        const persisted = persistedState as
          | { visibility?: Record<string, boolean> }
          | undefined

        return {
          ...persisted,
          visibility: {
            ...defaultVisibility,
            ...persisted?.visibility,
            ...(version < 2 ? { status: false } : {}),
          },
        } as ColumnStore
      },
    }
  )
)
