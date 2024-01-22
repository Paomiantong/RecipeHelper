import type Material from './material';

export default class Recipe {
  resultAmount = -1;
  ingredients: [Material, number][] = [];
  // [[item, amount]]
}
