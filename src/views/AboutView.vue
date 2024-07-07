<template>
  <div class="about">
    <p>{{ earthTime }}</p>
    <p>{{ eorzeanTime }}</p>
    <a-button @click="notify('TEST!!!', 'Notify')">Notify Test</a-button>
  </div>
</template>

<script lang="ts" setup>
import { toEorzeanDate, formatTime } from '@/calculator';
import { notify } from '@/calculator/utils';
import { nextTick, onMounted, onUnmounted, ref } from 'vue';

const earthTime = ref('');
const eorzeanTime = ref('');
const timer = ref(0);

const TimedTask = () => {
  nextTick(() => {
    const now = new Date();
    earthTime.value = formatTime(now);
    eorzeanTime.value = toEorzeanDate(now).format('YYYY-MM-DD HH:mm:ss');
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
