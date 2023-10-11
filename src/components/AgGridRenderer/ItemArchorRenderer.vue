<template>
  <div class="item" style="height: 100%">
    <a-button
      color="blue"
      v-if="gatheringPoint"
      @click="() => erozeaMap.pin(gatheringPoint!.map, gatheringPoint!.x, gatheringPoint!.y)"
    >
      <span role="img" class="action"><EnvironmentOutlined /></span>
      {{ `@${gatheringPoint?.name}(${gatheringPoint?.x},${gatheringPoint?.y})` }}
    </a-button>
    <a-divider v-if="!gatheringPoint" />
  </div>
</template>

<script lang="ts" setup>
import type Material from '@/calculator/model/material'
import type { ICellRendererParams } from 'ag-grid-community'
import erozeaMap from '../ErozeaMap'

const props = defineProps<{
  params: ICellRendererParams<Material, string>
}>()

const gatheringPoint = props.params.data?.gatheringPoint
</script>
