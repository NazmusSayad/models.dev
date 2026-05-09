import { createContext } from 'react'
import { FlatModel } from '../helpers/data'

export const ModelsContext = createContext<FlatModel[]>([])
