<template>
  <div class="item" style="height: 100%">
    <a-tag
      :color="stringToVibrantColor(gatheringPoint?.name)"
      v-if="gatheringPoint"
      :icon="h(EnvironmentOutlined)"
      @click="() => erozeaMap.pin(gatheringPoint!.map, gatheringPoint!.x, gatheringPoint!.y)"
      style="font-size: 14px; padding: 4px 8px"
    >
      {{ `${gatheringPoint?.name} (x:${gatheringPoint?.x}, y:${gatheringPoint?.y})` }}
    </a-tag>
    <a-divider v-if="!gatheringPoint" />
  </div>
</template>

<script lang="ts" setup>
import { h } from 'vue';
import { EnvironmentOutlined } from '@ant-design/icons-vue';

import erozeaMap from '../ErozeaMap';

import type { ICellRendererParams } from 'ag-grid-community';
import type Material from '@/calculator/model/material';

const props = defineProps<{
  params: ICellRendererParams<Material, string>;
}>();

function stringToVibrantColor(inputString: string): string {
  let hash = 0;
  for (let i = 0; i < inputString.length; i++) {
    hash = inputString.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Convert hash into a color
  let color = '#';
  for (let i = 0; i < 3; i++) {
    // We use bitwise AND operation to keep the value within 0-255
    // Adjust the value to ensure vibrancy while making it darker
    const value = (hash >> (i * 8)) & 0xff;
    const darkerValue = (value % 96) + 96; // Ensure a minimum value of 96 and a maximum of 191
    color += ('00' + darkerValue.toString(16)).slice(-2);
  }

  return color;
}

const gatheringPoint = props.params.data?.gatheringPoint;
</script>
