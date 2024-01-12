<template>
  <a-space wrap>
    <a-button type="primary" @click="go">体验一波</a-button>
  </a-space>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
function go() {
  router.push({ name: 'work' })
}
</script>
