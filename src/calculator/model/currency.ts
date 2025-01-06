import biclorGemStoneItems from '@data/bicolorGemstone.json';
import sealItems from '@data/seal.json';
import aphorismItems from '@data/aphorism.json';
import oCftSItems from '@data/legacy_craftersScrip.json';
import oGtrSItems from '@data/legacy_gatherersScrip.json';
import nCftSItems from '@data/latest_craftersScrip.json';
import nGtrSItems from '@data/latest_gatherersScrip.json';

interface Currency {
  [key: string]: number;
}

export const currency = [
  {
    name: '双色宝石',
    icon: '065000/065071.png',
    items: biclorGemStoneItems as Currency
  },
  {
    name: '军票',
    icon: '065000/065005.png',
    items: sealItems as Currency
  },
  {
    name: '亚拉戈美学神典石',
    icon: '065000/065107.png',
    items: aphorismItems['latest'] as Currency
  },
  {
    name: '巧手紫票',
    icon: '065000/065088.png',
    items: oCftSItems as Currency
  },
  {
    name: '巧手橙票',
    icon: '065000/065110.png',
    items: nCftSItems as Currency
  },
  {
    name: '大地紫票',
    icon: '065000/065087.png',
    items: oGtrSItems as Currency
  },
  {
    name: '大地橙票',
    icon: '065000/065109.png',
    items: nGtrSItems as Currency
  },
  {
    name: '亚拉戈诗学神典石',
    icon: '065000/065023.png',
    items: aphorismItems['poetics'] as Currency
  }
];
