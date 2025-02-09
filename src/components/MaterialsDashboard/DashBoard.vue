<template>
  <div>
    <span class="flex items-center gap-1 shrink-0">
      计算水晶
      <a-switch
        v-model:checked="counterStore.includeCrystal"
        @change="counterStore.work()"
        size="small"
      />
    </span>
    <a-segmented v-model:value="filters" :options="options" />
    <ag-grid-vue
      class="ag-theme-material"
      style="margin-top: 8px; height: 500px; width: 100%"
      :columnDefs="columnDefs"
      :rowData="tableData"
      :defaultColDef="defaultColDef"
      rowSelection="multiple"
      animateRows="true"
      @cell-clicked="cellWasClicked"
      @grid-ready="onGridReady"
      @cell-edit-request="onCellEditRequest"
      :readOnlyEdit="true"
    />
    <a-divider>兑换材料统计</a-divider>
    <a-space>
      <a-statistic
        v-for="c in counterStore.currency_statistics"
        :key="c.name"
        :title="c.name"
        :value="c.amount"
        style="margin-right: 50px"
      >
        <template #suffix>
          <a-avatar shape="square" :src="c.icon" size="small" />
        </template>
      </a-statistic>
    </a-space>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { AgGridVue } from 'ag-grid-vue3'; // the AG Grid Vue Component

import type { CellEditRequestEvent, GridOptions } from 'ag-grid-community';
import type Material from '@/calculator/model/material';

import 'ag-grid-community/styles/ag-theme-material.min.css'; // Optional theme CSS

import ItemAgGridRenderer from './AgGridRenderer/ItemAgGridRenderer.vue';
import ItemArchorRenderer from './AgGridRenderer/ItemArchorRenderer.vue';
import CurrencyRenderer from './AgGridRenderer/CurrencyRenderer.vue';
import AmountEditor from './AgGridRenderer/AmountEditor.vue';

import { useCounterStore } from '@/stores/counter';
import { currencyComparator, gatheringPointsComparator } from './comparator';

const counterStore = useCounterStore();

const gridApi = ref<GridOptions<Material>['api']>(null); // Optional - for accessing Grid's API

// Each Column Definition results in one Column.
const columnDefs = [
  {
    headerName: '物品',
    field: 'name',
    cellRenderer: ItemAgGridRenderer,
    width: 240,
    flex: 1,
    pinned: 'left',
    resizable: true
  },
  {
    headerName: '需求数量',
    field: 'amount',
    minWidth: 80,
    flex: 1
  },
  {
    headerName: '已拥有的',
    field: 'own',
    editable: true,
    cellEditor: AmountEditor,
    flex: 1,
    minWidth: 80
  },
  {
    headerName: '兑换材料',
    field: 'amount',
    cellRenderer: CurrencyRenderer,
    comparator: currencyComparator,
    flex: 1,
    minWidth: 80
  },
  {
    headerName: '坐标',
    field: 'gatheringPoint.name',
    cellRenderer: ItemArchorRenderer,
    comparator: gatheringPointsComparator,
    flex: 1,
    minWidth: 300
  }
];

const options = [
  { label: '全部', value: 'all' },
  { label: '直接材料', value: 'dir' },
  { label: '基础材料', value: 'bas' },
  { label: '全部(包括目标)', value: 'allc' }
];
const filters = ref<string>('all');

const tableData = computed(() => {
  switch (filters.value) {
    case 'all':
      return counterStore.materialsWithoutTarget;
    case 'dir':
      return counterStore.directMaterials;
    case 'bas':
      return counterStore.basicMaterials;
    default:
      return counterStore.materials;
  }
});

// Obtain API from grid's onGridReady event
const onGridReady = (params: GridOptions) => {
  gridApi.value = params.api;
};

const onCellEditRequest = (event: CellEditRequestEvent<Material>) => {
  const newV = event.newValue;
  const refData = event.data;
  counterStore.calculate(refData.id, newV - refData.own);
  gridApi.value?.applyTransaction({ update: tableData.value });
  //   gridApi.value?.setRowData(counterStore.materials)
};

// DefaultColDef sets props common to all Columns
const defaultColDef = {
  sortable: true,
  filter: true
};

const cellWasClicked = (event: any) => {
  // Example of consuming Grid Event
  console.log('cell was clicked', event);
};
</script>
