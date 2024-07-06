<template>
  <div class="item" style="height: 100%">
    <span v-if="tag != -1"> <a-avatar shape="square" :src="icon" size="small" />×{{ amount }}</span>

    <a-divider v-if="tag == -1" />
  </div>
</template>

<script lang="ts" setup>
import type { ICellRendererParams } from 'ag-grid-community';
import type Material from '@/calculator/model/material';
import { getItemH2getIcon } from '@/calculator/itemHelper';

const props = defineProps<{
  params: ICellRendererParams<Material, string>;
}>();

const data = props.params.data!;

const tag = data.h2getTag;
const amount = data.amount * data.price;
const icon = getItemH2getIcon(tag);
</script>
