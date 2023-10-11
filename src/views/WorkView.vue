<template>
  <a-button type="primary" @click="counterStore.work">Primary Button</a-button>
  <a-button type="primary" @click="() => erozeaMap.pin('92', 20, 20)">Primary Button</a-button>
  <ag-grid-vue
    class="ag-theme-material"
    style="height: 500px"
    :columnDefs="columnDefs.value"
    :rowData="counterStore.materials"
    :defaultColDef="defaultColDef"
    rowSelection="multiple"
    animateRows="true"
    @cell-clicked="cellWasClicked"
    @grid-ready="onGridReady"
    @cell-edit-request="onCellEditRequest"
    :readOnlyEdit="true"
  >
  </ag-grid-vue>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { AgGridVue } from 'ag-grid-vue3' // the AG Grid Vue Component

import type { CellEditRequestEvent, GridOptions } from 'ag-grid-community'
import type Material from '@/calculator/model/material'

import 'ag-grid-community/styles/ag-theme-material.min.css' // Optional theme CSS

import ItemAgGridRenderer from '@/components/AgGridRenderer/ItemAgGridRenderer.vue'
import ItemArchorRenderer from '@/components/AgGridRenderer/ItemArchorRenderer.vue'
import AmountEditor from '@/components/AgGridRenderer/AmountEditor.vue'

import { useCounterStore } from '@/stores/counter'
import erozeaMap from '@/components/ErozeaMap'

const gridApi = ref<GridOptions<Material>['api']>(null) // Optional - for accessing Grid's API

// Obtain API from grid's onGridReady event
const onGridReady = (params: GridOptions) => {
  gridApi.value = params.api
}

// Each Column Definition results in one Column.
const columnDefs = {
  value: [
    { headerName: '物品', field: 'name', cellRenderer: ItemAgGridRenderer },
    {
      headerName: '数量',
      field: 'amount',
      editable: true,
      cellEditor: AmountEditor,
      width: 120
    },
    { headerName: '坐标', field: 'gatheringPoint.name', cellRenderer: ItemArchorRenderer, flex: 1 }
  ]
}

const onCellEditRequest = (event: CellEditRequestEvent<Material>) => {
  const newV = event.newValue
  const refData = event.data
  counterStore.calculate(refData.id, refData.amount - newV)
  gridApi.value?.setRowData(counterStore.materials)
}

// DefaultColDef sets props common to all Columns
const defaultColDef = {
  sortable: true,
  filter: true
}

const cellWasClicked = (event: any) => {
  // Example of consuming Grid Event
  console.log('cell was clicked', event)
}

const deselectRows = () => {
  gridApi.value!.deselectAll()
}

const counterStore = useCounterStore()
</script>
