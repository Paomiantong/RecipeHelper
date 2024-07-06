<template>
  <div class="tw">
    <div class="flex flex-col md:!flex-row items-center gap-1">
      <span class="flex items-center gap-1 shrink-0">
        仅显示可采集
        <a-switch v-model:checked="enableFilterStatus" @change="TimedTask()" size="small" />
      </span>
      <div class="overflow-x-auto w-full">
        <a-segmented v-model:value="filterOption" :options="maps" @change="TimedTask()" />
      </div>
    </div>
    <div class="flex flex-col tw-base gap-2 mt-4">
      <GatheringPointPanel
        v-for="(gatheringPoint, i) in data"
        :key="i"
        :gatheringPoint="gatheringPoint"
        :marked="alarmStore.alarmIdSet.has(gatheringPoint.id)"
        @changeMark="changeMark"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';
import { uniq } from 'lodash-es';

import { calculateLimitedGatherPointTime } from '@/calculator';
import { useCounterStore } from '@/stores/counter';
import { timer, useAlarmStore } from '@/stores/alarm';
import * as filters from './filters';

import type { DataType } from './types';
import GatheringPointPanel from './GatheringPointPanel.vue';

const counterStore = useCounterStore();
const alarmStore = useAlarmStore();

const filterOption = ref('所有地图');
const enableFilterStatus = ref(false);
const data = ref<DataType[]>([]);
// const timer = ref(0);

const maps = computed(() => uniq(['所有地图', ...limitedGatheringPoints.value.map((v) => v.name)]));
const limitedGatheringPoints = computed(() =>
  counterStore.gatheringPoints.filter((v) => v.limited)
);
const filteredGatheringPoints = computed(() =>
  filters.mapFilter(limitedGatheringPoints.value, filterOption.value)
);

const TimedTask = () => {
  nextTick(() => {
    const now = new Date();
    data.value = filters.statusFilter(
      filteredGatheringPoints.value.map((v) => {
        return {
          ...v,
          timeTable: v.spawn.map((s) => calculateLimitedGatherPointTime(now, s, v.duration))
        };
      }),
      enableFilterStatus.value ? 'Exposing' : null
    );
  });
};

const changeMark = (gatheringPointId: string) => {
  if (alarmStore.alarmIdSet.has(gatheringPointId)) {
    alarmStore.removeAlarm(gatheringPointId);
  } else {
    alarmStore.addAlarm(gatheringPointId);
  }
  TimedTask();
};

// const setTimeOutSelf = () => {
//   TimedTask();
//   timer.value = setTimeout(setTimeOutSelf, 1e3);
// };

onMounted(() => {
  TimedTask();
  //   timer.value = setTimeout(setTimeOutSelf, 1e3);
  timer.addCallback(TimedTask);
});

onUnmounted(() => {
  //   clearTimeout(timer.value);
  timer.removeCallback(TimedTask);
});
</script>

<style lang="postcss">
.tag {
  @apply font-semibold text-white border-solid border rounded-sm px-1 text-xs;
}
</style>
