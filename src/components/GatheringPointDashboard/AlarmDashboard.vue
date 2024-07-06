<template>
  <div class="tw">
    <div class="flex flex-col tw-base gap-2 mt-4">
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
