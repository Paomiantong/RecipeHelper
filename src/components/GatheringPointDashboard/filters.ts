import type { GatheringPointLimited } from '@/calculator/datasource/types';
import type { PointStatus } from '@/calculator/timeHelper';
import type { DataType } from './types';

type Filter<T, D = GatheringPointLimited> = (points: D[], props: T | null) => D[];

export const mapFilter: Filter<string> = (points, props) => {
  if (!props || props === '所有地图') {
    return points;
  }
  return points.filter((point) => point.name === props);
};

export const statusFilter: Filter<PointStatus, DataType> = (points, props) => {
  if (!props) {
    return points;
  }
  return points.filter((point) => point.timeTable.some((tb) => tb.status === props));
};
