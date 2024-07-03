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

export interface GatheringPoint {
  name: string;
  map: string;
  x: number;
  y: number;
  limited: boolean;
}

export interface MapDataSource {
  gatheringItemPoint: {
    [key: string]: string[];
  };
  gatheringPoint: {
    [key: string]: GatheringPoint;
  };
}
