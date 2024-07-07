<template>
  <a-modal v-model:open="open" title="新建项目" @ok="handleOk">
    <template #footer>
      <a-button key="back" @click="handleCancel">取消</a-button>
      <a-button key="submit" type="primary" @click="handleOk">创建</a-button>
    </template>
    <a-input v-model:value.lazy="name" placeholder="请输入项目名称"></a-input>
  </a-modal>
  <div id="main">
    <a-empty>
      <template #description>
        <h1>请先创建项目</h1>
      </template>
      <a-button type="primary" @click="showModal">新建项目</a-button>
    </a-empty>
    <div class="tw">
      <div class="mt-10 text-xs">
        <span>如有更好的建议或遇计算错误、信息错误等情况</span>
        <li class="mt-1">
          请反馈至邮箱
          <a-tag color="error">
            <template #icon> <MailOutlined /> </template>
            a8kt@foxmail.com
          </a-tag>
        </li>
        <li class="mt-1">
          或在github上提issue
          <a-tag color="error">
            <template #icon> <GithubOutlined /> </template>
            <a href="https://github.com/Paomiantong/RecipeHelper/issues/new" target="_blank">
              RecipeHelper
            </a>
          </a-tag>
        </li>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { useProjectStore } from '@/stores/projectManager';

const projectStore = useProjectStore();
const router = useRouter();

const open = ref<boolean>(false);
const name = ref<string>('');

const showModal = () => {
  open.value = true;
};

const handleOk = () => {
  projectStore.newProject(name.value);
  open.value = false;
  router.push({ name: 'work' });
};

const handleCancel = () => {
  open.value = false;
};
</script>

<style scoped>
#main {
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
