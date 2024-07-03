import { uniq } from 'lodash-es';

import { linkGatheringPoint } from './gatheringPoint';

import Material from '../model/material';
import Recipe from '../model/recipe';
import { materials, basicIngredient } from '../datasource';
import { setItemH2getTag } from '../itemHelper';
import { Queue } from '../utils';

import type { MaterialDataSource, BasicIngredientDataSource } from '../datasource/types';
import type { Item, MaterialGraph } from './types';

export async function createMaterialGraph(itemList: Item[], includingCrystal = false) {
  const materialGraph: MaterialGraph = {};

  for (const index in itemList) {
    await loadRecipe(itemList[index].id as string, includingCrystal, materialGraph);
  }
  await linkGatheringPoint(materialGraph);
  return materialGraph;
}

/**
 * 生成材料层级
 * @param itemList 物品列表
 * @param materialGraph 物品图
 */
export function createMaterialLayers(itemList: Item[], materialGraph: MaterialGraph) {
  const queue = new Queue<string>();
  const materialLayers: string[][] = [];
  let layer = 0;
  for (const item of itemList) {
    queue.enqueue(item.id as string);
  }
  queue.enqueue('#');

  while (!queue.isEmpty()) {
    const current = queue.front();
    queue.dequeue();
    if (current !== '#') {
      if (layer > 0) {
        materialLayers[layer - 1].push(current);
      }
      if (materialGraph[current].recipe === null) continue;
      for (const [ingredient] of materialGraph[current].recipe!.ingredients) {
        const id = ingredient.id;
        queue.enqueue(id);
      }
    } else {
      if (queue.isEmpty()) break;
      layer++;
      materialLayers[layer - 1] = [];
      queue.enqueue('#');
    }
  }
  for (const [i, layerItems] of materialLayers.entries()) {
    materialLayers[i] = uniq(layerItems);
    const layerBit = 0x01 << i;
    // 物品可能存在多个layer,用bitmap来存,并且存下最深的layer用于排序
    for (const itemId of layerItems) {
      const item = materialGraph[itemId];
      item.layer |= layerBit;
      item.maxLayer = Math.max(item.maxLayer, i);
    }
  }
  return materialLayers;
}

type QueueItem = [string, string | null, number];

export async function loadRecipe(
  id: string,
  includingCrystal: boolean,
  materialGraph: MaterialGraph
) {
  // 加载数据
  const loadedMaterials: MaterialDataSource = (await materials()).default;
  const loadedBasicIngredient: BasicIngredientDataSource = (await basicIngredient())
    .default as unknown as BasicIngredientDataSource;

  // 初始化队列
  const queue = new Queue<QueueItem>();
  queue.enqueue([id, null, 1]);

  while (!queue.isEmpty()) {
    const [id, fid, amount] = queue.dequeue()!;

    // 创建节点
    if (!materialGraph[id]) {
      if (loadedMaterials[id] !== undefined) {
        // TODO: 有些物品有多个配方，暂时只取第一个
        const { name, icon, resultAmount, ingredient } = loadedMaterials[id][0];
        const recipe = new Recipe(resultAmount);
        materialGraph[id] = new Material(id, name, icon, false, recipe);

        // 记录配方所需材料
        for (const [ingredientId, ingredientAmount] of Object.entries(ingredient)) {
          // 是否计算水晶
          if (!includingCrystal) {
            if (parseInt(ingredientId) < 20 && parseInt(ingredientId) > 1) continue;
          }
          queue.enqueue([ingredientId, id, ingredientAmount]);
        }
      } else {
        // 基础素材
        const [name, icon] = loadedBasicIngredient[id];
        materialGraph[id] = new Material(id, name, icon, true, null);
        // 兑换方式
        setItemH2getTag(materialGraph[id]);
      }
    }

    if (fid !== null) {
      // 标记该材料是谁的子材料,并表明数量
      materialGraph[id].fathers[fid] = amount;
      // 添加材料
      materialGraph[fid].recipe!.addIngredient(materialGraph[id], amount);
    }
  }
}
