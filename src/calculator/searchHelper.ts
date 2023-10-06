import { items } from './database'
import { take } from 'lodash'
import Fuse from 'fuse.js'

const loadedItems = (await items()).default

const fuse = new Fuse(loadedItems, {
  keys: ['name', 'job', 'id']
})

export function searchRecipe(name: string) {
  if (name.length > 15) return []
  return take(fuse.search(name), 10).map((v) => v.item)
}
