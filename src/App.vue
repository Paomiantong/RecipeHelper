<template>
  <a-layout>
    <!-- 顶部导航栏 -->
    <a-layout-header class="header">
      <div class="logo">
        <h1><router-link to="/">RecipeHelper</router-link></h1>
      </div>
      <a-menu mode="horizontal" style="flex-shrink: 0" @click="onMenuClock">
        <a-menu-item v-for="item in projectStore.projectList" :key="item">
          <span style="padding: 0 8px">{{ item }}</span>
          <a-popconfirm
            title="你确定要删除这个项目吗?"
            ok-text="Yes"
            cancel-text="No"
            @confirm="() => confirm(item)"
          >
            <a-button type="link" size="small" :icon="h(DeleteFilled)"></a-button>
          </a-popconfirm>
        </a-menu-item>
      </a-menu>
    </a-layout-header>

    <a-layout>
      <!-- 侧边栏 -->
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

      <!-- 主体 -->
      <a-layout style="padding: 0 24px 24px">
        <!-- 导航 -->
        <a-breadcrumb style="margin: 16px 0">
          <a-breadcrumb-item>Home</a-breadcrumb-item>
          <a-breadcrumb-item>List</a-breadcrumb-item>
          <a-breadcrumb-item>App</a-breadcrumb-item>
        </a-breadcrumb>
        <a-layout-content
          :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '280px' }"
        >
          <RouterView />
        </a-layout-content>
        <a-layout-footer style="text-align: center">
          Data,image FINAL FANTASY XIV©2010 - 2024 SQUARE ENIX CO., LTD. All Rights Reserved.
        </a-layout-footer>
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script lang="ts" setup>
import { h, ref } from 'vue'

import { debounce } from 'lodash-es'
import { message } from 'ant-design-vue'
import { DeleteFilled } from '@ant-design/icons-vue'

import { useCounterStore } from '@/stores/counter'
import { useProjectStore } from './stores/projectManager'
import { helpers } from '@/calculator'

import type { MenuInfo } from 'ant-design-vue/es/menu/src/interface'
import type { SearchResult } from '@/calculator/searchHelper'
import { useRouter } from 'vue-router'

const value = ref<string>('')
const dataSource = ref<SearchResult[]>([])

const counterStore = useCounterStore()
const projectStore = useProjectStore()
const router = useRouter()

const confirm = (item: string) => {
  message.success('Delete Project:' + item)
  if (projectStore.deleteProject(item)) {
    router.push({ name: 'home' })
  }
}

const onSearch = debounce((key: string) => {
  dataSource.value = helpers.searchRecipe(key)
  dataSource.value.forEach((v) => (v.value = v.name))
}, 200)

const onSelect = (_: string, option: SearchResult) => {
  if (!counterStore.itemList.find((x) => x.id == option.id)) {
    counterStore.itemList.push({ ...option, amount: 1 })
  }
}

const onMenuClock = ({ key }: MenuInfo) => {
  projectStore.switchProject(key as string)
  router.push({ name: 'work' })
}
</script>

<style scoped>
.logo {
  float: left;
}
.logo h1 {
  margin: 0;
}
#search-box {
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.site-layout-background {
  background: #fff;
}

.ant-layout-header {
  background: #fff;
  box-shadow:
    0 1px 2px 0 rgba(0, 0, 0, 0.03),
    0 1px 6px -1px rgba(0, 0, 0, 0.02),
    0 2px 4px 0 rgba(0, 0, 0, 0.02);
  z-index: 99;
}
</style>

<style>
#item-list .ant-list-item-action {
  margin-inline-start: 8px !important;
}
</style>
