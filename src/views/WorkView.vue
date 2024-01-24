<template>
  <a-spin :spinning="spinning">
    <a-radio-group v-model:value="filters" :options="options" />
    <ag-grid-vue
      class="ag-theme-material"
      style="margin-top: 8px; height: 500px"
      :columnDefs="columnDefs"
      :rowData="tableData"
      :defaultColDef="defaultColDef"
      rowSelection="multiple"
      animateRows="true"
      @cell-clicked="cellWasClicked"
      @grid-ready="onGridReady"
      @cell-edit-request="onCellEditRequest"
      :readOnlyEdit="true"
    >
    </ag-grid-vue>
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
  </a-spin>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { AgGridVue } from 'ag-grid-vue3'; // the AG Grid Vue Component

import type { CellEditRequestEvent, GridOptions, IRowNode } from 'ag-grid-community';
import type Material from '@/calculator/model/material';

import 'ag-grid-community/styles/ag-theme-material.min.css'; // Optional theme CSS

import ItemAgGridRenderer from '@components/AgGridRenderer/ItemAgGridRenderer.vue';
import ItemArchorRenderer from '@components/AgGridRenderer/ItemArchorRenderer.vue';
import CurrencyRenderer from '@/components/AgGridRenderer/CurrencyRenderer.vue';
import AmountEditor from '@components/AgGridRenderer/AmountEditor.vue';

import { useCounterStore } from '@/stores/counter';
import { useProjectStore } from '@/stores/projectManager';

const counterStore = useCounterStore();
const projectStore = useProjectStore();

const gridApi = ref<GridOptions<Material>['api']>(null); // Optional - for accessing Grid's API

// Each Column Definition results in one Column.
const columnDefs = [
  { headerName: '物品', field: 'name', cellRenderer: ItemAgGridRenderer, flex: 1 },
  {
    headerName: '需求数量',
    field: 'amount',
    width: 120
  },
  {
    headerName: '已拥有的',
    field: 'own',
    editable: true,
    cellEditor: AmountEditor,
    width: 120
  },
  {
    headerName: '兑换材料',
    field: 'amount',
    cellRenderer: CurrencyRenderer,
    comparator: (
      _valueA: any,
      _valueB: any,
      nodeA: IRowNode<Material>,
      nodeB: IRowNode<Material>,
      isDescending: boolean
    ) => {
      const v1 = nodeA.data!;
      const v2 = nodeB.data!;
      if (v1.h2getTag != v2.h2getTag) {
        return isDescending ? v1.h2getTag - v2.h2getTag : v2.h2getTag - v1.h2getTag;
      } else return v1.price * v1.amount - v2.price * v2.amount;
    },
    width: 120
  },
  { headerName: '坐标', field: 'gatheringPoint.name', cellRenderer: ItemArchorRenderer, flex: 1 }
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

const spinning = ref<boolean>(true);

// const deselectRows = () => {
//   gridApi.value!.deselectAll()
// }

const saveTask = { id: -1 };

onMounted(() => {
  projectStore.loadProejct().then(() => {
    spinning.value = false;
  });
  saveTask.id = setInterval(projectStore.saveProject, 60000);
});

onBeforeUnmount(() => {
  clearInterval(saveTask.id);
});
</script>
