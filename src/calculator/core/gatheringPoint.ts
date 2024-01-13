import { find } from 'lodash-es'

import { mapData } from '../database'

import type { MapDataDB } from '../database/database'
import type { MaterialGraph } from './types'

export async function linkGatheringPoint(materials: MaterialGraph) {
  const loadedMapData: MapDataDB = await mapData()
  const gatheringItemPoint = loadedMapData.gatheringItemPoint
  const gatheringPoint = loadedMapData.gatheringPoint
  const loadedGatheringPoints: { [key: string]: boolean } = {}
  for (const key in materials) {
    if (materials[key]) {
      const element = materials[key]
      if (gatheringItemPoint[element.id]) {
        let gatheringPointId = find(gatheringItemPoint[element.id], function (o) {
          return loadedGatheringPoints[o] !== undefined
        })

        if (gatheringPointId === undefined) {
          gatheringPointId = gatheringItemPoint[element.id][0]
          loadedGatheringPoints[gatheringPointId] = true
        }

        element.gatheringPoint = gatheringPoint[gatheringPointId]
      }
    }
  }
}
