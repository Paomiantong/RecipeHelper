<template>
  <a-input-search v-model:value="value" placeholder="input search loading with enterButton" />
  <a-list class="demo-loadmore-list" item-layout="horizontal" :data-source="list">
    <template #renderItem="{ item }">
      <a-list-item>
        <template #actions>
          <a key="list-loadmore-edit">edit</a>
          <a key="list-loadmore-more">more</a>
        </template>
        <a-skeleton avatar :title="false" :loading="!!item.loading" active>
          <a-list-item-meta
            description="Ant Design, a design language for background applications, is refined by Ant UED Team"
          >
            <template #title>
              <span>{{ item.name }}</span>
            </template>
            <template #avatar>
              <a-avatar :src="helpers.getIconByIconID(item.icon)" />
            </template>
          </a-list-item-meta>
          <div>{{ item.id }}</div>
        </a-skeleton>
      </a-list-item>
    </template>
  </a-list>
</template>
<script lang="ts" setup>
import { watch, ref } from 'vue'
import { debounce } from 'lodash-es'
import { helpers } from '@/calculator'
const value = ref<string>('')
const list = ref([])

watch(
  value,
  debounce(() => {
    search(value.value)
  }, 700)
)

const search = async (key: string) => {
  list.value = helpers.searchRecipe(key) as any
}
</script>
<style scoped>
.demo-loadmore-list {
  min-height: 350px;
}
</style>
