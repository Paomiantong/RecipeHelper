<template>
  <a-layout-sider
    width="400"
    class="!bg-white relative max-xl:!fixed max-xl:z-10 max-xl:shadow-lg"
    breakpoint="xl"
    collapsed-width="0"
  >
    <div class="h-[calc(100vh-64px)] flex flex-col">
      <!-- 搜索框 -->
      <div id="search-box">
        <SearchOutlined />
        <a-auto-complete
          v-model:value="value"
          :dropdown-match-select-width="300"
          :bordered="false"
          style="width: 100%"
          :options="dataSource"
          @select="onSelect"
          @search="onSearch"
          placeholder="搜索物品"
        >
          <template #option="item">
            <div style="display: flex; justify-content: space-between">
              <a-avatar shape="square" :src="getIconByIconID(item.icon)" />
              <span>{{ item.name }}</span>
            </div>
          </template>
        </a-auto-complete>
        <a-button @click="go">
          <template #icon><CaretRightOutlined /></template>
        </a-button>
        <a-button @click="projectStore.saveProject">
          <template #icon><SaveOutlined /></template>
        </a-button>
      </div>
      <!-- 物品列表 -->
      <a-alert
        v-if="projectStore.firstUse"
        message="点击图片删除物品"
        banner
        type="info"
        closable
      />
      <a-list
        class="overflow-y-auto"
        id="item-list"
        item-layout="horizontal"
        :data-source="counterStore.itemList"
      >
        <template #renderItem="{ item }">
          <a-list-item>
            <template #actions>
              <a-input-number v-model:value="item.amount" :min="1" style="width: 70px" />
            </template>
            <a-popconfirm
              title="你确定要删除这个物品吗?"
              ok-text="Yes"
              cancel-text="No"
              @confirm="() => confirm(item)"
              @click="(e: MouseEvent) => e.stopPropagation()"
            >
              <a-tooltip placement="topLeft" title="点击删除">
                <a-avatar shape="square" :src="getIconByIconID(item.icon)" />
              </a-tooltip>
            </a-popconfirm>
            <span>{{ item.name }}</span>
          </a-list-item>
        </template>
      </a-list>
    </div>
  </a-layout-sider>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import { debounce } from 'lodash-es';
import { message } from 'ant-design-vue';

import { useCounterStore } from '@/stores/counter';
import { useProjectStore } from '@/stores/projectManager';
import { useAlarmStore } from '@/stores/alarm';
import { searchRecipe, getIconByIconID } from '@/calculator';

import type { SearchResult } from '@/calculator/searchHelper';
import type Material from '@/calculator/model/material';

const value = ref<string>('');
const dataSource = ref<SearchResult[]>([]);

const counterStore = useCounterStore();
const projectStore = useProjectStore();
const alarmStore = useAlarmStore();

const onSearch = debounce((key: string) => {
  dataSource.value = searchRecipe(key);
  dataSource.value.forEach((v) => (v.value = v.name));
}, 200);

const go = async () => {
  await counterStore.work();
  const toRservedAlarms = counterStore.gatheringPoints.filter((x) =>
    alarmStore.alarmIdSet.has(x.id)
  );
  alarmStore.reset();
  toRservedAlarms.forEach((x) => alarmStore.addAlarm(x.id));
};

const onSelect = (_: string, option: SearchResult) => {
  if (!counterStore.itemList.find((x) => x.id == option.id)) {
    counterStore.itemList.push({ ...option, amount: 1 });
  }
};

const confirm = (item: Material) => {
  message.success('成功删除物品:' + item.name);
  counterStore.removeItem(item.id);
};
</script>

<style lang="postcss" scoped>
#search-box {
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  & > .ant-btn {
    flex-shrink: 0;
  }
}
</style>

<style>
#item-list .ant-list-item-action {
  margin-inline-start: 8px !important;
}
</style>
