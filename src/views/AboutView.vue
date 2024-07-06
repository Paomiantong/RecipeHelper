<template>
  <div class="about">
    <p>{{ earthTime }}</p>
    <p>{{ eorzeanTime }}</p>
    <br />
    <div class="tw">
      <div v-for="(g, i) in data" class="p-2 flex justify-center flex-col" :key="i">
        <span class="font-semibold">{{ g.name }}</span>
        <div v-for="(spawn, j) in g.timeTable" :key="i * 10 + j">
          <p>
            <span class="border-indigo-500 border-solid border rounded-sm px-1 text-xs">
              艾:{{ spawn.eorzeaStartTime }}—{{ spawn.eorzeaEndTime }}
            </span>
            <span class="border-green-500 border-solid border rounded-sm px-1 text-xs">
              地:{{ spawn.earthStartTime }}-{{ spawn.earthEndTime }}
            </span>
          </p>
          <a-progress :percent="spawn.progress" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { toEorzeanDate, formatTime, calculateLimitedGatherPointTime } from '@/calculator';
import { nextTick, onMounted, onUnmounted, ref } from 'vue';

import { useCounterStore } from '@/stores/counter';
import type { GatheringPointBase } from '@/calculator/datasource/types';

const counterStore = useCounterStore();

interface DataType extends GatheringPointBase {
  timeTable: ReturnType<typeof calculateLimitedGatherPointTime>[];
}

const data = ref<DataType[]>([]);

const earthTime = ref('');
const eorzeanTime = ref('');
const timer = ref(0);

const TimedTask = () => {
  nextTick(() => {
    const now = new Date();
    earthTime.value = formatTime(now);
    eorzeanTime.value = toEorzeanDate(now).format('YYYY-MM-DD HH:mm:ss');
    data.value = counterStore.gatheringPoints
      .filter((v) => v.limited)
      .map((v) => {
        return {
          ...v,
          timeTable: v.spawn.map((s) => calculateLimitedGatherPointTime(now, s, v.duration))
        };
      });
  });
};

const setTimeOutSelf = () => {
  TimedTask(),
    (timer.value = setTimeout(function () {
      setTimeOutSelf();
    }, 1e3));
};

onMounted(() => {
  TimedTask();
  timer.value = setTimeout(function () {
    setTimeOutSelf();
  }, 1e3);
});

onUnmounted(() => {
  clearTimeout(timer.value);
});
</script>

<style></style>
