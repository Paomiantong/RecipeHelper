export interface MaterialDB {
  [Key: string]: {
    name: string;
    job: string;
    resultAmount: number;
    ingredient: { [Key: string]: number };
    icon: number;
  }[];
}

export interface BasicIngredientDB {
  [Key: string]: (string | number)[];
}

export interface GatheringPoint {
  name: string;
  map: string;
  x: number;
  y: number;
  limited: boolean;
}

export interface MapDataDB {
  gatheringItemPoint: {
    [key: string]: string[];
  };
  gatheringPoint: {
    [key: string]: GatheringPoint;
  };
}
