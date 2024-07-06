<template>
  <div class="flex justify-center flex-col p-4 rounded-md shadow-lg">
    <span
      @click="eorzeanMap.pin(gatheringPoint.map, gatheringPoint.x, gatheringPoint.y)"
      class="font-semibold mb-2 cursor-pointer"
    >
      <a-button
        :type="marked ? 'primary' : 'dashed'"
        size="small"
        @click.stop="emit('changeMark', gatheringPoint.id)"
      >
        <template #icon>
          <BellOutlined />
        </template>
      </a-button>
      {{ `${gatheringPoint.name}(x:${gatheringPoint.x},y:${gatheringPoint.y})` }}
    </span>
    <!-- 物品列表 -->
    <div class="flex gap-1">
      <a-tooltip v-for="m in gatheringPoint.items" :key="m.id" :title="m.name">
        <a-avatar shape="square" size="small" :src="getIconByIconID(m.icon as number)" />
      </a-tooltip>
    </div>
    <!-- 时间条 -->
    <div class="mt-1" v-for="(spawn, i) in gatheringPoint.timeTable" :key="i">
      <!-- tags -->
      <p class="flex gap-1">
        <span
          :class="{
            'bg-green-500 border-green-500': spawn.status !== 'Done',
            'bg-red-500 border-red-500': spawn.status === 'Done'
          }"
          class="tag bg-green-500 border-green-500"
          >{{ statusMap[spawn.status] + ':' + spawn.leftTime }}</span
        >
        <span class="tag bg-indigo-500 border-indigo-500"> 艾:{{ spawn.eorzeaStartTime }} </span>
        <span class="tag bg-green-500 border-green-500"> 地:{{ spawn.earthStartTime }} </span>
      </p>
      <!-- 进度条 -->
      <a-progress
        :status="spawn.status === 'Exposing' ? 'success' : 'normal'"
        :percent="spawn.progress"
        :show-info="false"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getIconByIconID } from '@/calculator';
import eorzeanMap from '@components/EorzeanMap';

import type { DataType } from './types';
import type { PointStatus } from '@/calculator/timeHelper';

const emit = defineEmits(['changeMark']);

const statusMap: Record<PointStatus, string> = {
  Cooming: '即将出现',
  Done: '距离出现',
  Exposing: '剩余时间'
};

defineProps<{
  gatheringPoint: DataType;
  marked?: boolean;
}>();
</script>
