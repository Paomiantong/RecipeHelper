<template>
  <a-button type="primary" @click="counterStore.work">Primary Button</a-button>
  <a-list class="demo-loadmore-list" item-layout="horizontal" :data-source="counterStore.materials">
    <template #renderItem="{ item }">
      <a-list-item>
        <template #actions>
          <a-button
            key="list-loadmore-edit"
            @click="
              () => {
                counterStore.calculate(item.id, 1)
              }
            "
          >
            Add One
          </a-button>
          <a key="list-loadmore-more">more</a>
        </template>
        <span>{{ item.name }} * {{ item.amount }}</span>
      </a-list-item>
    </template>
  </a-list>
</template>

<script lang="ts" setup>
import { useCounterStore } from '@/stores/counter'

const counterStore = useCounterStore()
</script>
