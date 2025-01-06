import { mapData } from '../datasource';

import type { GatheringPoint, MapDataSource } from '../datasource/types';
import type Material from '../model/material';
import type { MaterialGraph } from './types';

declare module '../datasource/types' {
  interface GatheringPointBase {
    id: string;
    items: Material[];
  }
}

/**
 * 链接采集点
 * @param materials
 */
export async function linkGatheringPoint(materials: MaterialGraph) {
  const loadedMapData: MapDataSource = (await mapData()).default as unknown as MapDataSource;
  const { gatheringItemPoint, gatheringPoint } = loadedMapData;
  const gatheringPointCounter: { [key: string]: number } = {};
  const mapCounter: { [key: string]: number } = {};
  const loadedGatheringPoints: { [key: string]: GatheringPoint } = {};
  const temp: { [key: string]: GatheringPoint[] } = {};

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const [_, element] of Object.entries(materials)) {
    // 只有基础物品才有采集点
    if (!element.isBasic) continue;

    const itemPoints = gatheringItemPoint[element.id];
    if (!itemPoints) continue;
    temp[element.id] = [];

    for (const gatheringPointId of itemPoints) {
      if (!gatheringPointCounter[gatheringPointId]) {
        gatheringPointCounter[gatheringPointId] = 0;
      }
      gatheringPointCounter[gatheringPointId]++;

      if (!mapCounter[gatheringPoint[gatheringPointId].map]) {
        mapCounter[gatheringPoint[gatheringPointId].map] = 0;
      }
      mapCounter[gatheringPoint[gatheringPointId].map]++;

      if (!loadedGatheringPoints[gatheringPointId]) {
        loadedGatheringPoints[gatheringPointId] = {
          ...gatheringPoint[gatheringPointId],
          items: [],
          id: gatheringPointId
        }; // 添加到对象中
      }
      temp[element.id].push(loadedGatheringPoints[gatheringPointId]);
    }
  }

  for (const [k, v] of Object.entries(temp)) {
    const best = v.sort((a, b) => {
      // 采集点数量多的排在前面, 采集点数量相同时, 采集点所在地图数量多的排在前面
      if (gatheringPointCounter[b.id] === gatheringPointCounter[a.id]) {
        return mapCounter[b.map] - mapCounter[a.map];
      }
      return gatheringPointCounter[b.id] - gatheringPointCounter[a.id];
    })[0];
    materials[k].gatheringPoint = best;
    best.items.push(materials[k]);
  }
}
