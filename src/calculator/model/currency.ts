import biclorGemStoneItems from '@data/bicolorGemstone.json';
import sealItems from '@data/seal.json';
import aphorismItems from '@data/aphorism.json';
import oCftSItems from '@data/old_craftersScrip.json';
import oGtrSItems from '@data/old_gatherersScrip.json';
import nCftSItems from '@data/new_craftersScrip.json';
import nGtrSItems from '@data/new_gatherersScrip.json';

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
    name: '因果神典石',
    icon: '065000/065094.png',
    items: aphorismItems as Currency
  },
  {
    name: '巧手白票',
    icon: '065000/065070.png',
    items: oCftSItems as Currency
  },
  {
    name: '巧手紫票',
    icon: '065000/065088.png',
    items: nCftSItems as Currency
  },
  {
    name: '大地白票',
    icon: '065000/065069.png',
    items: oGtrSItems as Currency
  },
  {
    name: '大地紫票',
    icon: '065000/065087.png',
    items: nGtrSItems as Currency
  }
];
