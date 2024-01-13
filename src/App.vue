<template>
  <a-layout style="min-height: 100vh">
    <!-- 顶部导航栏 -->
    <a-layout-header class="header">
      <div class="logo">
        <h1>
          <router-link to="/"><img :src="logo" width="32" height="32" />RecipeHelper</router-link>
        </h1>
      </div>
      <project-menu />
    </a-layout-header>

    <a-layout>
      <!-- 侧边栏 -->
      <router-view name="sidebar" />
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
import ProjectMenu from '@components/ProjectMenu.vue'
import logo from '@/assets/Logo.png'
</script>

<style scoped>
.logo {
  float: left;
}
.logo h1 {
  margin: 0;
}
.logo img {
  margin-right: 16px;
  vertical-align: middle;
}
.logo a {
  color: rgba(0, 0, 0, 0.88);
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
