<template>
  <div class="global-search-wrapper" style="width: 300px">
    <a-auto-complete
      v-model:value="value"
      :dropdown-match-select-width="252"
      style="width: 300px"
      :options="dataSource"
      @select="onSelect"
      @search="onSearch"
    >
      <template #option="item">
        <div style="display: flex; justify-content: space-between">
          <a-avatar shape="square" :src="helpers.getIconByIconID(item.icon)" />
          <span>{{ item.name }}</span>
        </div>
      </template>
      <a-input-search size="large" placeholder="input here" enter-button></a-input-search>
    </a-auto-complete>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { debounce } from 'lodash-es'
import { helpers } from '@/calculator'
import type { SearchResult } from '@/calculator/searchHelper'
const value = ref<string>('')
const dataSource = ref<SearchResult[]>([])

const onSearch = debounce((key: string) => {
  dataSource.value = helpers.searchRecipe(key)
  dataSource.value.forEach((v) => (v.value = v.name))
}, 200)

const onSelect = (value: string, option: string) => {
  console.log(option)
}
</script>
