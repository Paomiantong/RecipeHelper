import biclorGemStoneItems from '@data/bicolorGemstone.json';
import sealItems from '@data/seal.json';
import aphorismItems from '@data/aphorism.json';

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
  }
];
