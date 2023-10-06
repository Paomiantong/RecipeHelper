import { items } from './database'
import { take } from 'lodash'
import Fuse from 'fuse.js'

const fuse = new Fuse((await items()).default, {
  keys: ['name', 'job', 'id']
})

export function searchRecipe(name: string) {
  if (name.length > 15) return []
  return take(fuse.search(name), 10).map((v) => v.item)
}
