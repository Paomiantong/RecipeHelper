import type { GatheringPoint } from '../database/database'
import type Recipe from './recipe'

export default class Material {
  has = 0
  own = 0
  h2getTag = -1
  /*
    无:        -1
    双色宝石:   0
    军票:       1
    经典神电石：2
    金币：      2
    巧手白票:   3
    巧手紫票：  4
    大地白票：  5
    大地紫票：  6
*/
  price = 0
  fathers: { [key: string]: number } = {}
  // {itemID: amountPerItem}
  amount = 0
  maxAmount = 0
  id: string
  name: string
  icon?: number
  isBasic: boolean
  recipe: Recipe | null
  gatheringPoint?: GatheringPoint

  constructor(
    id = '0',
    name = '',
    icon: number | undefined = undefined,
    isBasic = false,
    recipe: Recipe | null = null
  ) {
    this.id = id
    this.name = name
    this.icon = icon

    this.isBasic = isBasic
    this.recipe = recipe
  }
}
