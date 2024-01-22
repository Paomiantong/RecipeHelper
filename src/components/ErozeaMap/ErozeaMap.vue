<template>
  <section
    class="erozea-map-outer"
    :class="{ close: close }"
    :style="`transform: translate(${x - 24}px, ${y}px)`"
  >
    <div className="eorzea-map-glass" />
    <div ref="handler" className="eorzea-map-move-handler" />
    <div className="eorzea-map-close-button" @click="() => (close = !close)" />
    <div ref="div" class="eorzea-map-inner" />
  </section>
</template>

<script lang="ts">
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const erozeaMap = { pin: (_id: string, _x: number, _y: number) => {}, isLoaded: false };
</script>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import { useDraggable } from '@vueuse/core';

import './ErozeaMap.module.css';

const div = ref<HTMLDivElement | null>(null);
const handler = ref<HTMLDivElement | null>(null);

const { x, y } = useDraggable(handler, {
  initialValue: { x: 0, y: 0 }
});

let iconUrl: any;
let theMap: any;

const mapID = ref('92');
const X = ref(0);
const Y = ref(0);
const close = ref(true);

erozeaMap.pin = (id: string, x: number, y: number) => {
  mapID.value = id;
  X.value = x;
  Y.value = y;
  close.value = false;
};

onMounted(() => {
  const loaded = function (map: any) {
    theMap = map;
    theMap.loadMapKey(mapID.value).then(() => {
      const marker = window.YZWF.eorzeaMap.simpleMarker(X.value, Y.value, iconUrl, theMap.mapInfo);
      theMap.addMarker(marker);
      setTimeout(() => {
        theMap.setView(theMap.mapToLatLng2D(X.value, Y.value), -2); // 移动到视角中心；setView 参考 leaflet 用法即可
      }, 300);
    });
    erozeaMap.isLoaded = true;
  };
  window.YZWF.eorzeaMap.create(div.value).then(loaded);
  iconUrl = window.YZWF.eorzeaMap.loader.getIconUrl('ui/icon/060000/060561.tex'); // 小旗子标记；注意地图 CDN 上只有地图用到的图标
});

watch([mapID, X, Y], () => {
  theMap.loadMapKey(mapID.value).then(() => {
    const marker = window.YZWF.eorzeaMap.simpleMarker(X.value, Y.value, iconUrl, theMap.mapInfo);
    theMap.addMarker(marker);
    setTimeout(() => {
      theMap.setView(theMap.mapToLatLng2D(X.value, Y.value), -2); // 移动到视角中心；setView 参考 leaflet 用法即可
    }, 300);
  });
});
</script>
