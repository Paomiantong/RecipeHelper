import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { forIn } from 'lodash-es'

import type Material from '@/calculator/model/material'
import { createMaterialGraph, createMaterialLayers } from '@/calculator/core/recipe'
import { calculateIngredients, calculateChanges } from '@/calculator/core/calculate'
import type { Item, MaterialGraph } from '@/calculator/core/types'
import Project from '@/calculator/model/project'

export const useCounterStore = defineStore('counter', () => {
  const materialGraph = ref<MaterialGraph>({})
  const materialLayers = ref<string[][]>([])
  const basicMaterals = ref<Material[]>([])
  const itemList = ref<Item[]>([])

  function reset() {
    materialGraph.value = {}
    materialLayers.value = []
    basicMaterals.value = []
    itemList.value = []
  }

  function calculate(id: string, changes: number) {
    if (materialGraph.value[id].own + changes < 0) changes = -materialGraph.value[id].own

    if (materialGraph.value[id].own + changes > materialGraph.value[id].maxAmount)
      changes = materialGraph.value[id].maxAmount - materialGraph.value[id].own

    materialGraph.value[id].own += changes
    calculateChanges(materialGraph.value[id], -changes)
  }

  function removeItem(id: string) {
    itemList.value = itemList.value.filter((v) => v.id !== id)
  }

  async function work() {
    const ret = await createMaterialGraph(itemList.value, false)
    materialGraph.value = ret
    materialLayers.value = createMaterialLayers(itemList.value, materialGraph.value)
    calculateIngredients(itemList.value, materialGraph.value)
    basicMaterals.value = []
    forIn(materialGraph.value, (v) => {
      if (v.isBasic) basicMaterals.value.push(v)
    })

    return materialGraph
  }

  async function loadProject(project: Project) {
    itemList.value = project.itemList
    const ret = await createMaterialGraph(project.itemList, false)
    materialGraph.value = ret
    materialLayers.value = createMaterialLayers(itemList.value, materialGraph.value)
    for (const key in project.ownAmountOfItems) {
      materialGraph.value[key].own = project.ownAmountOfItems[key]
    }
    calculateIngredients(itemList.value, materialGraph.value)
    basicMaterals.value = []
    forIn(materialGraph.value, (v) => {
      if (v.isBasic) basicMaterals.value.push(v)
    })
  }

  const materials = computed(() => Object.entries(materialGraph.value).map((v) => v[1]))

  const materialsWithlayer = computed(() => {
    const createData = (material: Material, layer: number) => {
      return {
        id: material.id,
        name: material.name,
        amount: material.amount,
        own: material.own,
        icon: material.icon,
        layer
      }
    }

    if (materialLayers.value.length === 0) return []
    const ret = []

    for (let i = 0; i < materialLayers.value.length; i++) {
      const layer = materialLayers.value[i]
      for (const j in layer) {
        ret.push(createData(materialGraph.value[layer[j]], i + 1))
      }
    }
    return ret
  })

  return {
    materialGraph,
    materialLayers,
    basicMaterals,
    itemList,
    calculate,
    work,
    removeItem,
    materials,
    materialsWithlayer,
    loadProject,
    reset
  }
})
