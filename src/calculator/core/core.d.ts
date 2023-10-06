import type Material from '../model/material'

export interface MaterialGraph {
  [x: string]: Material
}

export interface Item {
  id: string | number
  name: string
  amount: number
}
