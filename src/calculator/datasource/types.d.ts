import { GatheringPoint } from './types.d';
export interface MaterialDataSource {
  [Key: string]: {
    name: string;
    job: string;
    resultAmount: number;
    ingredient: { [Key: string]: number };
    icon: number;
  }[];
}

export interface BasicIngredientDataSource {
  [Key: string]: [string, number];
}

interface GatheringPointBase {
  name: string;
  map: string;
  x: number;
  y: number;
}

interface GatheringPointNotLimited extends GatheringPointBase {
  limited: false;
}

interface GatheringPointLimited extends GatheringPointBase {
  limited: true;
  spawn: number[];
  duration: number;
}

export type GatheringPoint = GatheringPointLimited | GatheringPointNotLimited;

export interface MapDataSource {
  gatheringItemPoint: {
    [key: string]: string[];
  };
  gatheringPoint: {
    [key: string]: GatheringPoint;
  };
}
