import type { GatheringPointLimited } from '@/calculator/datasource/types';
import type { calculateLimitedGatherPointTime } from '@/calculator';

export interface DataType extends GatheringPointLimited {
  timeTable: ReturnType<typeof calculateLimitedGatherPointTime>[];
}
