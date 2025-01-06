import type { GatheringPoint } from '../datasource/types';
import type Recipe from './recipe';

export default class Material {
  has = 0;
  own = 0;
  h2getTag = -1;
  /*
    无:         -1
    双色宝石:     0
    军票:        1
    最新神典石:   2
    金币:         2
    巧手(新):     3
    巧手(旧):     4
    大地(新):     5
    大地(旧):     6
    诗学神典石:    7
*/
  price = 0;
  fathers: { [key: string]: number } = {};
  // {itemID: amountPerItem}
  amount = 0;
  maxAmount = 0;
  id: string;
  name: string;
  icon?: number;
  isBasic: boolean;
  recipe: Recipe | null;
  gatheringPoint?: GatheringPoint;
  layer: number;
  maxLayer: number;

  constructor(
    id = '0',
    name = '',
    icon: number | undefined = undefined,
    isBasic = false,
    recipe: Recipe | null = null
  ) {
    this.id = id;
    this.name = name;
    this.icon = icon;
    this.isBasic = isBasic;
    this.recipe = recipe;
    this.layer = 0;
    this.maxLayer = -1;
  }
}
