import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { forIn, uniq } from 'lodash-es';

import { createMaterialGraph, createMaterialLayers } from '@/calculator/core/recipe';
import { calculateIngredients, calculateChanges } from '@/calculator/core/calculate';
import Project from '@/calculator/model/project';
import { currency } from '@/calculator/model/currency';

import type Material from '@/calculator/model/material';
import type { Item, MaterialGraph } from '@/calculator/core/types';
import type { GatheringPoint } from '@/calculator/datasource/types';

export const useCounterStore = defineStore('counter', () => {
  const materialGraph = ref<MaterialGraph>({});
  const materialLayers = ref<string[][]>([]);
  const itemList = ref<Item[]>([]);

  function reset() {
    materialGraph.value = {};
    materialLayers.value = [];
    itemList.value = [];
    console.log('RESET COUNTERSTORE');
  }

  function calculate(id: string, changes: number) {
    if (materialGraph.value[id].own + changes < 0) changes = -materialGraph.value[id].own;

    if (materialGraph.value[id].own + changes > materialGraph.value[id].maxAmount)
      changes = materialGraph.value[id].maxAmount - materialGraph.value[id].own;

    materialGraph.value[id].own += changes;
    calculateChanges(materialGraph.value[id], -changes);
  }

  function removeItem(id: string) {
    itemList.value = itemList.value.filter((v) => v.id !== id);
  }

  async function work() {
    const ret = await createMaterialGraph(itemList.value, false);
    materialGraph.value = ret;
    materialLayers.value = createMaterialLayers(itemList.value, materialGraph.value);
    calculateIngredients(itemList.value, materialGraph.value);
    console.log(materialGraph);
    return materialGraph;
  }

  async function loadProject(project: Project) {
    itemList.value = project.itemList;
    const ret = await createMaterialGraph(project.itemList, false);
    materialGraph.value = ret;
    materialLayers.value = createMaterialLayers(itemList.value, materialGraph.value);
    calculateIngredients(itemList.value, materialGraph.value);
    for (const key in project.ownAmountOfItems) {
      if (materialGraph.value[key]) {
        materialGraph.value[key].own = project.ownAmountOfItems[key];
        calculateChanges(materialGraph.value[key], -project.ownAmountOfItems[key]);
      }
    }
  }

  const materials = computed(() =>
    Object.entries(materialGraph.value)
      .map((v) => v[1])
      .sort((a, b) => a.maxLayer - b.maxLayer)
  );

  const materialsWithoutTarget = computed(() => materials.value.filter((v) => v.layer != 0));

  const basicMaterials = computed(() => materials.value.filter((v) => v.isBasic));

  const directMaterials = computed(() => materials.value.filter((v) => v.layer & 0x01));

  const materialsWithlayer = computed(() => {
    const createData = (material: Material, layer: number) => {
      return {
        material,
        layer
      };
    };

    if (materialLayers.value.length === 0) return [];
    const ret: ReturnType<typeof createData>[] = [];

    for (let i = 0; i < materialLayers.value.length; i++) {
      const layer = materialLayers.value[i];
      for (const j in layer) {
        ret.push(createData(materialGraph.value[layer[j]], i + 1));
      }
    }
    return ret;
  });

  const currency_statistics = computed(() => {
    const statistics = currency.map((v) => ({
      name: v.name,
      icon: `https://cafemaker.wakingsands.com/i/${v.icon}`,
      amount: 0
    }));
    forIn(materialGraph.value, (v) => {
      if (v.h2getTag != -1) {
        statistics[v.h2getTag].amount += v.price * v.amount;
      }
    });
    return statistics.filter((v) => v.amount != 0);
  });

  const gatheringPoints = computed(() => {
    return uniq(
      basicMaterials.value.filter((v) => v.gatheringPoint != undefined).map((v) => v.gatheringPoint)
    ) as GatheringPoint[];
  });

  return {
    materialGraph,
    materialLayers,
    itemList,
    materials,
    materialsWithoutTarget,
    directMaterials,
    basicMaterials,
    materialsWithlayer,
    currency_statistics,
    gatheringPoints,
    calculate,
    work,
    removeItem,
    loadProject,
    reset
  };
});
