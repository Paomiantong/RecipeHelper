<template>
  <a-menu
    :selectedKeys="projectStore.selectedKey"
    mode="horizontal"
    style="flex-shrink: 0"
    @click="onMenuClock"
  >
    <a-menu-item v-for="item in projectStore.projectList" :key="item">
      <span style="padding: 0 8px">{{ item }}</span>
      <a-popconfirm
        title="你确定要删除这个项目吗?"
        ok-text="Yes"
        cancel-text="No"
        @confirm="() => confirm(item)"
        @click="(e: MouseEvent) => e.stopPropagation()"
      >
        <a-button type="link" size="small" :icon="h(DeleteFilled)"></a-button>
      </a-popconfirm>
    </a-menu-item>
  </a-menu>
</template>

<script lang="ts" setup>
import { h } from 'vue';
import { message } from 'ant-design-vue';
import { DeleteFilled } from '@ant-design/icons-vue';

import { useProjectStore } from '@/stores/projectManager';

import type { MenuInfo } from 'ant-design-vue/es/menu/src/interface';
import { useRouter } from 'vue-router';

const projectStore = useProjectStore();
const router = useRouter();

const confirm = (item: string) => {
  message.success('Delete Project:' + item);
  if (projectStore.deleteProject(item)) {
    router.push({ name: 'home' });
  }
};

const onMenuClock = ({ key }: MenuInfo) => {
  projectStore.switchProject(key as string);
  router.push({ name: 'work' });
};
</script>
