<template>
  <!-- <a-spin :spinning="spinning"> -->
  <a-tabs v-model:activeKey="activeKey" style="flex: 1">
    <a-tab-pane key="1" tab="计算详情">
      <MaterialsDashboard />
    </a-tab-pane>
    <a-tab-pane key="2" tab="限时采集点">
      <GatheringPointBashBoard />
    </a-tab-pane>
    <a-tab-pane key="3" tab="采集时钟">
      <AlarmDashBoard />
    </a-tab-pane>
  </a-tabs>
  <!-- </a-spin> -->
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { message } from 'ant-design-vue';

import 'ag-grid-community/styles/ag-theme-material.min.css'; // Optional theme CSS

import { GatheringPointBashBoard, AlarmDashBoard } from '@components/GatheringPointDashboard';
import { MaterialsDashboard } from '@/components/MaterialsDashboard';

import { useProjectStore } from '@/stores/projectManager';
import { timer } from '@/stores/alarm';

const activeKey = ref('1');

const projectStore = useProjectStore();

const spinning = ref<boolean>(true);

const saveTask = { id: -1 };

onMounted(() => {
  projectStore
    .loadProejct()
    .catch((e) => {
      message.error('加载项目失败: ' + e.message);
    })
    .finally(() => {
      spinning.value = false;
    });
  saveTask.id = setInterval(projectStore.saveProject, 60000);
  timer.start();
  //   alarmStore.startTimer();
});

onBeforeUnmount(() => {
  clearInterval(saveTask.id);
  timer.stop();
  //   alarmStore.stopTimer();
});
</script>

<style>
.ant-tabs .ant-tabs-content {
  height: 100%;
}
</style>
