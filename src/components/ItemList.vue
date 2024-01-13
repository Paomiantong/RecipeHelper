<template>
  <a-layout-sider width="400" style="background: #fff">
    <!-- 搜索框 -->
    <div id="search-box">
      <SearchOutlined />
      <a-auto-complete
        v-model:value="value"
        :dropdown-match-select-width="252"
        :bordered="false"
        style="width: 100%"
        :options="dataSource"
        @select="onSelect"
        @search="onSearch"
        placeholder="搜索物品"
      >
        <template #option="item">
          <div style="display: flex; justify-content: space-between">
            <a-avatar shape="square" :src="helpers.getIconByIconID(item.icon)" />
            <span>{{ item.name }}</span>
          </div>
        </template>
      </a-auto-complete>
      <a-button @click="counterStore.work">Go</a-button>
      <a-button @click="projectStore.saveProject">Save</a-button>
    </div>
    <!-- 物品列表 -->
    <a-list id="item-list" item-layout="horizontal" :data-source="counterStore.itemList">
      <template #renderItem="{ item }">
        <a-list-item>
          <template #actions>
            <a-input-number v-model:value="item.amount" :min="1" style="width: 70px" />
          </template>
          <a-tooltip placement="topLeft" title="点击删除">
            <a-avatar
              @click="
                () => {
                  counterStore.removeItem(item.id)
                }
              "
              shape="square"
              :src="helpers.getIconByIconID(item.icon)"
            />
          </a-tooltip>
          <span>{{ item.name }}</span>
        </a-list-item>
      </template>
    </a-list>
  </a-layout-sider>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

import { debounce } from 'lodash-es'

import { useCounterStore } from '@/stores/counter'
import { useProjectStore } from '@/stores/projectManager'
import { helpers } from '@/calculator'

import type { SearchResult } from '@/calculator/searchHelper'

const value = ref<string>('')
const dataSource = ref<SearchResult[]>([])

const counterStore = useCounterStore()
const projectStore = useProjectStore()

const onSearch = debounce((key: string) => {
  dataSource.value = helpers.searchRecipe(key)
  dataSource.value.forEach((v) => (v.value = v.name))
}, 200)

const onSelect = (_: string, option: SearchResult) => {
  if (!counterStore.itemList.find((x) => x.id == option.id)) {
    counterStore.itemList.push({ ...option, amount: 1 })
  }
}
</script>

<style scoped>
#search-box {
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

<style>
#item-list .ant-list-item-action {
  margin-inline-start: 8px !important;
}
</style>
