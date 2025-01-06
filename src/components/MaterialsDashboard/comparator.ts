import type Material from '@/calculator/model/material';
import type { IRowNode } from 'ag-grid-community';

export const currencyComparator = (
  _valueA: any,
  _valueB: any,
  nodeA: IRowNode<Material>,
  nodeB: IRowNode<Material>,
  isDescending: boolean
) => {
  const v1 = nodeA.data!;
  const v2 = nodeB.data!;
  if (v1.h2getTag != v2.h2getTag) {
    return isDescending ? v1.h2getTag - v2.h2getTag : v2.h2getTag - v1.h2getTag;
  } else return v1.price * v1.amount - v2.price * v2.amount;
};

export const gatheringPointsComparator = (
  _valueA: any,
  _valueB: any,
  nodeA: IRowNode<Material>,
  nodeB: IRowNode<Material>,
  _: boolean
) => {
  const g1 = nodeA.data!.gatheringPoint;
  const g2 = nodeB.data!.gatheringPoint;
  let v = 0;
  if (g1 && !g2) {
    v = -1;
  }
  if (!g1 && g2) {
    v = 1;
  }
  if (g1 && g2) {
    if (g1.map !== g2.map) {
      v = +g1.map - +g2.map;
    } else v = +g1.id - +g2.id;
  }
  return v;
};
