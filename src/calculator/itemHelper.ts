import { currency } from './model/currency'
import type Material from './model/material'

export function getIconByIconID(id: number) {
  // return `http://cal.ffxiv.xin/0${parseInt(id / 1000) * 1000}/0${id}.png`;
  return `https://cafemaker.wakingsands.com/i/0${Math.floor(id / 1000) * 1000}/0${id}.png`
}

export function setItemH2getTag(item: Material) {
  for (const tag in currency) {
    const temp = currency[tag].items[item.id]
    if (temp) {
      item.h2getTag = parseInt(tag)
      item.price = temp
      return
    }
  }
}

export function getItemH2getIcon(tag: number) {
  if (tag == -1) return
  return `https://cafemaker.wakingsands.com/i/${currency[tag].icon}`
}
