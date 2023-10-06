<template>
  <a-button type="primary" @click="counterStore.work">Primary Button</a-button>
</template>

<script lang="ts" setup>
import { useCounterStore } from '@/stores/counter'

const counterStore = useCounterStore()
</script>
