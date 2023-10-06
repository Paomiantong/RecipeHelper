import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { forIn } from 'lodash'

import type Material from '@/calculator/model/material'
import { createMaterialGraph, createMaterialLayers } from '@/calculator/core/recipe'
import { calculateIngredients, calculateChanges } from '@/calculator/core/calculate'
import type { MaterialGraph } from '@/calculator/core/core'

export const useCounterStore = defineStore('counter', () => {
  const materialGraph = ref<MaterialGraph>({})
  const materialLayers = ref<string[][]>([])
  const basicMaterals = ref<Material[]>([])

  const itemList = ref([
    { id: 1838, name: '\u9ed1\u94c1\u6218\u621f', amount: 3 },
    { id: 1915, name: '\u68a3\u6728\u9a91\u5175\u5f13', amount: 3 },
    { id: 2464, name: '\u7ea2\u6728\u7eba\u8f66', amount: 3 },
    { id: 2039, name: '\u7fe1\u7fe0\u624b\u6756', amount: 3 },
    { id: 10610, name: '\u96ea\u677e\u957f\u5f13', amount: 3 },
    { id: 12581, name: '\u6697\u6817\u6728\u6728\u6750', amount: 3 },
    {
      id: 10799,
      name: '\u795d\u5723\u6817\u6728\u7cbe\u51c6\u5047\u9762',
      amount: 3
    },
    { id: 19925, name: '\u5c71\u6bdb\u6989\u6728\u6750', amount: 6 },
    { id: 19730, name: '\u843d\u53f6\u677e\u624b\u94fe', amount: 3 },
    { id: 18353, name: '\u677e\u6728\u7267\u6756', amount: 3 },
    { id: 18661, name: '\u6989\u6728\u957f\u5f13', amount: 3 },
    { id: 27203, name: '\u767d\u6a61\u6728\u9879\u94fe', amount: 9 },
    { id: 25796, name: '\u4ed9\u679c\u6728\u7267\u6756', amount: 6 },
    { id: 27219, name: '\u767d\u68a3\u6728\u624b\u956f', amount: 6 },
    { id: 26112, name: '\u6c99\u67da\u6728\u957f\u5f13', amount: 6 },
    { id: 27227, name: '\u6108\u75ae\u6728\u8033\u5760', amount: 9 },
    { name: '矮人银镐', job: '锻铁匠', id: '26268', amount: 1 },
    { name: '矮人银锭', job: '锻铁匠', id: '27714', amount: 1 }
  ])

  function calculate(id: string, changes: number) {
    if (materialGraph.value[id].own + changes < 0) changes = -materialGraph.value[id].own

    if (materialGraph.value[id].own + changes > materialGraph.value[id].maxAmount)
      changes = materialGraph.value[id].maxAmount - materialGraph.value[id].own

    materialGraph.value[id].own += changes
    calculateChanges(materialGraph.value[id], -changes)
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
    materials,
    materialsWithlayer
  }
})
