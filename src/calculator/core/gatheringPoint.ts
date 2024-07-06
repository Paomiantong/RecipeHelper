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
  const loadedGatheringPointsIDSet: Set<string> = new Set(); // 使用Set代替对象
  const loadedGatheringPoints: { [key: string]: GatheringPoint } = {};

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (const [_, element] of Object.entries(materials)) {
    // 只有基础物品才有采集点
    if (!element.isBasic) continue;

    const itemPoints = gatheringItemPoint[element.id];
    if (!itemPoints) continue;

    // 若已经加载过该点，则直接获取
    let gatheringPointId = itemPoints.find((id) => loadedGatheringPointsIDSet.has(id));
    if (gatheringPointId === undefined) {
      gatheringPointId = itemPoints[0]; // 直接获取第一个元素
      loadedGatheringPointsIDSet.add(gatheringPointId); // 添加到Set中
      loadedGatheringPoints[gatheringPointId] = {
        ...gatheringPoint[gatheringPointId],
        items: [],
        id: gatheringPointId
      }; // 添加到对象中
    }

    element.gatheringPoint = loadedGatheringPoints[gatheringPointId];
    element.gatheringPoint.items.push(element);
  }
}
