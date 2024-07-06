import type { Item, MaterialGraph } from '../core/types';

export default class Project {
  name: string;
  itemList: Item[];
  ownAmountOfItems: { [x: string]: number } = {};
  alarmList: string[] = [];
  constructor(name: string, itemList: Item[], graph: MaterialGraph, alarmList: string[] = []) {
    this.name = name;
    this.itemList = itemList;
    for (const key in graph) {
      this.ownAmountOfItems[key] = graph[key].own;
    }
    this.alarmList = alarmList;
  }

  save() {
    localStorage.setItem(this.name, JSON.stringify(this));
  }
}
