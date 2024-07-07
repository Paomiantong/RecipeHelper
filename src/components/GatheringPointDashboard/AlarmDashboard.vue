<template>
  <div class="tw" style="height: 100%; position: relative">
    <a-empty
      class="inset-0 absolute flex flex-col justify-center"
      v-if="alarmStore.alarmIdSet.size == 0"
      description="未添加采集时钟"
    />
    <div v-else class="flex flex-col tw-base gap-2 mt-4">
      <GatheringPointPanel
        v-for="(gatheringPoint, i) in alarmStore.alarmList"
        :key="i"
        :gatheringPoint="gatheringPoint"
        :marked="true"
        @changeMark="changeMark"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useAlarmStore } from '@/stores/alarm';
import GatheringPointPanel from './GatheringPointPanel.vue';

const alarmStore = useAlarmStore();

const changeMark = (gatheringPointId: string) => {
  alarmStore.removeAlarm(gatheringPointId);
};
</script>
