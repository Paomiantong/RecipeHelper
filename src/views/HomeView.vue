<template>
  <a-modal v-model:open="open" title="新建项目" @ok="handleOk">
    <template #footer>
      <a-button key="back" @click="handleCancel">Return</a-button>
      <a-button key="submit" type="primary" @click="handleOk">Submit</a-button>
    </template>
    <a-input v-model:value.lazy="name" placeholder="请输入项目名称"></a-input>
  </a-modal>
  <h1>请先创建项目</h1>
  <a-button type="primary" @click="showModal">新建项目</a-button>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { useProjectStore } from '@/stores/projectManager'

const projectStore = useProjectStore()
const router = useRouter()

const open = ref<boolean>(false)
const name = ref<string>('')

const showModal = () => {
  open.value = true
}

const handleOk = () => {
  projectStore.newProject(name.value)
  open.value = false
  router.push({ name: 'work' })
}

const handleCancel = () => {
  open.value = false
}
</script>
