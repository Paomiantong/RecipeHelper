import { uniq } from 'lodash-es'

import { linkGatheringPoint } from './gatheringPoint'

import Material from '../model/material'
import Recipe from '../model/recipe'
import { materials, basicIngredient } from '../database'
import { setItemH2getTag } from '../itemHelper'
import { Queue } from '../utils'

import type { MaterialDB, BasicIngredientDB } from '../database/database'
import type { Item, MaterialGraph } from './types'

export async function createMaterialGraph(itemList: Item[], includingCrystal = false) {
  const materialGraph: MaterialGraph = {}

  for (const index in itemList) {
    await loadRecipe(itemList[index].id as string, includingCrystal, materialGraph)
  }
  await linkGatheringPoint(materialGraph)
  return materialGraph
}

export function createMaterialLayers(itemList: Item[], materialGraph: MaterialGraph) {
  const queue = new Queue<string>()
  const materialLayers: string[][] = []
  let layer = 0
  for (const index in itemList) {
    queue.enqueue(itemList[index].id as string)
  }
  queue.enqueue('#')

  while (!queue.isEmpty()) {
    const current = queue.front()
    queue.dequeue()
    if (current !== '#') {
      if (layer > 0) {
        materialLayers[layer - 1].push(current)
      }
      if (materialGraph[current].recipe === null) continue
      for (const index in materialGraph[current].recipe!.ingredients) {
        const id = materialGraph[current].recipe!.ingredients[index][0].id
        queue.enqueue(id)
      }
    } else {
      if (queue.isEmpty()) break
      layer++
      materialLayers[layer - 1] = []
      queue.enqueue('#')
    }
  }
  for (const i in materialLayers) {
    materialLayers[i] = uniq(materialLayers[i])
  }
  return materialLayers
}

export async function loadRecipe(
  id: string,
  includingCrystal: boolean,
  materialGraph: MaterialGraph
) {
  // 加载数据
  const loadedMaterials: MaterialDB = (await materials()).default
  const loadedBasicIngredient: BasicIngredientDB = (await basicIngredient()).default

  // 初始化队列
  const queue = new Queue<[string, string | null, number]>()
  queue.enqueue([id, null, 1])

  while (!queue.isEmpty()) {
    const [id, fid, amount] = queue.dequeue()!
    let ingredients: { [Key: string]: number } = {}

    // 创建节点
    if (!materialGraph[id]) {
      if (loadedMaterials[id] !== undefined) {
        const materialMeta = loadedMaterials[id][0]

        materialGraph[id] = new Material(
          id,
          materialMeta.name,
          materialMeta.icon,
          false,
          new Recipe()
        )
        materialGraph[id].recipe!.resultAmount = materialMeta.resultAmount
        ingredients = materialMeta.ingredient
      } else {
        // 基础素材
        materialGraph[id] = new Material(
          id,
          loadedBasicIngredient[id][0] as string,
          loadedBasicIngredient[id][1] as number,
          true,
          null
        )
        // 兑换方式
        setItemH2getTag(materialGraph[id])
      }
    }

    if (fid !== null) {
      // 标记该材料是谁的子材料,并表明数量
      materialGraph[id].fathers[fid] = amount
      // 添加材料
      materialGraph[fid].recipe!.ingredients.push([materialGraph[id], amount])
    }

    // 记录所需材料
    for (const ingredientId in ingredients) {
      // 是否计算水晶
      if (!includingCrystal) {
        if (parseInt(ingredientId) < 20 && parseInt(ingredientId) > 1) continue
      }
      queue.enqueue([ingredientId, id, ingredients[ingredientId]])
    }
  }
}
