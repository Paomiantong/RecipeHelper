import { mapData } from '../datasource';

import type { MapDataSource } from '../datasource/types';
import type { MaterialGraph } from './types';

/**
 * 链接采集点
 * @param materials
 */
export async function linkGatheringPoint(materials: MaterialGraph) {
  const loadedMapData: MapDataSource = await mapData();
  const { gatheringItemPoint, gatheringPoint } = loadedMapData;
  const loadedGatheringPoints: Set<string> = new Set(); // 使用Set代替对象

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const [_, element] of Object.entries(materials)) {
    // 只有基础物品才有采集点
    if (!element.isBasic) continue;

    const itemPoints = gatheringItemPoint[element.id];
    if (!itemPoints) continue;

    // 若已经加载过该点，则直接获取
    let gatheringPointId = itemPoints.find((id) => loadedGatheringPoints.has(id));
    if (gatheringPointId === undefined) {
      gatheringPointId = itemPoints[0]; // 直接获取第一个元素
      loadedGatheringPoints.add(gatheringPointId); // 添加到Set中
    }

    element.gatheringPoint = gatheringPoint[gatheringPointId];
  }
  //   const gatheringItemPoint = loadedMapData.gatheringItemPoint;
  //   const gatheringPoint = loadedMapData.gatheringPoint;
  //   const loadedGatheringPoints: { [key: string]: boolean } = {};
  //   for (const key in materials) {
  //     if (materials[key]) {
  //       const element = materials[key];
  //       if (gatheringItemPoint[element.id]) {
  //         let gatheringPointId = find(gatheringItemPoint[element.id], (o) => {
  //           return loadedGatheringPoints[o] !== undefined;
  //         });

  //         if (gatheringPointId === undefined) {
  //           gatheringPointId = gatheringItemPoint[element.id][0];
  //           loadedGatheringPoints[gatheringPointId] = true;
  //         }

  //         element.gatheringPoint = gatheringPoint[gatheringPointId];
  //       }
  //     }
  //   }
}
