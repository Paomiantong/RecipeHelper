import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { calculateLimitedGatherPointTime } from '@/calculator';
import { EfficientTimer, notify } from '@/calculator/utils';
import { mapData } from '@/calculator/datasource';

import type { DataType } from '@/components/GatheringPointDashboard/types.d';
import type Project from '@/calculator/model/project';

export const timer = new EfficientTimer(1000);

export const useAlarmStore = defineStore('alarm', () => {
  const alarmMap = ref<Map<string, DataType>>(new Map());
  let gatheringPoint: Record<string, any> = {};
  const loadProject = async (project: Project) => {
    gatheringPoint = (await mapData()).gatheringPoint;
    project.alarmList.forEach((id) => {
      addAlarm(id);
    });
  };

  const reset = () => {
    alarmMap.value.clear();
  };

  const addAlarm = (alarm: string) => {
    alarmMap.value.set(alarm, { ...gatheringPoint[alarm], id: alarm } as DataType);
  };

  const removeAlarm = (alarm: string) => {
    alarmMap.value.delete(alarm);
  };

  const alarm = () => {
    const now = new Date();
    alarmMap.value.forEach((alarm) => {
      alarm.timeTable = alarm.spawn.map((time) =>
        calculateLimitedGatherPointTime(now, time, alarm.duration)
      );
      if (alarm.timeTable.some((tb) => tb.status === 'Cooming')) {
        notify(`采集点即将刷新: ${alarm.name}(x:${alarm.x},y:${alarm.y})`, '采集点刷新提醒');
      }
    });
  };

  const alarmIdSet = computed(() => {
    return new Set(alarmMap.value.keys());
  });

  const alarmList = computed(() => alarmMap.value.values());

  timer.addCallback(alarm);

  return {
    alarmMap,
    alarmList,
    alarmIdSet,
    loadProject,
    addAlarm,
    removeAlarm,
    reset
  };
});
