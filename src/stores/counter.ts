import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { forIn } from 'lodash-es'

import type Material from '@/calculator/model/material'
import { createMaterialGraph, createMaterialLayers } from '@/calculator/core/recipe'
import { calculateIngredients, calculateChanges } from '@/calculator/core/calculate'
import type { Item, MaterialGraph } from '@/calculator/core/core'

export const useCounterStore = defineStore('counter', () => {
  const materialGraph = ref<MaterialGraph>({})
  const materialLayers = ref<string[][]>([])
  const basicMaterals = ref<Material[]>([])
  const itemList = ref<Item[]>([])

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

  function save() {
    const data = {
      materialGraph: materialGraph.value,
      materialLayers: materialLayers.value,
      basicMaterals: basicMaterals.value,
      itemList: itemList.value
    }
    console.log(JSON.stringify(data))
    localStorage.setItem('project', JSON.stringify(data))
  }

  //   async function loadProject(project) {
  //     const materialGraph = await createMaterialGraph(project.itemList, false)
  //     runInAction(() => {
  //       this.itemList = project.itemList
  //       this.materialGraph = materialGraph
  //       this.materialLayers = createMaterialLayers(this.itemList, this.materialGraph)
  //       for (const key in project.ownAmountOfItems) {
  //         this.materialGraph[key].own = project.ownAmountOfItems[key]
  //       }
  //       calculateIngredients(this.itemList, this.materialGraph)
  //       this.basicMaterals = []
  //       forIn(this.materialGraph, (v) => {
  //         if (v.isBasic) this.basicMaterals.push(v)
  //       })
  //     })
  //   }

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
    save,
    removeItem,
    materials,
    materialsWithlayer
  }
})
