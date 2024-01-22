<template>
  <div class="item">
    <a-avatar shape="square" :src="helpers.getIconByIconID(props.params.data?.icon!)" />
    <a
      :href="`https://ff14.huijiwiki.com/wiki/%E7%89%A9%E5%93%81:${props.params.data?.name}`"
      target="_blank"
    >
      {{ props.params.data?.name }}
      <span role="img" class="action"><EyeOutlined /></span>
    </a>
  </div>
</template>

<script lang="ts" setup>
import { helpers } from '@/calculator';
import type Material from '@/calculator/model/material';
import type { ICellRendererParams } from 'ag-grid-community';

const props = defineProps<{
  params: ICellRendererParams<Material, string>;
}>();
</script>

<style>
.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.item .ant-avatar {
  flex-shrink: 0;
}
</style>
